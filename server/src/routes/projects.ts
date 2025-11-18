import { Hono } from "hono";
import { db } from "../db";
import { createProjectRequestValidator } from "../validators/project";
import { projectsTable } from "../db/schemas";
import { eq } from "drizzle-orm";

const projectRoutes = new Hono();

// get all projects
projectRoutes.get("/", async (c) => {
  try {
    const projects = await db.query.projectsTable.findMany({
      columns: {
        isDeleted: false,
      },
    });
    return c.json(projects);
  } catch (error) {
    return c.json({ message: "Error getting projects" }, 500);
  }
});

// get project by id
projectRoutes.get("/:projectId", async (c) => {
  try {
    const project = await db.query.projectsTable.findFirst({
      columns: {
        isDeleted: false,
      },
      where: eq(projectsTable.id, Number(c.req.param("projectId"))),
    });
    return c.json(project);
  } catch (error) {
    return c.json({ message: "Error getting projects" }, 500);
  }
});

// create project
projectRoutes.post("/", createProjectRequestValidator, async (c) => {
  try {
    const body = c.req.valid("json");
    const projectId = await db.transaction(async (tx) => {
      const newProject = await tx
        .insert(projectsTable)
        .values({ ...body, createBy: "default" })
        .$returningId();
      return newProject[0]?.id;
    });
    return c.json({ message: "success", projectId });
  } catch (error) {
    console.log(error);
    return c.json({ message: "Error creating project" }, 500);
  }
});

export { projectRoutes };
