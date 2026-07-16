export default function LoadingSpinner({
  message = "Loading...",
  size = "md", // "sm" | "md" | "lg"
}) {
  const sizeMap = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-4",
    lg: "h-14 w-14 border-4",
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 py-10">
      <div
        className={`${sizeMap[size]} animate-spin rounded-full border-slate-500 border-t-blue-500`}
      />
      <p className="text-center text-slate-300 text-sm">{message}</p>
    </div>
  );
}