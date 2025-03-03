export function Input({ value, onChange, placeholder, className = "" }) {
    return (
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${className}`}
      />
    );
  }
  