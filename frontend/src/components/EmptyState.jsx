import PartIcon from "./PartIcon";

export default function EmptyState({ icon = "sack", children, action }) {
  return (
    <div className="empty">
      <PartIcon name={icon} size={72} />
      <p>{children}</p>
      {action}
    </div>
  );
}
