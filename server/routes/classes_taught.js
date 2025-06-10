import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const classesTaughtRouter = express.Router();
classesTaughtRouter.use(express.json());

// Returns all the data from the classes-taught table
classesTaughtRouter.get("/", async (req, res) => {
  try {
    // Query database
    const query = `SELECT * FROM classes_taught;`;

    const allClassesTaught = await db.query(query);
    res.status(200).json(keysToCamel(allClassesTaught));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Creates a new classes-taught entry in the classes taught table
classesTaughtRouter.post("/", async (req, res) => {
  try {
    // Destructure req.body
    const { teacherId, classId } = req.body;

    // Construct query with parameters
    const query = `INSERT INTO classes_taught (teacher_id, class_id) VALUES ($1, $2) RETURNING *;`;
    const params = [teacherId, classId];

    const ret = await db.query(query, params);

    res.status(201).json(keysToCamel(ret));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET instructor name by class ID
classesTaughtRouter.get("/instructor/:classId", async (req, res) => {
  try {
    const classId = req.params.classId;

    const result = await db.any(
      `
      SELECT u.first_name, u.last_name, u.id
      FROM classes_taught ct
      JOIN teachers t ON ct.teacher_id = t.id
      JOIN users u ON u.id = t.id
      WHERE ct.class_id = $1;
    `,
      [classId]
    );

    res.status(200).json(keysToCamel(result));
  } catch (err) {
    console.error("Failed to fetch instructor:", err);
    res.status(500).send(err.message);
  }
});

// updating class tought
classesTaughtRouter.put("/", async (req, res) => {
  const { classId, teacherId } = req.body;

  try {
    // Remove existing mapping(s) for this class
    await db.none(`DELETE FROM classes_taught WHERE class_id = $1`, [classId]);

    // Insert new mapping
    await db.none(
      `INSERT INTO classes_taught (class_id, teacher_id) VALUES ($1, $2)`,
      [classId, teacherId]
    );

    res.status(200).json({ message: "Instructor updated successfully." });
  } catch (error) {
    console.error("Error updating instructor:", error);
    res.status(500).json({ error: error.message });
  }
});

// deletes the class taught entry
classesTaughtRouter.delete("/:classId", async (req, res) => {
  const classId = req.params.classId;

  try {
    // Delete the class taught entry
    const deletedClassTaught = await db.query(
      `DELETE FROM classes_taught WHERE class_id = $1 RETURNING *`,
      [classId]
    );

    res.status(200).json(keysToCamel(deletedClassTaught));
  } catch (error) {
    console.error("Error deleting class taught entry:", error);
    res.status(500).json({ error: error.message });
  }
});

export { classesTaughtRouter };
