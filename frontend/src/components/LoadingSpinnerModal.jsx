// loading spinner modal for tasks takes time 
// blur window background and show modal in the center of the screen
//  spinner animation is a simple css animation that rotates a div with border

export default function LoadingSpinnerModal({
  isOpen,
  message = "Loading...",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dark blurred background */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center rounded-lg bg-slate-800 p-6 shadow-xl">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-500 border-t-blue-500" />
        <p className="text-center text-white">{message}</p>
      </div>
    </div>
  );
}