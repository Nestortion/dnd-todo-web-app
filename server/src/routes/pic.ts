import { Hono } from "hono";
import {
  createPicValidator,
  getAllQueryValidator,
  getTablePicQueryValidator,
  getUnassignedPicQueryValidator,
  movePicValidator,
} from "../validators/pic";
import { db } from "../db";
import { taskIdParamValidator } from "../validators/task";
import {
  and,
  asc,
  desc,
  eq,
  getTableColumns,
  inArray,
  isNotNull,
  isNull,
} from "drizzle-orm";
import { picsTable, picToSeatTables, seatTablesTable } from "../db/schemas";
import { picToProjectsTables } from "../db/schemas/pic-to-projects";
import type { PIC } from "../validators/pic/schema";

const picRoutes = new Hono();

// get all pic
picRoutes.get("/", getAllQueryValidator, async (c) => {
  const query = c.req.valid("query");
  try {
    const { isDeleted, ...picDetails } = getTableColumns(picsTable);

    let pics;

    if (!query.seatTableId) {
      pics = await db
        .selectDistinct({
          ...picDetails,
        })
        .from(picToProjectsTables)
        .innerJoin(picsTable, eq(picsTable.id, picToProjectsTables.picId));
    } else {
      pics = await db
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
            eq(picToSeatTables.seatTableId, query.seatTableId),
          ),
        )
        .innerJoin(picsTable, eq(picsTable.id, picToSeatTables.picId))
        .orderBy(asc(picToSeatTables.seatNumber));
    }

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

// get table pics by projectId
picRoutes.get(
  "/table-pics/:projectId",
  getTablePicQueryValidator,
  async (c) => {
    const param = c.req.valid("param");
    try {
      const { isDeleted, ...picDetails } = getTableColumns(picsTable);

      let pics = await db
        .selectDistinct({
          seatTableId: picToSeatTables.seatTableId,
          pics: { ...picDetails, seatNumber: picToSeatTables.seatNumber },
        })
        .from(picToProjectsTables)
        .leftJoin(
          picToSeatTables,
          and(
            eq(picToSeatTables.picId, picToProjectsTables.picId),
            eq(picToProjectsTables.projectId, param.projectId),
          ),
        )
        .innerJoin(picsTable, eq(picsTable.id, picToProjectsTables.picId))
        .where(isNotNull(picToSeatTables.id))
        .orderBy(asc(picToSeatTables.seatNumber));

      const data: Record<
        number,
        Array<Omit<typeof picsTable._.inferSelect, "isDeleted">>
      > = {};

      pics.forEach((r) => {
        const arr = data[r.seatTableId!] ?? [];
        data[r.seatTableId!] = [
          ...arr,
          {
            ...r.pics,
            profileImage: `https://avatar.iran.liara.run/public/${r.pics.id}`,
          },
        ];
      });

      return c.json(data);
    } catch (error) {
      console.log(error);
      return c.json({ message: "Error getting pics" }, 500);
    }
  },
);

// get all unassigned pic by projectId
picRoutes.get(
  "/unassigned/:projectId",
  getUnassignedPicQueryValidator,
  async (c) => {
    const param = c.req.valid("param");
    try {
      const { isDeleted, ...picDetails } = getTableColumns(picsTable);

      let pics = await db
        .selectDistinct({
          ...picDetails,
        })
        .from(picToProjectsTables)
        .leftJoin(
          picToSeatTables,
          and(
            eq(picToSeatTables.picId, picToProjectsTables.picId),
            eq(picToProjectsTables.projectId, param.projectId),
          ),
        )
        .innerJoin(picsTable, eq(picsTable.id, picToProjectsTables.picId))
        .where(isNull(picToSeatTables.id));

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
  },
);

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
      if (data.type === "assign") {
        const existingSeatTable = await tx
          .select({ seatTableId: picToSeatTables.id })
          .from(picToProjectsTables)
          .innerJoin(
            picToSeatTables,
            eq(picToProjectsTables.picId, picToSeatTables.picId),
          )
          .where(eq(picToProjectsTables.picId, data.current.picId))
          .limit(1);

        if (existingSeatTable[0]) {
          await tx
            .delete(picToSeatTables)
            .where(eq(picToSeatTables.id, existingSeatTable[0].seatTableId));
        }

        const currentSeatNumber = await tx
          .select()
          .from(picToSeatTables)
          .where(eq(picToSeatTables.seatTableId, data.current.seatTableId))
          .orderBy(desc(picToSeatTables.seatNumber))
          .limit(1);

        await tx.insert(picToSeatTables).values({
          picId: data.current.picId,
          seatTableId: data.current.seatTableId,
          seatNumber: currentSeatNumber[0]
            ? currentSeatNumber[0].seatNumber + 1
            : 1,
        });
      } else if (data.type === "unassign") {
        await tx
          .delete(picToSeatTables)
          .where(
            and(
              eq(picToSeatTables.picId, data.current.picId),
              eq(picToSeatTables.seatTableId, data.current.seatTableId),
            ),
          );
      } else if (data.type === "move") {
        const target = await tx.query.picToSeatTables.findFirst({
          where: and(
            eq(picToSeatTables.seatTableId, data.target!.seatTableId),
            eq(picToSeatTables.picId, data.target!.picId),
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
      }
    });

    return c.json({ message: "success" });
  } catch (error) {
    console.log(error);
    return c.json({ message: "Error moving task" }, 500);
  }
});

export { picRoutes };
