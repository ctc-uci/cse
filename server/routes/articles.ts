import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const articlesRouter = express.Router();
articlesRouter.use(express.json());

interface Article {
  id: number;
  s3_url: string;
  description: string;
  media_url: string;
}

interface ArticleRequest {
  s3_url?: string;
  description?: string;
  media_url?: string;
}

// GET /articles/:id
articlesRouter.get("/:id", async (req, res) => {
  try {
    // Select rows where the id matches the id in the request parameters
    const rows = await db.query("SELECT * FROM articles WHERE id = $1", [
      req.params.id,
    ]);
    // If no rows are returned, send a 404 response
    if (rows.length === 0) {
      return res.status(404).json({ error: "Article not found" });
    }
    // Convert the snake_case keys to camelCase and send the response
    res.status(200).json(keysToCamel(rows[0] as Article));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /articles
articlesRouter.get("/", async (req, res) => {
  try {
    // Select all rows from the articles table
    const rows = await db.query("SELECT * FROM articles");
    // Convert the snake_case keys to camelCase and send the response
    res.status(200).json(keysToCamel(rows) as Article[]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /articles
articlesRouter.post("/", async (req, res) => {
  try {
    // Destructure the request body
    const { s3_url, description, media_url } = req.body as ArticleRequest;
    // Since its required in the schema send an error
    if (!s3_url || !description || !media_url) {
      return res.status(400).json({ error: "Missing required parameters" });
    }
    // Insert the new article into the database
    // Returning * will return the newly inserted row in the response
    const rows = await db.query(
      "INSERT INTO articles (s3_url, description, media_url) VALUES ($1, $2, $3) RETURNING *",
      [s3_url, description, media_url]
    );
    // Convert the snake_case keys to camelCase and send the response with status 201 (Created)
    res.status(201).json(keysToCamel(rows[0] as Article));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /articles/search/:title
articlesRouter.get("/search/:title", async (req, res) => {
  try {
    const { title } = req.params;

    if (!title) {
      return res.status(400).json({ error: "Missing article title."});
    }

    const rows = await db.query(
      "SELECT * FROM articles WHERE title LIKE $1",
      [`%${title}%`]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "No articles found."});
    }

    res.status(200).json(keysToCamel(keysToCamel(rows) as Article[]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

// PUT /articles/:id
articlesRouter.put("/:id", async (req, res) => {
  try {
    // Destructure the request body
    const { id } = req.params;
    const { s3_url, description, media_url } = req.body as ArticleRequest;

    const query = `UPDATE articles SET 
    s3_url = COALESCE($1, s3_url),
    description = COALESCE($2, description),
    media_url = COALESCE($3, media_url)
    WHERE id = $4
    RETURNING *;`;

    // Update the article with the matching id
    const rows = await db.query(query, [s3_url, description, media_url, id]);

    // If no rows are returned, send a 404 response
    if (rows.length === 0) {
      // Could not find the article with the given id
      return res.status(404).json({ error: "Article not found" });
    }
    // Convert the snake_case keys to camelCase and send the response
    res.status(200).json(keysToCamel(rows[0]) as Article);
  } catch (error) {
    // Send a 500 response with the error message
    res.status(500).json({ error: error.message });
  }
});

// DELETE /articles/:id
articlesRouter.delete("/:id", async (req, res) => {
  try {
    // Delete the article with the matching id
    const rows = await db.query(
      "DELETE FROM articles WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    // If no rows are returned, send a 404 response
    if (rows.length === 0) {
      // Could not find the article with the given id
      return res.status(404).json({ error: "Article not found" });
    }
    // Convert the snake_case keys to camelCase and send the response
    res.status(200).json(keysToCamel(rows[0] as Article));
  } catch (error) {
    // Send a 500 response with the error message
    res.status(500).json({ error: error.message });
  }
});

// Export the router made to handle these new routes
export { articlesRouter };
