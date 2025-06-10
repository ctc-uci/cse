import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const corequisitesRouter = express.Router();

corequisitesRouter.use(express.json());

corequisitesRouter.get("/class/:classId", async (req, res) => {
  const classId = req.params.classId;
  try {
    const result = await db.query(
      ` SELECT * FROM corequisites WHERE class_id = $1;`,
      [classId]
    );
    // use the event_id from result to get the coreqs of the event
    if (result?.data) {
      res.status(404).json({ error: "Error fetching coreqs for this class." });
      return;
    }
    // there should only be one event per class
    const coreqEvent = result[0]?.event_id;
    const coreqResult = await db.query(
      `SELECT * FROM corequisites JOIN classes on classes.id = corequisites.class_id WHERE class_id != $1 AND event_id = $2;`,
      [classId, coreqEvent]
    );

    res.status(200).json(keysToCamel(coreqResult));
  } catch (err) {
    res.status(500).json({ error: err.message });
    return;
  }
});

corequisitesRouter.get("/", async (req, res) => {
  try {
    const result = await db.query(`
            SELECT * FROM corequisites;
        `);

    res.json(keysToCamel(result));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

corequisitesRouter.get("/:id", async (req, res) => {
  const classId = req.params.id;

  try {
    const result = await db.query(
      `
            SELECT * FROM corequisites WHERE class_id = $1;
        `,
      [classId]
    );

    res.json(keysToCamel(result));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

corequisitesRouter.put("/:class_id/:event_id", async (req, res) => {
  const { class_id, event_id } = req.params;

  try {
    // if class id doesnt exist yet, create new entry, else update
    const result = await db.query(
      `
            INSERT INTO corequisites (class_id, event_id)
            VALUES ($1, $2)
            ON CONFLICT (class_id, event_id) DO UPDATE
            SET event_id = EXCLUDED.event_id
            RETURNING *;
        `,
      [class_id, event_id]
    );

    res.json(keysToCamel(result));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

corequisitesRouter.delete("/class/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `DELETE FROM corequisites WHERE class_id = $1 RETURNING *;`,
      [id]
    );
    res.json(keysToCamel(result));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export { corequisitesRouter };
