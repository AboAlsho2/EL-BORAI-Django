import { useState } from "react";
import { useNavigate } from "react-router";
import { createOrder } from "../../services/orderService";
import { useCart } from "../../context/useCart";

export default function CheckoutPage() {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshCart } = useCart();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const order = await createOrder(address);
      await refreshCart();
      navigate(`/orders/${order.id}`);
    } catch (err) {
      setError(err.message || "فشل إنشاء الطلب");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page page--narrow">
      <header className="page-head">
        <h1 className="page-title">خلّص الحساب</h1>
      </header>
      <form className="sheet" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="address">عنوان التسليم</label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            placeholder="العنوان بالتفصيل"
          />
        </div>
        {error && (
          <p role="alert" className="notice notice--error">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn--lg btn--block" disabled={loading}>
          {loading ? "جاري فتح الطلب..." : "أكّد الطلب"}
        </button>
      </form>
    </main>
  );
}
