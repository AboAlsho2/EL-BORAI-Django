export default function Pagination({ page, hasNext, onChange, disabled }) {
  if (page === 1 && !hasNext) return null;

  return (
    <div className="pager">
      <button
        type="button"
        className="btn btn--ghost btn--sm"
        disabled={disabled || page <= 1}
        onClick={() => onChange(page - 1)}
      >
        السابق
      </button>
      <span>صفحة {page}</span>
      <button
        type="button"
        className="btn btn--ghost btn--sm"
        disabled={disabled || !hasNext}
        onClick={() => onChange(page + 1)}
      >
        التالي
      </button>
    </div>
  );
}
