import PartIcon from "./PartIcon";

export default function Loading({ children }) {
  return (
    <p className="loading" role="status">
      <PartIcon name="gear" size={32} />
      <span>{children}</span>
    </p>
  );
}
