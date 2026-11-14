import { useState } from "react";
import { Link, useNavigate } from "react-router";
import useAuth from "../../context/useAuth";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    role: "CUSTOMER",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.password !== form.password_confirm) {
      setError("كلمتا السر مش متطابقين");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.message || "فشل إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page page--narrow">
      <header className="page-head">
        <h1 className="page-title">افتح حساب</h1>
      </header>
      <form className="sheet" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="username">اسم المستخدم</label>
          <input
            id="username"
            autoComplete="username"
            value={form.username}
            onChange={(e) => update("username", e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="email">الإيميل</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="password">كلمة السر</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="password_confirm">تأكيد كلمة السر</label>
          <input
            id="password_confirm"
            type="password"
            autoComplete="new-password"
            value={form.password_confirm}
            onChange={(e) => update("password_confirm", e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="role">نوع الحساب</label>
          <select
            id="role"
            value={form.role}
            onChange={(e) => update("role", e.target.value)}
          >
            <option value="CUSTOMER">زبون</option>
            <option value="MERCHANT">صاحب محل</option>
          </select>
        </div>
        {error && (
          <p role="alert" className="notice notice--error">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn--lg btn--block" disabled={loading}>
          {loading ? "جاري الفتح..." : "افتح الحساب"}
        </button>
        <p className="form-foot">
          عندك حساب؟ <Link to="/login">دخول المحل</Link>
        </p>
      </form>
    </main>
  );
}
