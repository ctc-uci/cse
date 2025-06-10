import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const classTagsRouter = express.Router();

classTagsRouter.use(express.json());

// tags for all classes
classTagsRouter.get("/all-class-tags", async (req, res) => {
  try {
    const tags = await db.query(
      `
      SELECT class_tags.class_id, JSON_ARRAYAGG(tags.*) tag_array
      FROM class_tags 
      JOIN tags ON class_tags.tag_id = tags.id
      GROUP BY class_tags.class_id;`
    );

    res.status(200).json(keysToCamel(tags));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// tags for all enrolled classes
classTagsRouter.get("/enrolled-class-tags/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const tags = await db.query(
      `
      SELECT class_tags.class_id, JSON_ARRAYAGG(tags.*) tag_array
      FROM class_tags 
      JOIN tags ON class_tags.tag_id = tags.id
      JOIN class_enrollments ON class_tags.class_id = class_enrollments.class_id
      WHERE class_enrollments.student_id = $1 AND class_enrollments.attendance IS NULL
      GROUP BY class_tags.class_id;`,
      [userId]
    );
    res.status(200).json(keysToCamel(tags));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// tags for a single class
classTagsRouter.get("/tags/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const tags = await db.query(
      `SELECT * FROM class_tags JOIN tags on class_tags.tag_id = tags.id WHERE class_tags.class_id = $1;`,
      [id]
    );
    res.status(200).json(keysToCamel(tags));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// get all classes matching a tag
classTagsRouter.get("/classes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const classes = await db.query(
      `SELECT * FROM class_tags JOIN classes on class_tags.class_id = classes.id WHERE class_tags.tag_id = $1;`,
      [id]
    );
    res.status(200).json(keysToCamel(classes));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// post new tag/class relationship
classTagsRouter.post("/", async (req, res) => {
  try {
    const { classId, tagId } = req.body;

    const existingTag = await db.query(
      `SELECT * FROM class_tags WHERE class_id = $1 AND tag_id = $2;`,
      [classId, tagId]
    );
    if (existingTag.length > 0) {
      return res.status(201).json(keysToCamel(existingTag));
    }
    if (!classId || !tagId) {
      return res
        .status(400)
        .json({ error: "Class ID and Tag ID are required." });
    }

    const tags = await db.query(
      `INSERT INTO class_tags (class_id, tag_id) VALUES ($1, $2) RETURNING *;`,
      [classId, tagId]
    );
    res.status(201).json(keysToCamel(tags));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// delete class/tag relationship
classTagsRouter.delete("/:classId/:tagId", async (req, res) => {
  try {
    const { classId, tagId } = req.params;
    const tags = await db.query(
      `DELETE FROM class_tags WHERE class_id = $1 AND tag_id = $2 RETURNING *;`,
      [classId, tagId]
    );
    res.status(200).json(keysToCamel(tags));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export { classTagsRouter };
