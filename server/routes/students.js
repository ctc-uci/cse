import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const studentsRouter = express.Router();
studentsRouter.use(express.json());

studentsRouter.get("/firebase/:firebaseUid", async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const student = await db.query(
      `SELECT u.id
       FROM users u
       JOIN students s ON u.id = s.id
       WHERE u.firebase_uid = $1`,
      [firebaseUid]
    );

    if (student.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(keysToCamel(student[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

studentsRouter.get("/count", async (req, res) => {
  const { search } = req.query;
  try {
    const query = `
    SELECT COUNT(*)
    FROM users u
    JOIN students s ON u.id = s.id
    ${search ? "WHERE u.first_name ILIKE $1 OR u.last_name ILIKE $1 OR u.email ILIKE $1" : ""};
  `;

    const students = await db.query(query, search ? [`%${search}%`] : []);

    res.status(200).json(keysToCamel(students));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

studentsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const student = await db.query(
      `SELECT u.id, u.first_name, u.last_name, u.role, u.user_role, u.email, u.firebase_uid, s.level
       FROM users u
       JOIN students s ON u.id = s.id
       WHERE u.id = $1`,
      [id]
    );

    if (student.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(keysToCamel(student[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

studentsRouter.get("/", async (req, res) => {
  const { search, page, reverse } = req.query;
  const pageNum = page ? parseInt(page) : 0;
  const reverseSearch = reverse && reverse === "true";

  try {
    const query = `
      SELECT u.id, u.first_name, u.last_name, u.role, u.user_role, u.email, u.firebase_uid, s.level
      FROM users u
      JOIN students s ON u.id = s.id
      ${search ? "WHERE u.first_name ILIKE $1 OR u.last_name ILIKE $1 OR u.email ILIKE $1" : ""}
      ORDER BY LOWER(u.first_name) ${reverseSearch ? "DESC" : "ASC"}, LOWER(u.last_name) ${reverseSearch ? "DESC" : "ASC"}
      LIMIT 10 OFFSET $2;
    `;

    const students = await db.query(query, [`%${search}%`, 10 * pageNum]);

    res.status(200).json(keysToCamel(students));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

studentsRouter.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, level, firebaseUid } = req.body;

    const newUser = await db.query(
      `INSERT INTO users (first_name, last_name, user_role, email, firebase_uid)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, role, user_role, email, firebase_uid;`,
      [firstName, lastName, "student", email, firebaseUid]
    );

    const userId = newUser[0].id;
    // console.log("userId", userId);

    const newStudent = await db.query(
      `INSERT INTO students (id, level)
      OVERRIDING SYSTEM VALUE
      VALUES ($1, $2)
      RETURNING id, level;`,
      [userId, level]
    );

    res.status(201).json(keysToCamel({ ...newUser[0], ...newStudent[0] }));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

studentsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { level } = req.body;

    const updatedStudent = await db.query(
      `UPDATE students
       SET level = COALESCE($1, level)
       WHERE id = $2
       RETURNING id, level;`,
      [level, id]
    );

    if (updatedStudent.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(keysToCamel(updatedStudent[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

studentsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStudent = await db.query(
      `DELETE FROM students
       WHERE id = $1
       RETURNING id;`,
      [id]
    );

    if (deletedStudent.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    await db.query(
      `DELETE FROM users
       WHERE id = $1;`,
      [id]
    );

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

studentsRouter.get("/joined/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const students = await db.query(
      `SELECT u.first_name, u.last_name, u.email, c.title, c.description, c.level, e.attendance
       FROM users u
        JOIN students s ON u.id = s.id
        JOIN class_enrollments e ON s.id = e.student_id
        JOIN classes c ON e.class_id = c.id
       WHERE u.id = $1;`,
      [id]
    );
    // !! Might return nothing, if a student is not enrolled in any classes !!
    //  Possibly add a second query just grabbing their username so u can display
    //   something like "Joshua Sullivan is not enrolled in any classes" to make it more personalized rather than just "Student"
    //  Not sure how resource extensive (if at all) a second sql query is - Josh

    // Might also be cool to add what teacher is teaching the class too, not my decision though :D - Josh

    res.status(200).json(keysToCamel(students));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export { studentsRouter };
