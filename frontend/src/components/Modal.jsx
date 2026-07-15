// multi modal used for information, error and notifictions 
// blur window background and show modal in the center of the screen


export default function Modal({ isOpen, onClose, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-60 " onClick={onClose}></div>
      <div className="flex flex-col items-center justify-center bg-slate-800 p-6 rounded shadow-lg z-10 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}