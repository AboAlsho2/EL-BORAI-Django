import { Link } from "react-router";
import PartIcon from "../components/PartIcon";

const SHELF = [
  { icon: "gear", label: "ترس" },
  { icon: "nut", label: "صامولة" },
  { icon: "bolt", label: "مسمار" },
  { icon: "spring", label: "زنبرك" },
  { icon: "lock", label: "قفل" },
  { icon: "hammer", label: "شاكوش" },
];

const CORNERS = [
  {
    icon: "gear",
    title: "قطع غيار",
    text: "دوّر على القطعة اللي ناقصة ماكينتك.",
  },
  {
    icon: "bolt",
    title: "خردوات",
    text: "مسامير وصواميل وكل حاجة صغيرة بتفرق.",
  },
  {
    icon: "hammer",
    title: "عدد وأدوات",
    text: "شواكيش ومفاتيح وكل اللي الصنايعي محتاجه.",
  },
];

const PROMISES = [
  {
    title: "السعر قدامك",
    text: "كل صنف مكتوب عليه سعره والكمية المتاحة منه.",
  },
  {
    title: "الشكارة على حسابك",
    text: "حط اللي عايزه، زوّد أو شيل، وراجع الإجمالي قبل ما تخلّص.",
  },
  {
    title: "دفتر لكل زبون",
    text: "كل طلب بتعمله بيتسجل في دفتري وتتابع حالته.",
  },
];

export default function HomePage() {
  return (
    <main className="home">
      <section aria-labelledby="shop-name">
        <div className="front__sign">
          <h1 id="shop-name">دكان البرعي</h1>
          <p>قطع غيار وخردوات</p>
        </div>

        <div className="front__window" aria-hidden="true">
          <div className="shelf">
            {SHELF.map((item) => (
              <div className="shelf__item" key={item.icon}>
                <PartIcon name={item.icon} size={76} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div className="shutter" />
        </div>

        <div className="front__actions">
          <Link to="/products" className="btn btn--lg">
            شوف البضاعة
          </Link>
          <Link to="/cart" className="btn btn--lg btn--ghost">
            افتح الشكارة
          </Link>
        </div>
      </section>

      <section aria-labelledby="corners-title">
        <h2 className="section-title" id="corners-title">
          في المحل
        </h2>
        <ul className="tag-grid">
          {CORNERS.map((corner) => (
            <li className="tag" key={corner.title}>
              <div className="tag__body">
                <div className="tag__art">
                  <PartIcon name={corner.icon} size={72} />
                </div>
                <h3 className="tag__name">
                  <Link to="/products">{corner.title}</Link>
                </h3>
                <p className="tag__desc">{corner.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="promises-title">
        <h2 className="section-title" id="promises-title">
          الحساب في الدفتر
        </h2>
        <div className="ledger promises">
          {PROMISES.map((item) => (
            <div className="ledger-row" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
