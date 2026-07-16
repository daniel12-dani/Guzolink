export default function ProductsUnavailable({
  message = "We're having trouble loading products right now.",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-slate-700 bg-slate-800/50 py-16 text-center">
      <p className="text-slate-300">{message}</p>
      <p className="text-sm text-slate-500">Please check back in a moment.</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded-full bg-slate-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-600"
        >
          Try again
        </button>
      )}
    </div>
  );
}