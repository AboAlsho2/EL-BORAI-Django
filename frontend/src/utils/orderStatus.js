const LABELS = {
  PENDING: "قيد الانتظار",
  PROCESSING: "بيتجهّز",
  SHIPPED: "اتشحن",
  DELIVERED: "اتسلّم",
  CANCELLED: "اتلغى",
};

export function orderStatusLabel(status) {
  return LABELS[status] || status;
}
