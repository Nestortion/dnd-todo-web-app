import { Hono } from "hono";
import {
  createPicValidator,
  getAllQueryValidator,
  movePicValidator,
} from "../validators/pic";
import { db } from "../db";
import { taskIdParamValidator } from "../validators/task";
import { and, asc, eq, getTableColumns, inArray } from "drizzle-orm";
import { picsTable, picToSeatTables, seatTablesTable } from "../db/schemas";

const picRoutes = new Hono();

// get all pic
picRoutes.get("/", getAllQueryValidator, async (c) => {
  const query = c.req.valid("query");
  try {
    const { isDeleted, ...picDetails } = getTableColumns(picsTable);
    const pics = await db
      .selectDistinct({
        ...picDetails,
        seatNumber: picToSeatTables.seatNumber,
      })
      .from(picToSeatTables)
      .innerJoin(
        seatTablesTable,
        and(
          query.projectId
            ? eq(seatTablesTable.projectId, query.projectId)
            : undefined,
          query.seatTableId
            ? eq(picToSeatTables.seatTableId, query.seatTableId)
            : undefined,
        ),
      )
      .innerJoin(picsTable, eq(picsTable.id, picToSeatTables.picId))
      .orderBy(asc(picToSeatTables.seatNumber));

    return c.json(
      pics.map((p) => ({
        ...p,
        profileImage: `https://avatar.iran.liara.run/public/${p.id}`,
      })),
    );
  } catch (error) {
    console.log(error);
    return c.json({ message: "Error getting pics" }, 500);
  }
});

// chain for id route
picRoutes.get("/:id", taskIdParamValidator, async (c) => {
  const param = c.req.valid("param");
  try {
    const pic = await db.query.picsTable.findFirst({
      where: and(eq(picsTable.id, param.id), eq(picsTable.isDeleted, false)),
    });

    return c.json(pic);
  } catch (error) {
    return c.json({ message: "Error getting pic" }, 500);
  }
});

// chain for id route
picRoutes.post("/", createPicValidator, async (c) => {
  const newData = c.req.valid("json");
  try {
    await db.transaction(async (tx) => {
      const newPic = await tx.insert(picsTable).values(newData);

      return c.json({ message: "success" });
    });
  } catch (error) {
    return c.json({ message: "Error creating pic" }, 500);
  }
});

// move pic
picRoutes.put("/", movePicValidator, async (c) => {
  const data = c.req.valid("json");
  try {
    await db.transaction(async (tx) => {
      const target = await tx.query.picToSeatTables.findFirst({
        where: and(
          eq(picToSeatTables.seatTableId, data.target.seatTableId),
          eq(picToSeatTables.picId, data.target.picId),
        ),
      });
      const current = await tx.query.picToSeatTables.findFirst({
        where: and(
          eq(picToSeatTables.seatTableId, data.current.seatTableId),
          eq(picToSeatTables.picId, data.current.picId),
        ),
      });

      // update target
      await tx
        .update(picToSeatTables)
        .set({
          seatTableId: current!.seatTableId,
          seatNumber: current!.seatNumber,
        })
        .where(eq(picToSeatTables.id, target!.id));

      // update current
      await tx
        .update(picToSeatTables)
        .set({
          seatTableId: target!.seatTableId,
          seatNumber: target!.seatNumber,
        })
        .where(eq(picToSeatTables.id, current!.id));
    });

    return c.json({ message: "success" });
  } catch (error) {
    console.log(error);
    return c.json({ message: "Error moving task" }, 500);
  }
});

export { picRoutes };
