import db from "./database.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, "data.json");
const categories = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const runQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

async function seed() {
  console.log("Starting seeding process...");

  try {
    // Clear existing data
    await runQuery("DELETE FROM answers");
    await runQuery("DELETE FROM questions");
    await runQuery("DELETE FROM categories");
    console.log("Cleared existing data.");

    for (const cat of categories) {
      await runQuery(
        "INSERT INTO categories (id, label, icon, color) VALUES (?, ?, ?, ?)",
        [cat.id, cat.label, cat.icon, cat.color]
      );
      console.log(`Inserted category: ${cat.label}`);

      for (const q of cat.questions) {
        const questionResult = await runQuery(
          "INSERT INTO questions (category_id, question_text) VALUES (?, ?)",
          [cat.id, q.q]
        );
        const questionId = questionResult.lastID;

        await runQuery(
          "INSERT INTO answers (question_id, answer_text) VALUES (?, ?)",
          [questionId, q.a]
        );
      }
    }

    console.log("\nDatabase seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error during seeding:", err);
    process.exit(1);
  }
}

// Give the database a moment to connect
setTimeout(seed, 500);
