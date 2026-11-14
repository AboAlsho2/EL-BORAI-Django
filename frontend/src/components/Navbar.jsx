import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import useAuth from "../context/useAuth";
import { useCart } from "../context/useCart";
import PartIcon from "./PartIcon";
import { formatNumber } from "../utils/format";

export default function Navbar() {
  const { isAuthenticated, user, logout, isMerchant, isCustomer } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  function handleLogout() {
    close();
    logout();
    navigate("/");
  }

  return (
    <header className="site-header">
      <div className="awning" aria-hidden="true" />
      <nav className="nav" aria-label="القايمة الرئيسية">
        <Link to="/" className="brand" onClick={close}>
          <PartIcon name="nut" size={24} />
          دكان البرعي
        </Link>

        <button
          type="button"
          className="btn btn--ghost btn--sm nav__toggle"
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "اقفل" : "القايمة"}
        </button>

        <div id="nav-links" className="nav__links" data-open={open}>
          <NavLink to="/" end className="nav__link" onClick={close}>
            المحلة
          </NavLink>
          <NavLink to="/products" className="nav__link" onClick={close}>
            البضاعة
          </NavLink>
          <NavLink to="/cart" className="nav__link" onClick={close}>
            الشكارة
            {items.length > 0 && (
              <span className="badge" aria-label={`${items.length} صنف`}>
                {formatNumber(items.length)}
              </span>
            )}
          </NavLink>

          {isAuthenticated && isCustomer && (
            <NavLink to="/orders" className="nav__link" onClick={close}>
              دفتري
            </NavLink>
          )}

          {isAuthenticated && isMerchant && (
            <NavLink to="/merchant/products" className="nav__link" onClick={close}>
              بضاعتي
            </NavLink>
          )}

          {isAuthenticated ? (
            <>
              <span className="nav__user">{user?.username || "حسابي"}</span>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={handleLogout}
              >
                خروج
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav__link" onClick={close}>
                دخول المحل
              </NavLink>
              <NavLink to="/register" className="nav__link" onClick={close}>
                افتح حساب
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
