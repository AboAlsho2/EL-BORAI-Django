import { Link } from "react-router";
import PartIcon, { iconForId } from "./PartIcon";
import { formatMoney, formatNumber, stockState } from "../utils/format";

export default function ProductCard({ product, onAdd }) {
  const state = stockState(product.stock);
  const soldOut = state === "out";

  return (
    <li className="tag">
      <div className="tag__body">
        <div className="tag__art">
          <PartIcon name={iconForId(product.id)} size={72} />
        </div>

        <h2 className="tag__name">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h2>
        <p className="tag__desc">{product.description}</p>

        <div className="tag__meta">
          {product.category_name && (
            <span className="stamp">القسم: {product.category_name}</span>
          )}
          <span className={`stock stock--${state}`}>
            المتاح: {formatNumber(product.stock)}
          </span>
        </div>

        <div className="tag__buy">
          <span className="price">{formatMoney(product.price)}</span>
        </div>

        <button
          type="button"
          className="btn"
          onClick={() => onAdd(product)}
          disabled={soldOut}
        >
          {soldOut ? "خلصت من الرصيد" : "حط في الشكارة"}
        </button>
      </div>
    </li>
  );
}
