import { Hono } from "hono";
import { getPicList, setPicList } from "../../data";
import { createPicValidator } from "../validators/pic";

const picRoutes = new Hono();

// get all pic
picRoutes.get("/", (c) => {
  return c.json({ picList: getPicList() });
});

// chain for id route
picRoutes.get("/:id", (c) => {
  return c.json({});
});

// chain for id route
picRoutes.post("/", createPicValidator, (c) => {
  const currentPicList = getPicList();
  const newData = c.req.valid("json");
  // add new pic to currentPicLis
  currentPicList.push({
    id: currentPicList.length + 1,
    name: newData.name,
  });
  setPicList(currentPicList);
  return c.json({ message: "success" });
});

// picRoutes.put("/", moveTaskValidator, (c) => {
//   const moveData = c.req.valid("json");
//
//   const updatedData = getPicList().map((task) => {
//     if (task.id === moveData.taskId)
//       return { ...task, status: moveData.status };
//     return task;
//   });
//
//   setPicList(updatedData);
//
//   return c.json({ message: "success" });
// });

export { picRoutes };
