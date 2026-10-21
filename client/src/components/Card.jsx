export default function Card({ title, children }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-5 border border-gray-100 mb-4">
      {title && <h3 className="text-lg font-bold text-gray-800 mb-3">{title}</h3>}
      <div>{children}</div>
    </div>
  );
}