import { Hono } from "hono";
import {
  assignTaskvalidator,
  createTaskValidator,
  moveTaskValidator,
  taskIdParamValidator,
} from "../validators/task";
import { setData, getData, getPicList } from "../../data";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { tasksTable } from "../db/schemas";

const taskRoutes = new Hono();

// get all tasks
taskRoutes.get("/", async (c) => {
  try {
    const tasks = await db.query.tasksTable.findMany({
      columns: {
        isDeleted: false,
        picId: false,
      },
      with: { pic: true },
    });
    return c.json(tasks);
  } catch (error) {
    return c.json({ message: "Error getting tasks" }, 500);
  }
});

// chain for id route
taskRoutes.get("/:id", taskIdParamValidator, async (c) => {
  const data = c.req.param();
  try {
    const task = await db.query.tasksTable.findFirst({
      where: eq(tasksTable.id, Number(data.id)),
    });
    return c.json(task);
  } catch (error) {
    return c.json({ message: "Error getting task data" }, 500);
  }
});

// chain for id route
taskRoutes.post("/", createTaskValidator, async (c) => {
  const data = c.req.valid("json");
  try {
    const newTask = await db.insert(tasksTable).values(data);

    return c.json({ message: "Success" });
  } catch (error) {
    return c.json({ message: "Error creating task" }, 500);
  }
});

taskRoutes.put("/", moveTaskValidator, async (c) => {
  const moveData = c.req.valid("json");
  try {
    await db
      .update(tasksTable)
      .set({ status: moveData.status })
      .where(eq(tasksTable.id, moveData.taskId));

    return c.json({ message: "success" });
  } catch (error) {
    return c.json({ message: "Error moving task" }, 500);
  }
});

taskRoutes.put("/assign", assignTaskvalidator, async (c) => {
  const moveData = c.req.valid("json");

  try {
    const updateData = await db
      .update(tasksTable)
      .set({ picId: moveData.picId })
      .where(eq(tasksTable.id, moveData.taskId));

    return c.json({ message: "success" });
  } catch (error) {
    return c.json({ message: "Error assigning data" }, 500);
  }
});

export { taskRoutes };
