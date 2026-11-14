import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getOrders } from "../../services/orderService";
import { orderStatusLabel } from "../../utils/orderStatus";
import { formatMoney, formatNumber } from "../../utils/format";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    getOrders(page)
      .then((data) => {
        if (!active) return;
        setOrders(Array.isArray(data) ? data : data.results || []);
        setHasNext(Boolean(!Array.isArray(data) && data.next));
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [page]);

  if (loading)
    return (
      <main className="page">
        <Loading>جاري تحميل الدفتر...</Loading>
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

  return (
    <main className="page">
      <header className="page-head">
        <h1 className="page-title">دفتري</h1>
      </header>

      {orders.length === 0 ? (
        <EmptyState
          icon="sack"
          action={
            <Link to="/products" className="btn">
              شوف البضاعة
            </Link>
          }
        >
          لسه ما فيش طلبات.
        </EmptyState>
      ) : (
        <section className="ledger" aria-label="طلباتي">
          <ul>
            {orders.map((o) => (
              <li key={o.id}>
                <Link to={`/orders/${o.id}`} className="ledger-row ledger-row--order">
                  <h2>طلب #{formatNumber(o.id)}</h2>
                  <span className="ledger-row__sum">{formatMoney(o.total_price)}</span>
                  <span className={`status status--${String(o.status).toLowerCase()}`}>
                    {orderStatusLabel(o.status)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Pagination page={page} hasNext={hasNext} onChange={setPage} />
    </main>
  );
}
