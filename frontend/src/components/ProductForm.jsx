import { useEffect, useState } from "react";
import { createCategory, getCategories } from "../services/productService";

export default function ProductForm({
  initialValues,
  onSubmit,
  submitLabel,
  isSubmitting,
  error,
}) {
  const [form, setForm] = useState(initialValues);
  const [categories, setCategories] = useState([]);
  const [categoriesError, setCategoriesError] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  useEffect(() => {
    let active = true;

    getCategories()
      .then((list) => active && setCategories(list))
      .catch((err) => active && setCategoriesError(err.message));

    return () => {
      active = false;
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleAddCategory() {
    const name = newCategory.trim();
    if (!name) return;

    setAddingCategory(true);
    setCategoriesError("");
    try {
      const created = await createCategory(name);
      setCategories((current) => [...current, created]);
      setForm((current) => ({ ...current, category: String(created.id) }));
      setNewCategory("");
    } catch (err) {
      setCategoriesError(err.message);
    } finally {
      setAddingCategory(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      category: Number(form.category),
    });
  }

  return (
    <form className="sheet" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="name">اسم المنتج</label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="description">الوصف</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          rows={4}
        />
      </div>

      <div className="field">
        <label htmlFor="price">السعر (ج)</label>
        <input
          id="price"
          name="price"
          type="number"
          min="0.01"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="stock">الكمية المتاحة</label>
        <input
          id="stock"
          name="stock"
          type="number"
          min="0"
          step="1"
          value={form.stock}
          onChange={handleChange}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="category">القسم</label>
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">اختار القسم</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="newCategory">أو ضيف قسم جديد</label>
        <div className="field-row">
          <input
            id="newCategory"
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={handleAddCategory}
            disabled={addingCategory || !newCategory.trim()}
          >
            {addingCategory ? "جاري الإضافة..." : "ضيف القسم"}
          </button>
        </div>
        {categoriesError && (
          <p role="alert" className="notice notice--error">
            {categoriesError}
          </p>
        )}
      </div>

      {error && (
        <p role="alert" className="notice notice--error">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn--lg" disabled={isSubmitting}>
        {isSubmitting ? "جاري الحفظ..." : submitLabel}
      </button>
    </form>
  );
}
