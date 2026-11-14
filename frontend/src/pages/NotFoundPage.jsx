import { Link } from "react-router";
import EmptyState from "../components/EmptyState";

export default function NotFoundPage() {
  return (
    <main className="page">
      <header className="page-head">
        <h1 className="page-title">404 - الصفحة مش موجودة</h1>
      </header>
      <EmptyState
        icon="sack"
        action={
          <Link to="/" className="btn">
            رجوع للمحلة
          </Link>
        }
      >
        الصفحة اللي بتدوّر عليها مالهاش وجود.
      </EmptyState>
    </main>
  );
}
