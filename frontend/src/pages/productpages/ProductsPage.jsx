import { useEffect, useState } from "react";
import { useCart } from "../../context/useCart";
import { getProducts } from "../../services/productService";
import Pagination from "../../components/Pagination";
import ProductCard from "../../components/ProductCard";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";

export default function ProductsPage() {
  const { items, addItem, error: cartError } = useCart();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadProducts() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getProducts(`page=${page}`);

        if (isActive) {
          setProducts(Array.isArray(data) ? data : data.results || []);
          setHasNext(Boolean(!Array.isArray(data) && data.next));
        }
      } catch (err) {
        if (isActive) {
          setError(err.message || "فشل تحميل البضاعة.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isActive = false;
    };
  }, [page]);

  async function handleAddToCart(product) {
    setNotice("");
    const ok = await addItem({ ...product, quantity: 1 });
    if (ok) setNotice(`اتحطّ "${product.name}" في الشكارة.`);
  }

  if (isLoading) {
    return (
      <main className="page">
        <Loading>جاري تحميل البضاعة...</Loading>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page">
        <header className="page-head">
          <h1 className="page-title">البضاعة</h1>
        </header>
        <p role="alert" className="notice notice--error">
          {error}
        </p>
        <button className="btn" onClick={() => window.location.reload()}>
          حاول تاني
        </button>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="page-head">
        <h1 className="page-title">البضاعة</h1>
      </header>

      {notice && (
        <p role="status" className="notice">
          {notice}
        </p>
      )}
      {cartError && (
        <p role="alert" className="notice notice--error">
          {cartError}
        </p>
      )}

      {products.length === 0 ? (
        <EmptyState icon="sack">مفيش بضاعة لسه.</EmptyState>
      ) : (
        <ul className="tag-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={handleAddToCart}
            />
          ))}
        </ul>
      )}

      <Pagination page={page} hasNext={hasNext} onChange={setPage} />

      <p className="bag-note">أصناف مختلفة في الشكارة: {items.length}</p>
    </main>
  );
}
