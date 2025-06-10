import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const eventTagsRouter = express.Router();

eventTagsRouter.use(express.json());

eventTagsRouter.get("/all-event-tags", async (req, res) => {
  try {
    const tags = await db.query(
      `
      SELECT event_tags.event_id, JSON_ARRAYAGG(tags.*) tag_array
      FROM event_tags
      JOIN tags ON event_tags.tag_id = tags.id
      GROUP BY event_tags.event_id;`
    );

    res.status(200).json(keysToCamel(tags));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

eventTagsRouter.get("/enrolled-event-tags/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const tags = await db.query(
      `
      SELECT event_tags.event_id, JSON_ARRAYAGG(tags.*) tag_array
      FROM event_tags
      JOIN tags ON event_tags.tag_id = tags.id
      JOIN event_enrollments ON event_tags.event_id = event_enrollments.event_id
      WHERE event_enrollments.student_id = $1
      GROUP BY event_tags.event_id;`,
      [userId]
    );
    res.status(200).json(keysToCamel(tags));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// tags for a single event
eventTagsRouter.get("/tags/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const tags = await db.query(
      `SELECT * FROM event_tags JOIN tags on event_tags.tag_id = tags.id WHERE event_tags.event_id = $1;`,
      [id]
    );
    res.status(200).json(keysToCamel(tags));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// get all events matching a tag
eventTagsRouter.get("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const events = await db.query(
      `SELECT * FROM event_tags JOIN events on event_tags.event_id = events.id WHERE event_tags.tag_id = $1;`,
      [id]
    );
    res.status(200).json(keysToCamel(events));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// post new tag/event relationship
eventTagsRouter.post("/", async (req, res) => {
  try {
    const { eventId, tagId } = req.body;

    const existingTag = await db.query(
      `SELECT * FROM event_tags WHERE event_id = $1 AND tag_id = $2;`,
      [eventId, tagId]
    );
    if (existingTag.length > 0) {
      return res.status(201).json(keysToCamel(existingTag));
    }

    if (!eventId || !tagId) {
      return res.status(400).send("Event ID and Tag ID are required.");
    }

    const tags = await db.query(
      `INSERT INTO event_tags (event_id, tag_id) VALUES ($1, $2) RETURNING *;`,
      [eventId, tagId]
    );
    res.status(201).json(keysToCamel(tags));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// delete event/tag relationship
eventTagsRouter.delete("/:eventId/:tagId", async (req, res) => {
  try {
    const { eventId, tagId } = req.params;
    const tags = await db.query(
      `DELETE FROM event_tags WHERE event_id = $1 AND tag_id = $2 RETURNING *;`,
      [eventId, tagId]
    );
    res.status(200).json(keysToCamel(tags));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export { eventTagsRouter };
