import { Link } from "react-router";
import { useCart } from "../../context/useCart";
import useAuth from "../../context/useAuth";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import { formatMoney, formatNumber } from "../../utils/format";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, isLoading, error } =
    useCart();
  const { isAuthenticated } = useAuth();

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (!isAuthenticated) {
    return (
      <main className="page">
        <header className="page-head">
          <h1 className="page-title">الشكارة</h1>
        </header>
        <EmptyState
          icon="lock"
          action={
            <Link to="/login" className="btn">
              دخول المحل
            </Link>
          }
        >
          سجّل دخول عشان تشوف الشكارة.
        </EmptyState>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="page-head">
        <h1 className="page-title">الشكارة</h1>
      </header>

      {error && (
        <p role="alert" className="notice notice--error">
          {error}
        </p>
      )}

      {isLoading ? (
        <Loading>جاري تحميل الشكارة...</Loading>
      ) : items.length === 0 ? (
        <EmptyState
          icon="sack"
          action={
            <Link to="/products" className="btn">
              شوف البضاعة
            </Link>
          }
        >
          الشكارة فاضية.
        </EmptyState>
      ) : (
        <>
          <section className="ledger" aria-label="أصناف الشكارة">
            <ul>
              {items.map((item) => (
                <li key={item.id} className="ledger-row">
                  <div>
                    <h2>{item.name}</h2>
                    <p className="muted">{formatMoney(item.price)} للقطعة</p>
                  </div>

                  <div className="qty" role="group" aria-label={`كمية ${item.name}`}>
                    <button
                      type="button"
                      aria-label="قلّل الكمية"
                      disabled={isLoading}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <output>{formatNumber(item.quantity)}</output>
                    <button
                      type="button"
                      aria-label="زوّد الكمية"
                      disabled={isLoading}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <p className="ledger-row__sum">
                    {formatMoney(item.price * item.quantity)}
                  </p>

                  <button
                    type="button"
                    className="btn btn--danger btn--sm"
                    disabled={isLoading}
                    onClick={() => removeItem(item.id)}
                  >
                    شيل من الشكارة
                  </button>
                </li>
              ))}
            </ul>

            <div className="ledger-total">
              <span>إجمالي الشكارة</span>
              <span className="price">{formatMoney(totalPrice)}</span>
            </div>
          </section>

          <div className="cart-actions">
            <button
              type="button"
              className="btn btn--ghost"
              disabled={isLoading}
              onClick={clearCart}
            >
              فرّغ الشكارة
            </button>
            <Link to="/checkout" className="btn btn--lg">
              خلّص الحساب
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
