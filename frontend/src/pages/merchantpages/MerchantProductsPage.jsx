import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getProducts, deleteProduct } from "../../services/productService";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import { formatMoney, formatNumber, stockState } from "../../utils/format";

export default function MerchantProductsPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const data = await getProducts(`mine=1&page=${page}`);

        if (!cancelled) {
          setProducts(Array.isArray(data) ? data : data.results || []);
          setHasNext(Boolean(!Array.isArray(data) && data.next));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [page]);

  async function handleDelete(id) {
    const confirmed = window.confirm("متأكد إنك عايز تمسح المنتج ده؟");

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(id);

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <main className="page">
        <header className="page-head">
          <h1 className="page-title">بضاعتي</h1>
        </header>
        <Loading>جاري التحميل...</Loading>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="page-head">
        <h1 className="page-title">بضاعتي</h1>
        <Link to="/merchant/products/new" className="btn">
          ضيف بضاعة
        </Link>
      </header>

      {error && (
        <p role="alert" className="notice notice--error">
          {error}
        </p>
      )}

      {products.length === 0 ? (
        <EmptyState
          icon="sack"
          action={
            <Link to="/merchant/products/new" className="btn">
              ضيف بضاعة
            </Link>
          }
        >
          لسه ما ضفتش بضاعة.
        </EmptyState>
      ) : (
        <section className="ledger" aria-label="بضاعتي">
          <ul>
            {products.map((product) => (
              <li key={product.id} className="ledger-row ledger-row--stock">
                <h2>{product.name}</h2>

                <div className="stock-cell">
                  <span className="price">{formatMoney(product.price)}</span>
                  <span className={`stock stock--${stockState(product.stock)}`}>
                    المتاح: {formatNumber(product.stock)}
                  </span>
                </div>

                <div className="ledger-row__actions">
                  <Link
                    to={`/merchant/products/${product.id}/edit`}
                    className="btn btn--ghost btn--sm"
                  >
                    تعديل
                  </Link>
                  <button
                    type="button"
                    className="btn btn--danger btn--sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    مسح
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Pagination page={page} hasNext={hasNext} onChange={setPage} />
    </main>
  );
}
