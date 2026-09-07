export function Loading() {
  return (
    <p className="py-8 text-center font-bold text-gray-500">Cargando...</p>
  );
}

export function ErrorMessage({ message }) {
  return (
    <p className="border-2 border-black bg-red-300 px-4 py-3 font-bold text-black shadow-brutal">
      {message}
    </p>
  );
}
