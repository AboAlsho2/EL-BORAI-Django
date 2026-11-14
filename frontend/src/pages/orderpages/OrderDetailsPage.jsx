import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { getOrderById } from "../../services/orderService";
import { orderStatusLabel } from "../../utils/orderStatus";
import { formatMoney, formatNumber } from "../../utils/format";
import Loading from "../../components/Loading";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id)
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <main className="page">
        <Loading>جاري التحميل...</Loading>
      </main>
    );
  if (error)
    return (
      <main className="page">
        <p role="alert" className="notice notice--error">
          {error}
        </p>
      </main>
    );
  if (!order)
    return (
      <main className="page">
        <p className="notice">الطلب مش موجود.</p>
      </main>
    );

  return (
    <main className="page page--narrow">
      <header className="page-head">
        <h1 className="page-title">ورقة الطلب #{formatNumber(order.id)}</h1>
      </header>

      <article className="receipt">
        <dl className="receipt__meta">
          <div>
            <dt>الحالة</dt>
            <dd>
              <span className={`status status--${String(order.status).toLowerCase()}`}>
                {orderStatusLabel(order.status)}
              </span>
            </dd>
          </div>
          <div>
            <dt>العنوان</dt>
            <dd>{order.shipping_address || "—"}</dd>
          </div>
        </dl>

        <h2>الأصناف</h2>
        <ul>
          {(order.items || []).map((item) => (
            <li key={item.id} className="receipt-line">
              <span>
                {item.product_name} × {formatNumber(item.quantity)}
              </span>
              <span className="dots" aria-hidden="true" />
              <span>{formatMoney(item.price)}</span>
            </li>
          ))}
        </ul>

        <div className="receipt__total">
          <span>الإجمالي</span>
          <span className="price">{formatMoney(order.total_price)}</span>
        </div>

        <div className="receipt__back">
          <Link to="/orders" className="btn btn--ghost btn--sm">
            رجوع للدفتري
          </Link>
        </div>
      </article>
    </main>
  );
}
