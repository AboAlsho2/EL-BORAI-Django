import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import useAuth from "../../context/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page page--narrow">
      <header className="page-head">
        <h1 className="page-title">دخول المحل</h1>
      </header>
      <form className="sheet" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="username">اسم المستخدم</label>
          <input
            id="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="password">كلمة السر</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && (
          <p role="alert" className="notice notice--error">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn--lg btn--block" disabled={loading}>
          {loading ? "جاري الدخول..." : "ادخل"}
        </button>
        <p className="form-foot">
          مش عندك حساب؟ <Link to="/register">افتح حساب</Link>
        </p>
      </form>
    </main>
  );
}
