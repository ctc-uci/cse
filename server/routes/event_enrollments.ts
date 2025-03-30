import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const eventEnrollmentRouter = express.Router();
eventEnrollmentRouter.use(express.json());

interface EventEnrollment {
  id: number;
  student_id: number;
  event_id: number;
  attendance: boolean;
}

interface EventEnrollmentRequest {
  student_id?: number;
  event_id?: number;
  attendance?: boolean;
}

// GET /
eventEnrollmentRouter.get("/", async (req, res) => {
  try {
    const events = await db.query("SELECT * FROM event_enrollments");
    res.status(200).json(keysToCamel(events) as EventEnrollment[]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /:id
eventEnrollmentRouter.get("/:id", async (req, res) => {
  try {
    const events = await db.query(
      "SELECT * FROM event_enrollments WHERE id = $1",
      [req.params.id]
    );
    // If no rows are returned, send a 404 response
    if (events.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    // Convert the snake_case keys to camelCase and send the response
    res.status(200).json(keysToCamel(events[0] as EventEnrollment));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

eventEnrollmentRouter.get("/event/:event_id", async (req, res) => {
  try {
    const { event_id } = req.params; // Extract event ID from request params

    const result = await db.query(
      `
      SELECT DISTINCT u.first_name, u.last_name, u.email, ee.attendance AS attended
      FROM users u
        JOIN students s ON s.id = u.id
        JOIN event_enrollments ee ON ee.student_id = s.id
        JOIN events e ON e.id = ee.event_id
      WHERE e.id = $1;
      `, [event_id]
    );

    res.status(200).json(keysToCamel(result as EventEnrollment)); // Ensure .rows is used
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


eventEnrollmentRouter.get("/student/:student_id", async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT
        e.*,
        ee.attendance,
        (SELECT COUNT(*) FROM event_enrollments WHERE event_id = e.id) as attendee_count
      FROM events e
      JOIN event_enrollments ee ON e.id = ee.event_id AND ee.student_id = $1
      GROUP BY e.id, ee.attendance
    `,
      [req.params.student_id]
    );

    res.json(keysToCamel(result));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /event-enrollments
eventEnrollmentRouter.post("/", async (req, res) => {
  try {
    // Destructure the request body
    const { student_id, event_id, attendance } = req.body as EventEnrollmentRequest;
    // mathing sql schema
    if (!student_id || !event_id) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Insert the new article into the database
    // Returning * will return the newly inserted row in the response

    // By default the attendance will be false as mentioned in the table
    const rows = await db.query(
      "INSERT INTO event_enrollments (student_id, event_id, attendance) VALUES ($1, $2, $3) RETURNING *",
      [student_id, event_id, attendance]
    );
    // Convert the snake_case keys to camelCase and send the response with status 201 (Created)
    res.status(201).json(keysToCamel(rows[0] as EventEnrollment));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /:student_id
eventEnrollmentRouter.put("/:student_id", async (req, res) => {
  try {
    const student_id = req.params.student_id;
    const { event_id, attendance } = req.body as EventEnrollmentRequest;

    if (!event_id || attendance === undefined) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const data = await db.query(
      `UPDATE event_enrollments
       SET attendance = $1
       WHERE student_id = $2 AND event_id = $3
       RETURNING *`,
      [attendance, student_id, event_id]
    );

    if (data.length === 0) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    res.status(200).json(keysToCamel(data[0] as EventEnrollment));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

eventEnrollmentRouter.delete("/:student_id/:event_id", async (req, res) => {
  const { student_id, event_id } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM event_enrollments WHERE student_id = $1 AND event_id = $2 RETURNING *",
      [student_id, event_id]
    );
    res.status(200).send(keysToCamel(result[0] as EventEnrollment));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export { eventEnrollmentRouter };
