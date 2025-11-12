import { Hono } from "hono";
import {
  assignTaskvalidator,
  createTaskValidator,
  m,
  moveTaskValidator,
} from "../validators/task";
import { setData, getData, getPicList } from "../../data";

const taskRoutes = new Hono();

// get all tasks
taskRoutes.get("/", (c) => {
  return c.json({ tasks: getData() });
});

// chain for id route
taskRoutes.get("/:id", (c) => {
  return c.json({});
});

// chain for id route
taskRoutes.post("/", createTaskValidator, (c) => {
  const currentData = getData();
  const newData = c.req.valid("json");

  const pic = getPicList().find((p) => p.id === newData.picId);

  // add new data to currentData
  currentData.push({
    ...newData,
    id: currentData.length + 1,
    dateCreated: new Date(),
    isDeleted: false,
    status: "Backlog",
    pic,
  });
  setData(currentData);
  return c.json({ message: "success" });
});

taskRoutes.put("/", moveTaskValidator, (c) => {
  const moveData = c.req.valid("json");

  const updatedData = getData().map((task) => {
    if (task.id === moveData.taskId)
      return { ...task, status: moveData.status };
    return task;
  });

  setData(updatedData);

  return c.json({ message: "success" });
});

taskRoutes.put("/assign", assignTaskvalidator, (c) => {
  const moveData = c.req.valid("json");

  const pic = getPicList().find((p) => p.id === moveData.picId);

  const updatedData = getData().map((task) => {
    if (task.id === moveData.taskId) return { ...task, pic };
    return task;
  });

  setData(updatedData);

  return c.json({ message: "success" });
});

export { taskRoutes };
