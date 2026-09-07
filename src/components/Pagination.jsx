export default function Pagination({ meta, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(meta.totalCount / meta.pageSize));

  return (
    <div className="flex items-center gap-3 text-sm">
      <button
        onClick={() => onPageChange(meta.page - 1)}
        disabled={meta.page <= 1}
        className="border-2 border-black bg-white px-3 py-1 font-bold shadow-brutal-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-40"
      >
        Anterior
      </button>
      <span className="font-bold">
        Página {meta.page} de {totalPages} ({meta.totalCount} en total)
      </span>
      <button
        onClick={() => onPageChange(meta.page + 1)}
        disabled={meta.page >= totalPages}
        className="border-2 border-black bg-white px-3 py-1 font-bold shadow-brutal-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-40"
      >
        Siguiente
      </button>
    </div>
  );
}
