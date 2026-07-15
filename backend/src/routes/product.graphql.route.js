import express from "express";
import { ProductRoute } from "../graphql/index.js";
// npm install ruru  (a modern, actively maintained GraphiQL-style IDE, single dependency, easy to mount)
import { ruruHTML } from "ruru/server";

const router = express.Router();

// Dev-only interactive explorer, GET only
if (process.env.NODE_ENV !== "production") {
  router.get("/", (req, res) => {
    res.type("html").send(ruruHTML({ endpoint: "/api/products" }));
  });
}

// Actual GraphQL execution — POST only, all environments
router.post("/", ProductRoute);

export default router;