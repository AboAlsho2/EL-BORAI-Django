import { Link } from "react-router";
import EmptyState from "../components/EmptyState";

export default function ComingSoonPage({ title }) {
  return (
    <main className="page">
      <header className="page-head">
        <h1 className="page-title">{title}</h1>
      </header>
      <EmptyState
        icon="gear"
        action={
          <Link to="/" className="btn">
            رجوع للمحلة
          </Link>
        }
      >
        الخدمة دي لسه مش جاهزة.
      </EmptyState>
    </main>
  );
}
