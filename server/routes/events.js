import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const eventsRouter = express.Router();
eventsRouter.use(express.json());

eventsRouter.get("/search/published/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const search = `%${name}%`;
    const allEvents = await db.query(
      `SELECT
        e.*,
        (SELECT COUNT(*) FROM event_enrollments ee WHERE ee.event_id = e.id) AS attendee_count
        FROM events e
        WHERE e.title ILIKE $1 AND e.is_draft = false;`,
      // "SELECT * FROM events WHERE title ILIKE $1 AND is_draft = false;",
      [search]
    );
    res.status(200).json(keysToCamel(allEvents));
  } catch (err) {
    res.status(500).send(err.message);
  }
});
eventsRouter.get("/search/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const search = `%${name}%`;
    const allEvents = await db.query(
      `SELECT
        e.*,
        (SELECT COUNT(*) FROM event_enrollments ee WHERE ee.event_id = e.id) AS attendee_count
        FROM events e
        WHERE e.title ILIKE $1;`,
      // "SELECT * FROM events WHERE title ILIKE $1;",
      [search]
    );
    res.status(200).json(keysToCamel(allEvents));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

eventsRouter.get("/count", async (req, res) => {
  const { search } = req.query;
  try {
    const query = `
      SELECT COUNT(*)
      FROM events
      ${search ? "WHERE title ILIKE $1" : ""};
    `;

    const eventCount = await db.query(query, search ? [`%${search}%`] : []);

    res.status(200).json(keysToCamel(eventCount));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

eventsRouter.get("/corequisites/:eventid/:userid", async (req, res) => {
  try {
    const { eventid, userid } = req.params;
    const corequisites = await db.query(
      `SELECT DISTINCT ON (c.id) c.*, 
              CASE WHEN ce.student_id IS NOT NULL THEN true ELSE false END AS enrolled
        FROM classes c
        JOIN corequisites co ON c.id = co.class_id
        FULL OUTER JOIN class_enrollments ce ON ce.class_id = c.id AND ce.student_id = $1
        WHERE co.event_id = $2;`,
      [userid, eventid]
    );

    res.status(200).json(keysToCamel(corequisites));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

eventsRouter.get(`/drafts`, async (req, res) => {
  try {
    const drafts = await db.query(
      `SELECT * FROM events WHERE is_draft = true;`,
      []
    );
    res.status(200).json(keysToCamel(drafts));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

eventsRouter.get("/published", async (req, res) => {
  try {
    const drafts = await db.query(
      `SELECT * FROM events WHERE is_draft = false;`,
      []
    );
    res.status(200).json(keysToCamel(drafts));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

eventsRouter.get("/all", async (req, res) => {
  try {
    const eventID = await db.query("SELECT * FROM events;");

    res.status(200).json(keysToCamel(eventID));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

eventsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const eventID = await db.query("SELECT * FROM events WHERE id = $1", [id]);

    res.status(200).json(keysToCamel(eventID));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

eventsRouter.get("/", async (req, res) => {
  const { search, page, reverse } = req.query;
  const pageNum = page ? parseInt(page) : 0;
  const reverseSearch = reverse && reverse === "true";

  try {
    const query = `
      SELECT *
      FROM events
      ${search ? "WHERE title ILIKE $1" : ""}
      ORDER BY date ${reverseSearch ? "ASC" : "DESC"}, LOWER(title) ASC
      LIMIT 10 OFFSET $2;
    `;

    const allEvents = await db.query(query, [`%${search}%`, 10 * pageNum]);

    res.status(200).json(keysToCamel(allEvents));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

eventsRouter.post("/", async (req, res) => {
  try {
    const {
      location,
      title,
      description,
      level,
      date,
      start_time,
      end_time,
      call_time,
      costume,
      capacity,
      is_draft,
    } = req.body;
    const result = await db.query(
      "INSERT INTO events (location, title, description, level, date, start_time, end_time, call_time, costume, capacity, is_draft) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *;",
      [
        location,
        title,
        description,
        level,
        date,
        start_time,
        end_time,
        call_time,
        costume,
        capacity,
        is_draft,
      ]
    );

    res.status(201).json(keysToCamel(result));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

eventsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      location,
      title,
      description,
      level,
      date,
      start_time,
      end_time,
      call_time,
      costume,
      is_draft,
      capacity,
    } = req.body;

    const query = `UPDATE events SET
        location = COALESCE($1, location),
        title = COALESCE($2, title),
        description = COALESCE($3, description),
        level = COALESCE($4, level),
        date = COALESCE($5, date),
        start_time = COALESCE($6, start_time),
        end_time = COALESCE($7, end_time),
        call_time = COALESCE($8, call_time),
        costume = COALESCE($9, costume),
        is_draft = COALESCE($10, is_draft),
        capacity = COALESCE($11, capacity)
        WHERE id = $12 RETURNING *;`;

    const updatedEvent = await db.query(query, [
      location,
      title,
      description,
      level,
      date,
      start_time,
      end_time,
      call_time,
      costume,
      is_draft,
      capacity,
      id,
    ]);

    return res.status(200).send(keysToCamel(updatedEvent));
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

eventsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEvent = await db.query(
      `DELETE FROM events WHERE id = $1 RETURNING *;`,
      [id]
    );
    res.status(200).send(keysToCamel(deletedEvent));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export { eventsRouter };
