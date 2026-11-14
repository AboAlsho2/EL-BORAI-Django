const TEETH = Array.from({ length: 8 }, (_, i) => i * 45);

const ICONS = {
  gear: (
    <>
      {TEETH.map((deg) => (
        <rect
          key={deg}
          x="28"
          y="6"
          width="8"
          height="9"
          rx="1"
          transform={`rotate(${deg} 32 32)`}
        />
      ))}
      <circle cx="32" cy="32" r="17" />
      <circle cx="32" cy="32" r="6" />
    </>
  ),
  nut: (
    <>
      <polygon points="54,32 43,51.05 21,51.05 10,32 21,12.95 43,12.95" />
      <circle cx="32" cy="32" r="9" />
      <circle cx="32" cy="32" r="14" opacity="0.45" />
    </>
  ),
  bolt: (
    <>
      <path d="M20 8 H44 L48 14 V20 H16 V14 Z" />
      <path d="M24 20 V52 L28 56 H36 L40 52 V20" />
      <path d="M24 28 H40 M24 34 H40 M24 40 H40 M24 46 H40" />
    </>
  ),
  spring: (
    <>
      <path d="M20 8 H44 M32 8 V12 M20 56 H44 M32 52 V56" />
      <path d="M32 12 C48 14 48 20 32 22 C16 24 16 30 32 32 C48 34 48 40 32 42 C16 44 16 50 32 52" />
    </>
  ),
  lock: (
    <>
      <rect x="14" y="28" width="36" height="26" rx="4" />
      <path d="M22 28 V20 A10 10 0 0 1 42 20 V28" />
      <circle cx="32" cy="39" r="3.5" />
      <path d="M32 42.5 V47" />
    </>
  ),
  hammer: (
    <>
      <rect x="10" y="10" width="34" height="14" rx="2" />
      <rect x="22" y="24" width="10" height="34" rx="3" />
      <path d="M44 14 L54 10 M44 20 L54 24" />
    </>
  ),
  sack: (
    <>
      <path d="M26 10 H38 L35 18 C50 26 54 40 50 52 C48 57 44 58 32 58 C20 58 16 57 14 52 C10 40 14 26 29 18 Z" />
      <path d="M27 15 H37" />
    </>
  ),
};

export const PART_KEYS = ["gear", "nut", "bolt", "spring", "lock", "hammer"];

export function iconForId(id) {
  const n = Number(id);
  const index = Number.isFinite(n) ? Math.abs(n) : 0;
  return PART_KEYS[index % PART_KEYS.length];
}

export default function PartIcon({ name = "gear", size = 64 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[name] || ICONS.gear}
    </svg>
  );
}
