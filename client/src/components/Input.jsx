export default function Input({ label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1 mb-3">
      {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
      <input 
        className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
          error ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
        }`} 
        {...props} 
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}