const styles = {
  ok: "bg-green-200 text-black",
  out_of_range: "bg-red-300 text-black",
  no_data: "bg-yellow-200 text-black",
};

const labels = {
  ok: "OK",
  out_of_range: "Fuera de rango",
  no_data: "Sin datos",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block border-2 border-black px-2 py-0.5 text-xs font-bold shadow-brutal-sm ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
