import express from "express";
import cors from "cors";
import db from "./database.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes

// Get all categories
app.get("/api/categories", (req, res) => {
  db.all("SELECT * FROM categories ORDER BY label", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get questions for a category
app.get("/api/questions", (req, res) => {
  const { category } = req.query;

  let query = `
    SELECT q.id, q.question_text, q.category_id,
           c.label as category_label, c.icon, c.color
    FROM questions q
    JOIN categories c ON q.category_id = c.id
  `;
  let params = [];

  if (category) {
    query += " WHERE q.category_id = ?";
    params.push(category);
  }

  query += " ORDER BY q.id";

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get answers for a question
app.get("/api/answers/:questionId", (req, res) => {
  const { questionId } = req.params;

  db.all(
    "SELECT * FROM answers WHERE question_id = ? ORDER BY id",
    [questionId],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    },
  );
});

// Add new category
app.post("/api/categories", (req, res) => {
  const { id, label, icon, color } = req.body;

  if (!id || !label) {
    return res
      .status(400)
      .json({ error: "Category ID and label are required" });
  }

  db.run(
    "INSERT INTO categories (id, label, icon, color) VALUES (?, ?, ?, ?)",
    [id, label, icon || "", color || "#666666"],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: id, message: "Category added successfully" });
    },
  );
});

// Add new question
app.post("/api/questions", (req, res) => {
  const { category_id, question_text } = req.body;

  if (!category_id || !question_text) {
    return res
      .status(400)
      .json({ error: "Category ID and question text are required" });
  }

  db.run(
    "INSERT INTO questions (category_id, question_text) VALUES (?, ?)",
    [category_id, question_text],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: "Question added successfully" });
    },
  );
});

// Add new answer
app.post("/api/answers", (req, res) => {
  const { question_id, answer_text } = req.body;

  if (!question_id || !answer_text) {
    return res
      .status(400)
      .json({ error: "Question ID and answer text are required" });
  }

  db.run(
    "INSERT INTO answers (question_id, answer_text) VALUES (?, ?)",
    [question_id, answer_text],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: "Answer added successfully" });
    },
  );
});

// Update category
app.put("/api/categories/:id", (req, res) => {
  const { id } = req.params;
  const { label, icon, color } = req.body;

  db.run(
    "UPDATE categories SET label = ?, icon = ?, color = ? WHERE id = ?",
    [label, icon, color, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: "Category not found" });
        return;
      }
      res.json({ message: "Category updated successfully" });
    },
  );
});

// Update question
app.put("/api/questions/:id", (req, res) => {
  const { id } = req.params;
  const { question_text } = req.body;

  db.run(
    "UPDATE questions SET question_text = ? WHERE id = ?",
    [question_text, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: "Question not found" });
        return;
      }
      res.json({ message: "Question updated successfully" });
    },
  );
});

// Update answer
app.put("/api/answers/:id", (req, res) => {
  const { id } = req.params;
  const { answer_text } = req.body;

  db.run(
    "UPDATE answers SET answer_text = ? WHERE id = ?",
    [answer_text, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: "Answer not found" });
        return;
      }
      res.json({ message: "Answer updated successfully" });
    },
  );
});

// Delete category
app.delete("/api/categories/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM categories WHERE id = ?", [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.json({ message: "Category deleted successfully" });
  });
});

// Delete question
app.delete("/api/questions/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM questions WHERE id = ?", [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: "Question not found" });
      return;
    }
    res.json({ message: "Question deleted successfully" });
  });
});

// Delete answer
app.delete("/api/answers/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM answers WHERE id = ?", [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: "Answer not found" });
      return;
    }
    res.json({ message: "Answer deleted successfully" });
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

app.listen(3000, () => {
  console.log("Backend running on port 3000");
});
