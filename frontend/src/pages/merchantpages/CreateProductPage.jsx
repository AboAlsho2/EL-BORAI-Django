
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { createProduct } from "../../services/productService";
import ProductForm from "../../components/ProductForm";

const initialForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
};

export default function CreateProductPage() {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  async function handleCreate(product) {
    setError("");
    setIsSubmitting(true);

    try {
      await createProduct(product);
      navigate("/merchant/products");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page page--narrow">
      <Link to="/merchant/products" className="back-link">
        رجوع لبضاعتي
      </Link>

      <header className="page-head">
        <h1 className="page-title">ضيف بضاعة</h1>
      </header>

      <ProductForm
        initialValues={initialForm}
        onSubmit={handleCreate}
        submitLabel="ضيف المنتج"
        isSubmitting={isSubmitting}
        error={error}
      />
    </main>
  );
}
