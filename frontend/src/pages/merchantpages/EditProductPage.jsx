
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  getProductById,
  updateProduct,
} from "../../services/productService";
import ProductForm from "../../components/ProductForm";
import Loading from "../../components/Loading";

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      try {
        const product = await getProductById(id);

        if (cancelled) return;

        setInitialValues({
          name: product.name ?? "",
          description: product.description ?? "",
          price: String(product.price ?? ""),
          stock: String(product.stock ?? ""),
          category: String(product.category ?? ""),
        });
      } catch (error) {
        if (!cancelled) {
          setError(error.message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleUpdate(product) {
    setError("");
    setIsSubmitting(true);

    try {
      await updateProduct(id, product);
      navigate("/merchant/products");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="page page--narrow">
        <header className="page-head">
          <h1 className="page-title">عدّل البضاعة</h1>
        </header>
        <Loading>جاري تحميل المنتج...</Loading>
      </main>
    );
  }

  if (!initialValues) {
    return (
      <main className="page page--narrow">
        <header className="page-head">
          <h1 className="page-title">عدّل البضاعة</h1>
        </header>
        <p role="alert" className="notice notice--error">
          {error || "مقدرناش نحمّل المنتج."}
        </p>
        <Link to="/merchant/products" className="btn">
          رجوع لبضاعتي
        </Link>
      </main>
    );
  }

  return (
    <main className="page page--narrow">
      <Link to="/merchant/products" className="back-link">
        رجوع لبضاعتي
      </Link>

      <header className="page-head">
        <h1 className="page-title">عدّل البضاعة</h1>
      </header>

      <ProductForm
        initialValues={initialValues}
        onSubmit={handleUpdate}
        submitLabel="احفظ التعديل"
        isSubmitting={isSubmitting}
        error={error}
      />
    </main>
  );
}
