import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const classesRouter = express.Router();
classesRouter.use(express.json());

classesRouter.get("/students/teacher/:id", async(req, res) => {
    try {
        const teacherId = req.params.id

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
        )

        res.status(200).json(keysToCamel(classStudents));
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "Failed",
            msg: err.message,
        });
    }
})

// UNUSED
classesRouter.get("/students/", async(req, res) => {
    try {
        const classStudents = await db.query(
            `
            SELECT * FROM classes c
            LEFT JOIN class_enrollments ce ON c.id = ce.class_id
            LEFT JOIN students s ON s.id = ce.student_id 
            INNER JOIN users u ON u.id = s.id
            `
        )

        res.status(200).json(keysToCamel(classStudents));
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "Failed",
            msg: err.message,
        });
    }
})

// UNUSED
classesRouter.get("/students/:id", async(req, res) => {
    try {
        const classId = req.params.id

        const classStudents = await db.query(
            `
            SELECT * FROM classes c
            LEFT JOIN class_enrollments ce ON c.id = ce.class_id
            LEFT JOIN students s ON s.id = ce.student_id 
            INNER JOIN users u ON u.id = s.id
            WHERE c.id = $1
            `,
            [classId]
        )

        res.status(200).json(keysToCamel(classStudents));
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "Failed",
            msg: err.message,
        });
    }
})

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
    console.log(req.body);
    const { title, description, location, capacity, level, costume, isDraft } =
      req.body;
    const data = await db.query(
      `
        INSERT INTO classes (title, description, location, capacity, level, costume, is_draft)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
      [title, description, location, capacity, level, costume, isDraft]
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classesRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, capacity, level, costume, isDraft } =
      req.body;

    const query = `UPDATE CLASSES SET
    title = COALESCE($1, title),
    description = COALESCE($2, description),
    location = COALESCE($3, location),
    capacity = COALESCE($4, capacity),
    level = COALESCE($5, level),
    costume = COALESCE($6, costume),
    is_draft = COALESCE($7, isDraft)
    WHERE id = $8 RETURNING *;`;

    const data = await db.query(query, [
      title,
      description,
      location,
      capacity,
      level,
      costume,
      isDraft,
      id,
    ]);

    res.status(200).json(keysToCamel(data));
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
      `SELECT * FROM classes WHERE is_draft = FALSE;`,
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

classesRouter.get("/search/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const data = await db.query(`SELECT * FROM classes WHERE title LIKE $1;`, [
      `%${name}%`,
    ]);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classesRouter.get('/search/:name', async (req,res) => {
    try {
        const { name } = req.params
        const search = `%${name}%`
        const allClasses = await db.query("SELECT * FROM classes WHERE title ILIKE $1;", [search]);
      res.status(200).json(keysToCamel(allClasses))
    } catch (err){
      res.status(500).send(err.message)
    }
})

export { classesRouter };
