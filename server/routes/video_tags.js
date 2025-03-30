import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const videoTagsRouter = express.Router();

videoTagsRouter.use(express.json());

videoTagsRouter.get("/videos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const tags = await db.query(
            `SELECT * FROM video_tags
            JOIN tags ON video_tags.tag_id = tags.id
            WHERE video_tags.video_id = $1;` [id]);
        res.status(200).json(keysToCamel(tags));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

videoTagsRouter.get("/tags/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const tags = await db.query(
            `SELECT * FROM video_tags
            JOIN tags ON video_tags.tag_id = tags.id
            WHERE video_tags.tag_id = $1;` [id]);
        res.status(200).json(keysToCamel(tags));
    } catch (err) {
        res.status(500).send(err.message);
    }
});


videoTagsRouter.post("/", async (req, res) => {
    try {
        const { videoId, tagId } = req.body;
        const tags = await db.query(
            `INSERT INTO video_tags (video_id, tag_id) VALUES
            ($1, $2) RETURNING *;`, [videoId, tagId]
        );
        res.status(201).json(keysToCamel(tags));
    } catch (err) {
        res.status(500).send(err.message);
    }
});


videoTagsRouter.delete('/', async (req, res) => {
    try {
        const { videoId, tagId } = req.body;
        const tags = await db.query(
            `DELETE FROM video_tags WHERE video_id = $1 AND tag_id = $2 RETURNING *;`, [videoId, tagId]
        );
        res.status(200).json(keysToCamel(tags));
    } catch (err) {
        res.status(500).send(err.message);
    }
});


export { videoTagsRouter };
