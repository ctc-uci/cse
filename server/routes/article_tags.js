import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const articleTagsRouter = express.Router();

articleTagsRouter.use(express.json());

articleTagsRouter.get("/articles/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const tags = await db.query(
            `SELECT * FROM article_tags
            JOIN tags ON article_tags.tag_id = tags.id
            WHERE article_tags.article_id = $1;` [id]);
        res.status(200).json(keysToCamel(tags));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

articleTagsRouter.get("/tags/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const tags = await db.query(
            `SELECT * FROM article_tags
            JOIN tags ON article_tags.tag_id = tags.id
            WHERE article_tags.tag_id = $1;` [id]);
        res.status(200).json(keysToCamel(tags));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

articleTagsRouter.post("/", async (req, res) => {
  try {
    const { articleId, tagId } = req.body;
    const tags = await db.query(
      `INSERT INTO article_tags (article_id, tag_id) VALUES
            ($1, $2) RETURNING *;`,
      [articleId, tagId]
    );
    res.status(201).json(keysToCamel(tags));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

articleTagsRouter.delete("/", async (req, res) => {
  try {
    const { articleId, tagId } = req.body;
    const tags = await db.query(
      `DELETE FROM article_tags WHERE article_id = $1 AND tag_id = $2 RETURNING *;`,
      [articleId, tagId]
    );
    res.status(200).json(keysToCamel(tags));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export { articleTagsRouter };
