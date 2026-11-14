import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useCart } from "../../context/useCart";
import { getProductById } from "../../services/productService";
import PartIcon, { iconForId } from "../../components/PartIcon";
import Loading from "../../components/Loading";
import { formatMoney, formatNumber, stockState } from "../../utils/format";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { addItem, error: cartError } = useCart();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadProduct() {
      setIsLoading(true);
      setError("");
      setNotice("");
      setProduct(null);

      try {
        const data = await getProductById(id);

        if (isActive) {
          setProduct(data);
        }
      } catch (err) {
        if (isActive) {
          setError(err.message || "فشل تحميل المنتج.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      isActive = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <main className="page">
        <Loading>جاري تحميل المنتج...</Loading>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page">
        <header className="page-head">
          <h1 className="page-title">تفاصيل المنتج</h1>
        </header>
        <p role="alert" className="notice notice--error">
          مقدرناش نحمّل المنتج: {error}
        </p>
        <Link to="/products" className="btn">
          رجوع للبضاعة
        </Link>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="page">
        <header className="page-head">
          <h1 className="page-title">المنتج مش موجود</h1>
        </header>
        <Link to="/products" className="btn">
          رجوع للبضاعة
        </Link>
      </main>
    );
  }

  async function handleAddToCart() {
    setNotice("");
    const ok = await addItem({ ...product, quantity: 1 });
    if (ok) setNotice("اتحطّ في الشكارة.");
  }

  const state = stockState(product.stock);

  return (
    <main className="page">
      <Link to="/products" className="back-link">
        رجوع للبضاعة
      </Link>

      <div className="detail">
        <div className="detail__display" aria-hidden="true">
          <PartIcon name={iconForId(product.id)} size={160} />
        </div>

        <article className="sheet detail__sheet">
          <h1>{product.name}</h1>
          <p>{product.description}</p>

          <div className="tag__meta">
            {product.category_name && (
              <span className="stamp">القسم: {product.category_name}</span>
            )}
            <span className={`stock stock--${state}`}>
              المتاح: {formatNumber(product.stock)}
            </span>
          </div>

          <div className="detail__buy">
            <p className="price">{formatMoney(product.price)}</p>
            <button
              type="button"
              className="btn btn--lg"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              {product.stock <= 0 ? "خلصت من الرصيد" : "حط في الشكارة"}
            </button>
          </div>

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
        </article>
      </div>
    </main>
  );
}
