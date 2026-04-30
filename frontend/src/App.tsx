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

  // Manage Mode States
  const [isManageMode, setIsManageMode] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Partial<QuestionWithAnswers> | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  // Fetch categories and questions on mount
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

      // Fetch questions (now including answers from backend)
      const questionsResponse = await fetch(
        "http://localhost:3000/api/questions",
      );
      if (!questionsResponse.ok) throw new Error("Failed to fetch questions");
      const questionsData = await questionsResponse.json();

      setQuestions(questionsData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      const isNew = !categories.find(c => c.id === editingCategory.id);
      const url = isNew 
        ? "http://localhost:3000/api/categories" 
        : `http://localhost:3000/api/categories/${editingCategory.id}`;
      
      const response = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCategory),
      });

      if (response.ok) {
        setShowCategoryForm(false);
        setEditingCategory(null);
        fetchData();
      }
    } catch (err) {
      alert("Error saving category");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure? This will not delete questions but they will be uncategorized.")) return;
    try {
      await fetch(`http://localhost:3000/api/categories/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      alert("Error deleting category");
    }
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;

    try {
      const isNew = !editingQuestion.id;
      const url = isNew 
        ? "http://localhost:3000/api/questions" 
        : `http://localhost:3000/api/questions/${editingQuestion.id}`;
      
      const response = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingQuestion,
          category_id: editingQuestion.category_id || activeCategory,
        }),
      });

      if (response.ok) {
        setShowQuestionForm(false);
        setEditingQuestion(null);
        fetchData();
      }
    } catch (err) {
      alert("Error saving question");
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`http://localhost:3000/api/questions/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      alert("Error deleting question");
    }
  };

  const filtered = search.trim()
    ? questions
        .filter(
          (q) =>
            q.question_text.includes(search) ||
            (q.answers || []).some((a) => a.answer_text.includes(search)),
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

  if (loading && questions.length === 0) {
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
          position: "relative"
        }}
      >
        <button 
          onClick={() => setIsManageMode(!isManageMode)}
          style={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            padding: "0.4rem 0.8rem",
            background: isManageMode ? "#ff4444" : "#333",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "0.7rem",
            cursor: "pointer"
          }}
        >
          {isManageMode ? "إغلاق الإدارة" : "وضع الإدارة"}
        </button>

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
        {!isManageMode && (
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
        )}
      </div>

      {/* Admin Controls */}
      {isManageMode && (
        <div style={{ padding: "1rem", background: "#111", borderBottom: "1px solid #222", display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button 
            onClick={() => { setEditingCategory({ id: "", label: "", icon: "📁", color: "#666666" }); setShowCategoryForm(true); }}
            style={{ padding: "0.5rem 1rem", background: "#2ecc71", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            + تصنيف جديد
          </button>
          <button 
            onClick={() => { setEditingQuestion({ question_text: "", category_id: activeCategory, answers: [{ id: Date.now(), question_id: 0, answer_text: "" }] }); setShowQuestionForm(true); }}
            style={{ padding: "0.5rem 1rem", background: "#3498db", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            + سؤال جديد
          </button>
        </div>
      )}

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
              <div key={cat.id} style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                <button
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
                  <span style={{ marginRight: "0.4rem", fontSize: "0.75rem", opacity: 0.7 }}>
                    ({questionCount})
                  </span>
                </button>
                {isManageMode && (
                  <div style={{ display: "flex", gap: "2px" }}>
                    <button onClick={() => { setEditingCategory(cat); setShowCategoryForm(true); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem" }}>✏️</button>
                    <button onClick={() => handleDeleteCategory(cat.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem" }}>🗑️</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Forms Overlay */}
      {(showCategoryForm || showQuestionForm) && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: "#1a1a1a", padding: "2rem", borderRadius: "12px", width: "100%", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto" }}>
            {showCategoryForm && editingCategory && (
              <form onSubmit={handleSaveCategory}>
                <h2 style={{ marginTop: 0 }}>{categories.find(c => c.id === editingCategory.id) ? "تعديل تصنيف" : "تصنيف جديد"}</h2>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem" }}>المعرف (ID):</label>
                  <input 
                    value={editingCategory.id} 
                    onChange={e => setEditingCategory({...editingCategory, id: e.target.value})}
                    style={{ width: "100%", padding: "0.5rem", background: "#333", border: "1px solid #444", color: "white", borderRadius: "4px" }}
                    disabled={!!categories.find(c => c.id === editingCategory.id)}
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem" }}>الاسم:</label>
                  <input 
                    value={editingCategory.label} 
                    onChange={e => setEditingCategory({...editingCategory, label: e.target.value})}
                    style={{ width: "100%", padding: "0.5rem", background: "#333", border: "1px solid #444", color: "white", borderRadius: "4px" }}
                  />
                </div>
                <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: "0.5rem" }}>الأيقونة:</label>
                    <input 
                      value={editingCategory.icon} 
                      onChange={e => setEditingCategory({...editingCategory, icon: e.target.value})}
                      style={{ width: "100%", padding: "0.5rem", background: "#333", border: "1px solid #444", color: "white", borderRadius: "4px" }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: "0.5rem" }}>اللون:</label>
                    <input 
                      type="color"
                      value={editingCategory.color} 
                      onChange={e => setEditingCategory({...editingCategory, color: e.target.value})}
                      style={{ width: "100%", height: "38px", background: "#333", border: "1px solid #444", color: "white", borderRadius: "4px" }}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                  <button type="submit" style={{ flex: 1, padding: "0.75rem", background: "#2ecc71", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>حفظ</button>
                  <button type="button" onClick={() => setShowCategoryForm(false)} style={{ flex: 1, padding: "0.75rem", background: "#e74c3c", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>إلغاء</button>
                </div>
              </form>
            )}

            {showQuestionForm && editingQuestion && (
              <form onSubmit={handleSaveQuestion}>
                <h2 style={{ marginTop: 0 }}>{editingQuestion.id ? "تعديل سؤال" : "سؤال جديد"}</h2>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem" }}>التصنيف:</label>
                  <select 
                    value={editingQuestion.category_id}
                    onChange={e => setEditingQuestion({...editingQuestion, category_id: e.target.value})}
                    style={{ width: "100%", padding: "0.5rem", background: "#333", border: "1px solid #444", color: "white", borderRadius: "4px" }}
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem" }}>السؤال:</label>
                  <textarea 
                    value={editingQuestion.question_text} 
                    onChange={e => setEditingQuestion({...editingQuestion, question_text: e.target.value})}
                    style={{ width: "100%", padding: "0.5rem", background: "#333", border: "1px solid #444", color: "white", borderRadius: "4px", minHeight: "80px" }}
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem" }}>الإجابات:</label>
                  {editingQuestion.answers?.map((ans, idx) => (
                    <div key={ans.id} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      <textarea 
                        value={ans.answer_text} 
                        onChange={e => {
                          const newAnswers = [...(editingQuestion.answers || [])];
                          newAnswers[idx] = { ...newAnswers[idx], answer_text: e.target.value };
                          setEditingQuestion({...editingQuestion, answers: newAnswers});
                        }}
                        style={{ flex: 1, padding: "0.5rem", background: "#333", border: "1px solid #444", color: "white", borderRadius: "4px" }}
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          const newAnswers = (editingQuestion.answers || []).filter((_, i) => i !== idx);
                          setEditingQuestion({...editingQuestion, answers: newAnswers});
                        }}
                        style={{ background: "#e74c3c", color: "white", border: "none", borderRadius: "4px", padding: "0 0.5rem" }}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => {
                      const newAnswers = [...(editingQuestion.answers || []), { id: Date.now(), question_id: editingQuestion.id || 0, answer_text: "" }];
                      setEditingQuestion({...editingQuestion, answers: newAnswers});
                    }}
                    style={{ width: "100%", padding: "0.5rem", background: "#333", border: "1px dashed #555", color: "#aaa", borderRadius: "4px", cursor: "pointer" }}
                  >
                    + إضافة إجابة أخرى
                  </button>
                </div>
                <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                  <button type="submit" style={{ flex: 1, padding: "0.75rem", background: "#2ecc71", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>حفظ</button>
                  <button type="button" onClick={() => setShowQuestionForm(false)} style={{ flex: 1, padding: "0.75rem", background: "#e74c3c", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>إلغاء</button>
                </div>
              </form>
            )}
          </div>
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
              <div style={{ display: "flex", alignItems: "center" }}>
                <button
                  onClick={() => setOpenQuestion(isOpen ? null : i)}
                  style={{
                    flex: 1,
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
                {isManageMode && (
                  <div style={{ padding: "0 1rem", display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => { setEditingQuestion(item); setShowQuestionForm(true); }} style={{ background: "none", border: "none", cursor: "pointer" }}>✏️</button>
                    <button onClick={() => handleDeleteQuestion(item.id)} style={{ background: "none", border: "none", cursor: "pointer" }}>🗑️</button>
                  </div>
                )}
              </div>

              {isOpen && (
                <div style={{ padding: "0 1.25rem 1.25rem 1.25rem" }}>
                  <div
                    style={{
                      height: "1px",
                      background: `${item.catColor}22`,
                      marginBottom: "1rem",
                    }}
                  />
                  {(item.answers || []).map((answer, answerIndex) => (
                    <div
                      key={answer.id}
                      style={{
                        marginBottom:
                          answerIndex < (item.answers || []).length - 1 ? "1rem" : 0,
                        position: "relative",
                        paddingRight: "1.5rem",
                        borderRight: `2px solid ${item.catColor}33`
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
