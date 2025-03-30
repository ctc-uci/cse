import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const classTagsRouter = express.Router();

classTagsRouter.use(express.json());

// tags for a single class
classTagsRouter.get("/tags/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const tags = await db.query(`SELECT * FROM class_tags JOIN tags on class_tags.tag_id = tags.id WHERE class_tags.class_id = $1;`, [id])
        res.status(200).json(keysToCamel(tags));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// get all classes matching a tag
classTagsRouter.get("/classes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const classes = await db.query(`SELECT * FROM class_tags JOIN classes on class_tags.class_id = classes.id WHERE class_tags.tag_id = $1;`, [id]);
        res.status(200).json(keysToCamel(classes)); 
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// post new tag/class relationship
classTagsRouter.post("/", async (req, res) => {
    try {
        const { classId, tagId } = req.body;
        const tags = await db.query(`INSERT INTO class_tags (class_id, tag_id) VALUES ($1, $2) RETURNING *;`, [classId, tagId]);
        res.status(201).json(keysToCamel(tags));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// delete class/tag relationship
classTagsRouter.delete("/", async (req, res) => {
    try {
        const { classId, tagId } = req.body;
        const tags = await db.query(`DELETE FROM class_tags WHERE class_id = $1 AND tag_id = $2 RETURNING *;`, [classId, tagId]);
        res.status(200).json(keysToCamel(tags));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export { classTagsRouter };