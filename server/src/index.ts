import { Hono } from "hono";
import { cors } from "hono/cors";
import { taskRoutes } from "./routes/tasks";
import { picRoutes } from "./routes/pic";

const app = new Hono().basePath("/api/v1");

// middlewares
app.use("/*", cors({ origin: [process.env.CLIENT_URL] }));

// routes
app.route("/task/", taskRoutes);

app.route("/pic/", picRoutes);

export default { port: process.env.PORT, fetch: app.fetch };
