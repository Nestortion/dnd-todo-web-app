import { Hono } from "hono";
import { getPicList, setPicList } from "../../data";
import { createPicValidator, movePicValidator } from "../validators/pic";
import { db } from "../db";
import { taskIdParamValidator } from "../validators/task";
import { and, eq } from "drizzle-orm";
import { picsTable } from "../db/schemas";

const picRoutes = new Hono();

// get all pic
picRoutes.get("/", async (c) => {
  try {
    const pics = await db.query.picsTable.findMany({
      columns: { isDeleted: false },
    });

    return c.json(pics);
  } catch (error) {
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
    const newPic = await db.insert(picsTable).values(newData);

    return c.json({ message: "success" });
  } catch (error) {
    return c.json({ message: "Error creating pic" }, 500);
  }
});

picRoutes.put("/", movePicValidator, async (c) => {
  const data = c.req.valid("json");
  try {
    const targetPIC = await db.query.picsTable.findFirst({
      where: eq(picsTable.id, data.targetPicId),
    })!;
    const selectedPIC = await db.query.picsTable.findFirst({
      where: eq(picsTable.id, data.selectedPicId),
    });

    await db.update(picsTable).set({
      ...targetPIC,
      tableId: selectedPIC!.tableId,
      seatNumber: selectedPIC!.seatNumber,
    });

    await db.update(picsTable).set({
      ...selectedPIC,
      tableId: targetPIC!.tableId,
      seatNumber: targetPIC!.seatNumber,
    });

    return c.json({ message: "success" });
  } catch (error) {
    return c.json({ message: "Error moving task" }, 500);
  }
});

export { picRoutes };
