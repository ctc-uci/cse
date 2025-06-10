import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const classVideosRouter = express.Router();
classVideosRouter.use(express.json());

classVideosRouter.get("/", async (req, res) => {
  try {
    const data = await db.query(`SELECT * FROM class_videos;`);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classVideosRouter.get("/with-tags", async (req, res) => {
  try {
    const data = await db.query(`
      SELECT c.id, c.title, c.s3_url, c.description, c.media_url, c.class_id, cs.title AS class_title, u.first_name, u.last_name, COALESCE(ARRAY_AGG(t.id) FILTER (WHERE t.id IS NOT NULL), '{}') AS tags 
      FROM class_videos c
        LEFT JOIN users u ON c.teacher_id = u.id
        LEFT JOIN video_tags v ON v.video_id = c.id
        LEFT JOIN tags t ON t.id = v.tag_id
        LEFT JOIN classes cs ON cs.id = c.class_id
      GROUP BY c.id, c.title, c.s3_url, c.description, c.media_url, c.class_id, cs.title, u.first_name, u.last_name
      ORDER BY c.id;
    `);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classVideosRouter.get("/with-tags/search/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const data = await db.query(
      `
        SELECT c.id, c.title, c.s3_url, c.description, c.media_url, c.class_id, u.first_name, u.last_name, COALESCE(ARRAY_AGG(t.id) FILTER (WHERE t.id IS NOT NULL), '{}') AS tags 
        FROM class_videos c
          LEFT JOIN users u ON c.teacher_id = u.id
          LEFT JOIN video_tags v ON v.video_id = c.id
          LEFT JOIN tags t ON t.id = v.tag_id
        WHERE title ILIKE $1
        GROUP BY c.id, c.title, c.s3_url, c.description, c.media_url, c.class_id, u.first_name, u.last_name
        ORDER BY c.id;
      `,
      [`%${name}%`]
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classVideosRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await db.query(`SELECT * FROM class_videos WHERE id = $1`, [
      id,
    ]);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classVideosRouter.post("/", async (req, res) => {
  try {
    const { title, s3Url, description, mediaUrl, classId, teacherId } = req.body;

    const postData = await db.query(
      `INSERT INTO class_videos (title, s3_url, description, media_url, class_id, teacher_id)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, title, s3_url, description, media_url, class_id, teacher_id;`,
      [title, s3Url, description, mediaUrl, classId, teacherId]
    );

    res.status(200).json(keysToCamel(postData)); //is this supposed to be .send instead?
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classVideosRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, s3Url, description, mediaUrl, classId } = req.body;

    const query = `UPDATE class_videos SET
    title = COALESCE($1, title),
    s3_url = COALESCE($2, s3_url),
    description = COALESCE($3, description),
    media_url = COALESCE($4, media_url),
    class_id = COALESCE($5, class_id)
    WHERE id = $6 RETURNING *;`;

    const { count } = (
      await db.query(`SELECT COUNT(*) FROM class_videos WHERE id = $1`, [id])
    )[0];

    if (parseInt(count) === 1) {
      const updatedClassVideos = await db.query(query, [
        title,
        s3Url,
        description,
        mediaUrl,
        classId,
        id,
      ]);
      res.status(200).send(keysToCamel(updatedClassVideos));
    } else {
      res.status(400).send("Video with provided id not found");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classVideosRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedClassVideos = await db.query(
      `DELETE FROM class_videos WHERE id = $1 RETURNING *;`,
      [id]
    );
    res.status(200).send(keysToCamel(deletedClassVideos));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export { classVideosRouter };
