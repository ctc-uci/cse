import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const classesRouter = express.Router();
classesRouter.use(express.json());

classesRouter.get("/scheduled", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        c.*,
        sc.date,
        sc.start_time,
        sc.end_time,
        (SELECT COUNT(*) FROM class_enrollments WHERE class_id = c.id) as attendee_count
      FROM classes c
      LEFT JOIN scheduled_classes sc ON c.id = sc.class_id
      GROUP BY c.id, sc.date, sc.start_time, sc.end_time
    `);

    res.json(keysToCamel(result));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

classesRouter.get("/scheduled/:id/:date", async (req, res) => {
  try {
    const { id, date } = req.params;
    const data = await db.query(
      `SELECT
        c.*,
        sc.date,
        sc.start_time,
        sc.end_time
      FROM classes c
      JOIN scheduled_classes sc ON c.id = sc.class_id
      WHERE c.id = $1 AND sc.date = $2;`,
      [id, date]
    );
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classesRouter.get("/students/teacher/:id", async (req, res) => {
  try {
    const teacherId = req.params.id;

    const classStudents = await db.query(
      `
            SELECT
                c.id AS class_id,
                s.id as student_id,
                c.level as class_level,
                s.level as student_level,
                c.*, s.*, u.*
            FROM teachers t
            LEFT JOIN classes_taught ct ON t.id = ct.teacher_id
            LEFT JOIN classes c ON c.id = ct.class_id
            LEFT JOIN class_enrollments ce ON ce.class_id = c.id
            LEFT JOIN students s ON s.id = ce.student_id
            INNER JOIN users u ON u.id = s.id
            WHERE t.id = $1
            `,
      [teacherId]
    );

    res.status(200).json(keysToCamel(classStudents));
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "Failed",
      msg: err.message,
    });
  }
});

// UNUSED
classesRouter.get("/students/", async (req, res) => {
  try {
    const classStudents = await db.query(
      `
            SELECT * FROM classes c
            LEFT JOIN class_enrollments ce ON c.id = ce.class_id
            LEFT JOIN students s ON s.id = ce.student_id
            INNER JOIN users u ON u.id = s.id
            `
    );

    res.status(200).json(keysToCamel(classStudents));
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "Failed",
      msg: err.message,
    });
  }
});

// UNUSED
classesRouter.get("/students/:id", async (req, res) => {
  try {
    const classId = req.params.id;

    const classStudents = await db.query(
      `
            SELECT * FROM classes c
            LEFT JOIN class_enrollments ce ON c.id = ce.class_id
            LEFT JOIN students s ON s.id = ce.student_id
            INNER JOIN users u ON u.id = s.id
            WHERE c.id = $1
            `,
      [classId]
    );

    res.status(200).json(keysToCamel(classStudents));
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "Failed",
      msg: err.message,
    });
  }
});

classesRouter.get("/corequisites/:classid/:userid", async (req, res) => {
  try {
    const { classid, userid } = req.params;
    const corequisites = await db.query(
      `SELECT DISTINCT ON (e.id) e.*, 
              CASE WHEN ce.student_id IS NOT NULL THEN true ELSE false END AS enrolled
        FROM events e
        JOIN corequisites co ON e.id = co.event_id
        FULL OUTER JOIN event_enrollments ce ON ce.event_id = e.id AND ce.student_id = $1
        WHERE co.class_id = $2;`,
      [userid, classid]
    );

    res.status(200).json(keysToCamel(corequisites));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classesRouter.get("/corequisites/:classid", async (req, res) => {
  try {
    const { classid } = req.params;
    const corequisites = await db.query(
      `SELECT e.*
        FROM events e
        JOIN corequisites co ON e.id = co.event_id
        WHERE co.class_id = $1;`,
      [classid]
    );

    res.status(200).json(keysToCamel(corequisites));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classesRouter.delete("/corequisites/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM corequisites WHERE class_id = $1`, [id]);

    res.status(200).json(keysToCamel({ success: true }));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classesRouter.delete("/corequisites/event/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM corequisites WHERE event_id = $1`, [id]);

    res.status(200).json(keysToCamel({ success: true }));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classesRouter.get("/joined/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.query(
      `SELECT * FROM classes
            JOIN scheduled_classes ON classes.id = scheduled_classes.class_id
            WHERE classes.id = $1;`,
      [id]
    );
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classesRouter.get("/published", async (req, res) => {
  try {
    const data = await db.query(
      `
      SELECT DISTINCT ON (c.id, sc.date)
          c.*,
          sc.date,
          sc.start_time,
          sc.end_time
      FROM classes c
      LEFT JOIN scheduled_classes sc ON c.id = sc.class_id
      WHERE c.is_draft = FALSE
      ORDER BY c.id, sc.date DESC;
      `,
      []
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classesRouter.get("/drafts", async (req, res) => {
  try {
    const data = await db.query(
      `SELECT * FROM classes WHERE is_draft = TRUE;`,
      []
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// classesRouter.get("/search/:name", async (req, res) => {
// try {
// const { name } = req.params;
// const data = await db.query(`SELECT * FROM classes WHERE title LIKE $1;`, [
// `%${name}%`,
// ]);
//
// res.status(200).json(keysToCamel(data));
// } catch (err) {
// res.status(500).send(err.message);
// }
// });

classesRouter.get("/search/published/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const search = `%${name}%`;
    const allClasses = await db.query(
      `SELECT
        c.*,
        sc.date,
        sc.start_time,
        sc.end_time,
        (SELECT COUNT(*) FROM class_enrollments WHERE class_id = c.id AND attendance IS NULL) as attendee_count
      FROM classes c
      LEFT JOIN scheduled_classes sc ON c.id = sc.class_id
      WHERE c.is_draft = false AND c.title ILIKE $1
      GROUP BY c.id, sc.date, sc.start_time, sc.end_time;`,
      [search]
    );
    res.status(200).json(keysToCamel(allClasses));
  } catch (err) {
    res.status(500).send(err.message);
  }
});
classesRouter.get("/search/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const search = `%${name}%`;
    const allClasses = await db.query(
      "SELECT * FROM classes WHERE title ILIKE $1;",
      [search]
    );
    res.status(200).json(keysToCamel(allClasses));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classesRouter.get("/series/:seriesId", async (req, res) => {
  try {
    const { seriesId } = req.params;
    const data = await db.query(
      `SELECT c.*, sc.date, sc.start_time, sc.end_time
       FROM classes c
       LEFT JOIN scheduled_classes sc ON c.id = sc.class_id
       WHERE c.series_id = $1
       ORDER BY sc.date ASC;`,
      [seriesId]
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classesRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.query(`SELECT * FROM classes WHERE id = $1;`, [id]);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classesRouter.get("/", async (req, res) => {
  try {
    const data = await db.query(`SELECT * FROM classes;`);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classesRouter.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      capacity,
      level,
      date,
      costume = "No costume required",
      isDraft = false,
      is_recurring = false,
      recurrence_pattern = "none",
      start_date,
      end_date,
    } = req.body;

    const data = await db.query(
      `
      INSERT INTO classes (title, description, location, capacity, level, costume, is_draft, is_recurring, recurrence_pattern, start_date, end_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *;`,
      [
        title,
        description,
        location,
        capacity,
        level,
        costume,
        isDraft,
        is_recurring,
        recurrence_pattern,
        start_date || date,
        end_date || date,
      ]
    );

    res.status(201).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});
classesRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(`DELETE FROM classes WHERE id = $1;`, [id]);
    res.status(200).json(keysToCamel({ success: true }));
  } catch (err) {
    res.status(500).send(err.message);
  }
});
classesRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      location,
      capacity,
      level,
      costume,
      isDraft,
      is_recurring,
      recurrence_pattern,
      seriesId,
      start_date,
      end_date,
    } = req.body;

    const query = `UPDATE CLASSES SET
    title = COALESCE($1, title),
    description = COALESCE($2, description),
    location = COALESCE($3, location),
    capacity = COALESCE($4, capacity),
    level = COALESCE($5, level),
    costume = COALESCE($6, costume),
    is_draft = COALESCE($7, is_draft),
    is_recurring = COALESCE($8, is_recurring),
    recurrence_pattern = COALESCE($9, recurrence_pattern),
    series_id = COALESCE($10, series_id),
    start_date = COALESCE($11, start_date),
    end_date = COALESCE($12, end_date)
    WHERE id = $13 RETURNING *;`;

    const data = await db.query(query, [
      title,
      description,
      location,
      capacity,
      level,
      costume,
      isDraft,
      is_recurring,
      recurrence_pattern,
      seriesId,
      start_date,
      end_date,
      id,
    ]);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export { classesRouter };
