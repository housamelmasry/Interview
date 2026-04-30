import { useState, useEffect } from "react";

interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
}

interface Question {
  id: number;
  question_text: string;
  category_id: string;
  category_label: string;
  icon: string;
  color: string;
}

interface Answer {
  id: number;
  question_id: number;
  answer_text: string;
}

interface QuestionWithAnswers extends Question {
  answers: Answer[];
}

export default function InterviewGuide() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [questions, setQuestions] = useState<QuestionWithAnswers[]>([]);
  const [activeCategory, setActiveCategory] = useState("laravel-core");
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories and questions on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch categories
        const categoriesResponse = await fetch(
          "http://localhost:3000/api/categories",
        );
        if (!categoriesResponse.ok)
          throw new Error("Failed to fetch categories");
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Fetch questions
        const questionsResponse = await fetch(
          "http://localhost:3000/api/questions",
        );
        if (!questionsResponse.ok) throw new Error("Failed to fetch questions");
        const questionsData = await questionsResponse.json();

        // Fetch answers for each question
        const questionsWithAnswers = await Promise.all(
          questionsData.map(async (question: Question) => {
            try {
              const answersResponse = await fetch(
                `http://localhost:3000/api/answers/${question.id}`,
              );
              const answers = answersResponse.ok
                ? await answersResponse.json()
                : [];
              return { ...question, answers };
            } catch (err) {
              console.error(
                `Failed to fetch answers for question ${question.id}:`,
                err,
              );
              return { ...question, answers: [] };
            }
          }),
        );

        setQuestions(questionsWithAnswers);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered = search.trim()
    ? questions
        .filter(
          (q) =>
            q.question_text.includes(search) ||
            q.answers.some((a) => a.answer_text.includes(search)),
        )
        .map((q) => ({
          ...q,
          catColor: q.color,
          catLabel: q.category_label,
        }))
    : questions
        .filter((q) => q.category_id === activeCategory)
        .map((q) => ({
          ...q,
          catColor: q.color,
          catLabel: q.category_label,
        }));

  const totalQ = questions.length;

  if (loading) {
    return (
      <div
        style={{
          fontFamily: "'Tajawal', 'Cairo', sans-serif",
          direction: "rtl",
          background: "#0d0d0d",
          minHeight: "100vh",
          color: "#e8e8e8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            جاري التحميل...
          </div>
          <div style={{ color: "#666" }}>جاري تحميل البيانات من الخادم</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          fontFamily: "'Tajawal', 'Cairo', sans-serif",
          direction: "rtl",
          background: "#0d0d0d",
          minHeight: "100vh",
          color: "#e8e8e8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "1.5rem",
              marginBottom: "1rem",
              color: "#ff4444",
            }}
          >
            خطأ في التحميل
          </div>
          <div style={{ color: "#666", marginBottom: "1rem" }}>{error}</div>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "0.5rem 1rem",
              background: "#2979ff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Tajawal', 'Cairo', sans-serif",
        direction: "rtl",
        background: "#0d0d0d",
        minHeight: "100vh",
        color: "#e8e8e8",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #1a0533 0%, #0d1a2e 50%, #0d0d0d 100%)",
          padding: "2.5rem 2rem 2rem",
          borderBottom: "1px solid #222",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.3em",
            color: "#666",
            marginBottom: "0.75rem",
            textTransform: "uppercase",
          }}
        >
          دليل المقابلات الشامل
        </div>
        <h1
          style={{
            fontSize: "clamp(1.6rem, 4vw, 2.5rem)",
            fontWeight: 900,
            margin: 0,
            background:
              "linear-gradient(90deg, #FF4444, #FF8C00, #2979FF, #AA00FF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Laravel · Node.js · React · React Native · Backend
        </h1>
        <div style={{ color: "#555", marginTop: "0.5rem", fontSize: "0.9rem" }}>
          {totalQ} سؤال وإجابة موثّقة
        </div>

        {/* Search */}
        <div
          style={{
            marginTop: "1.5rem",
            maxWidth: "420px",
            margin: "1.5rem auto 0",
          }}
        >
          <input
            placeholder="🔍  ابحث في الأسئلة..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpenQuestion(null);
            }}
            style={{
              width: "100%",
              padding: "0.75rem 1.25rem",
              borderRadius: "50px",
              border: "1px solid #333",
              background: "#1a1a1a",
              color: "#e8e8e8",
              fontSize: "0.95rem",
              outline: "none",
              boxSizing: "border-box",
              textAlign: "right",
            }}
          />
        </div>
      </div>

      {/* Category Tabs */}
      {!search && (
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            padding: "1.25rem 1.5rem",
            overflowX: "auto",
            borderBottom: "1px solid #1a1a1a",
            background: "#0f0f0f",
          }}
        >
          {categories.map((cat) => {
            const active = activeCategory === cat.id;
            const questionCount = questions.filter(
              (q) => q.category_id === cat.id,
            ).length;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setOpenQuestion(null);
                }}
                style={{
                  padding: "0.55rem 1.1rem",
                  borderRadius: "50px",
                  border: active
                    ? `1.5px solid ${cat.color}`
                    : "1.5px solid #2a2a2a",
                  background: active ? `${cat.color}18` : "transparent",
                  color: active ? cat.color : "#666",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: active ? 700 : 400,
                  whiteSpace: "nowrap",
                  fontFamily: "inherit",
                  transition: "all 0.2s",
                }}
              >
                {cat.icon} {cat.label}
                <span
                  style={{
                    marginRight: "0.4rem",
                    fontSize: "0.75rem",
                    opacity: 0.7,
                  }}
                >
                  ({questionCount})
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Questions List */}
      <div style={{ padding: "1.5rem", maxWidth: "860px", margin: "0 auto" }}>
        {search && (
          <div
            style={{ color: "#555", fontSize: "0.85rem", marginBottom: "1rem" }}
          >
            نتائج البحث: {filtered.length} سؤال
          </div>
        )}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", color: "#444", padding: "3rem" }}>
            لا توجد نتائج
          </div>
        )}

        {filtered.map((item, i) => {
          const isOpen = openQuestion === i;
          return (
            <div
              key={i}
              style={{
                marginBottom: "0.75rem",
                border: `1px solid ${isOpen ? item.catColor + "44" : "#1e1e1e"}`,
                borderRadius: "12px",
                overflow: "hidden",
                background: isOpen ? "#141414" : "#111",
                transition: "all 0.25s",
              }}
            >
              <button
                onClick={() => setOpenQuestion(isOpen ? null : i)}
                style={{
                  width: "100%",
                  padding: "1.1rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "right",
                  color: "#e8e8e8",
                  fontFamily: "inherit",
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    color: item.catColor,
                    fontSize: "1.1rem",
                    flexShrink: 0,
                  }}
                >
                  {isOpen ? "▾" : "▸"}
                </span>
                <span style={{ flex: 1, lineHeight: 1.5 }}>
                  {item.question_text}
                </span>
                {search && (
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: item.catColor,
                      border: `1px solid ${item.catColor}44`,
                      padding: "2px 8px",
                      borderRadius: "20px",
                      flexShrink: 0,
                    }}
                  >
                    {item.catLabel}
                  </span>
                )}
              </button>

              {isOpen && (
                <div style={{ padding: "0 1.25rem 1.25rem 1.25rem" }}>
                  <div
                    style={{
                      height: "1px",
                      background: `${item.catColor}22`,
                      marginBottom: "1rem",
                    }}
                  />
                  {item.answers.map((answer, answerIndex) => (
                    <div
                      key={answer.id}
                      style={{
                        marginBottom:
                          answerIndex < item.answers.length - 1 ? "1rem" : 0,
                      }}
                    >
                      <pre
                        style={{
                          margin: 0,
                          whiteSpace: "pre-wrap",
                          fontFamily: "inherit",
                          fontSize: "0.92rem",
                          lineHeight: 1.8,
                          color: "#c8c8c8",
                        }}
                      >
                        {answer.answer_text}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          color: "#333",
          fontSize: "0.8rem",
          borderTop: "1px solid #1a1a1a",
        }}
      >
        {totalQ} سؤال • Laravel · Node.js · React · React Native · Backend ·
        System Design · Testing
      </div>
    </div>
  );
}
