import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp"; // TODO: replace this db with

const classEnrollmentsRouter = express.Router();
classEnrollmentsRouter.use(express.json());

classEnrollmentsRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const classById = await db.query(
      "SELECT * FROM class_enrollments WHERE id = $1;",
      [id]
    );
    res.status(200).json(keysToCamel(classById));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classEnrollmentsRouter.get("/", async (req, res) => {
  try {
    const classById = await db.query(`SELECT * FROM class_enrollments;`);
    res.status(200).json(keysToCamel(classById));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classEnrollmentsRouter.get("/student/:student_id", async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT DISTINCT ON (c.id, sc.date)
          c.*,
          sc.date,
          sc.start_time,
          sc.end_time,
          ce.attendance,
          (SELECT COUNT(*) FROM class_enrollments WHERE class_id = c.id) AS attendee_count
      FROM classes c
      JOIN class_enrollments ce ON c.id = ce.class_id AND ce.student_id = $1
      LEFT JOIN scheduled_classes sc ON c.id = sc.class_id
      ORDER BY c.id, sc.date DESC;
    `,
      [req.params.student_id]
    );

    res.json(keysToCamel(result));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

classEnrollmentsRouter.get(
  "/teacher/:teacher_id/:class_id",
  async (req, res) => {
    try {
      const { teacher_id, class_id } = req.params; // Ensure correct param names
      const result = await db.query(
        `
      SELECT DISTINCT u.first_name, u.last_name, u.email, ce.attendance IS NOT NULL AS attendance
      FROM users u
        JOIN students s ON s.id = u.id
        JOIN class_enrollments ce ON ce.student_id = s.id
        JOIN classes c ON c.id = ce.class_id
        JOIN classes_taught ct ON ct.class_id = c.id
        JOIN scheduled_classes sc ON sc.date = ce.attendance
      WHERE ct.teacher_id = $1 AND c.id = $2;
    `,
        [teacher_id, class_id]
      );

      res.status(200).json(keysToCamel(result));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

classEnrollmentsRouter.post("/", async (req, res) => {
  const { studentId, classId, attendance } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO class_enrollments (student_id, class_id, attendance) VALUES ($1, $2, $3) RETURNING id",
      [studentId, classId, attendance]
    );

    res.status(201).json({
      id: result[0].id,
      studentId: studentId,
      classId: classId,
      attendance: attendance,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classEnrollmentsRouter.put("/:student_id", async (req, res) => {
  const student_id = req.params.student_id;
  const { class_id, attendance } = req.body;
  try {
    const data = await db.query(
      `UPDATE class_enrollments
       SET attendance = $1
       WHERE student_id = $2 AND class_id = $3
      `,
      [attendance, student_id, class_id]
    );
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});
classEnrollmentsRouter.delete("/:student_id/:class_id", async (req, res) => {
  const { student_id, class_id } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM class_enrollments WHERE student_id = $1 AND class_id = $2 RETURNING *",
      [student_id, class_id]
    );
    res.status(200).send(keysToCamel(result[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export { classEnrollmentsRouter };
