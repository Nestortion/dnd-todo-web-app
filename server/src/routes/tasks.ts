import { Hono } from "hono";
import { getTaskByIdValidator } from "../validators/task";

const taskRoutes = new Hono();

// get all tasks
taskRoutes.get("/", (c) => {
  return c.json({});
});

// chain for id route
taskRoutes.get("/:id", getTaskByIdValidator, (c) => {
  return c.json({});
});

// chain for id route
taskRoutes.post("/", getTaskByIdValidator, (c) => {
  return c.json({});
});

export { taskRoutes };
