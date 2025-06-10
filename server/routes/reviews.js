import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const reviewsRouter = express.Router();
reviewsRouter.use(express.json());

reviewsRouter.get("/", async (req, res) => {
  try {
    const data = await db.query(`SELECT * FROM reviews`);
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

reviewsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.query(`SELECT * FROM reviews WHERE id = $1;`, [id]);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

reviewsRouter.get("/class/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.query(`SELECT * FROM reviews WHERE class_id = $1;`, [
      id,
    ]);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

reviewsRouter.get("/student/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.query(
      `SELECT * FROM reviews WHERE student_id = $1;`,
      [id]
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

reviewsRouter.post("/", async (req, res) => {
  try {
    const { class_id, student_id, rating, review } = req.body;

    const data = await db.query(
      `
      INSERT INTO reviews(class_id, student_id, rating, review)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [class_id, student_id, rating, review]
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

reviewsRouter.put("/", async (req, res) => {
  try {
    const { class_id, student_id, rating, review } = req.body;
    if (!class_id || !student_id)
      res
        .status(500)
        .send(
          "Invalid PUT request, please enter required `student_id` and `class_id` parameters"
        );

    const query = `UPDATE reviews SET
    rating = COALESCE($1, rating),
    review = COALESCE($2, review)
    WHERE class_id = $3 AND student_id = $4 RETURNING *;`;

    const data = await db.query(query, [rating, review, class_id, student_id]);
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

reviewsRouter.delete("/", async (req, res) => {
  try {
    const { student_id, class_id } = req.body;
    const data = await db.query(
      `
      DELETE FROM reviews
      WHERE student_id=$1 OR class_id=$2
      RETURNING *;
      `,
      [student_id, class_id]
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export { reviewsRouter };
