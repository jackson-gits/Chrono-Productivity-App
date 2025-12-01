import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-c9339a2a/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all tasks
app.get("/make-server-c9339a2a/tasks", async (c) => {
  try {
    const tasks = await kv.get("chrono:tasks");
    return c.json({ tasks: tasks || [] });
  } catch (error) {
    console.log("Error fetching tasks:", error);
    return c.json({ error: "Failed to fetch tasks", details: String(error) }, 500);
  }
});

// Create or update tasks (bulk operation)
app.post("/make-server-c9339a2a/tasks", async (c) => {
  try {
    const { tasks } = await c.req.json();
    await kv.set("chrono:tasks", tasks);
    return c.json({ success: true, tasks });
  } catch (error) {
    console.log("Error saving tasks:", error);
    return c.json({ error: "Failed to save tasks", details: String(error) }, 500);
  }
});

// Delete a specific task
app.delete("/make-server-c9339a2a/tasks/:id", async (c) => {
  try {
    const taskId = c.req.param("id");
    const tasks = await kv.get("chrono:tasks") || [];
    const updatedTasks = tasks.filter((task: any) => task.id !== taskId);
    await kv.set("chrono:tasks", updatedTasks);
    return c.json({ success: true, tasks: updatedTasks });
  } catch (error) {
    console.log("Error deleting task:", error);
    return c.json({ error: "Failed to delete task", details: String(error) }, 500);
  }
});

// Get focus sessions
app.get("/make-server-c9339a2a/focus-sessions", async (c) => {
  try {
    const sessions = await kv.get("chrono:focus-sessions");
    return c.json({ sessions: sessions || [] });
  } catch (error) {
    console.log("Error fetching focus sessions:", error);
    return c.json({ error: "Failed to fetch focus sessions", details: String(error) }, 500);
  }
});

// Add focus session
app.post("/make-server-c9339a2a/focus-sessions", async (c) => {
  try {
    const { sessions } = await c.req.json();
    await kv.set("chrono:focus-sessions", sessions);
    return c.json({ success: true, sessions });
  } catch (error) {
    console.log("Error saving focus session:", error);
    return c.json({ error: "Failed to save focus session", details: String(error) }, 500);
  }
});

// Get user data (streak, points, badges)
app.get("/make-server-c9339a2a/user-data", async (c) => {
  try {
    const userData = await kv.get("chrono:user-data");
    return c.json({ 
      userData: userData || { 
        streak: 0, 
        totalPoints: 0, 
        badges: [],
        totalFocusSessions: 0,
        totalFocusMinutes: 0
      } 
    });
  } catch (error) {
    console.log("Error fetching user data:", error);
    return c.json({ error: "Failed to fetch user data", details: String(error) }, 500);
  }
});

// Update user data
app.post("/make-server-c9339a2a/user-data", async (c) => {
  try {
    const { userData } = await c.req.json();
    await kv.set("chrono:user-data", userData);
    return c.json({ success: true, userData });
  } catch (error) {
    console.log("Error saving user data:", error);
    return c.json({ error: "Failed to save user data", details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);