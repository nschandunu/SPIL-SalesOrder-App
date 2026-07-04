export default function Input({ label, name, value, onChange, type = "text", required, labelWidth = "w-32", className = "", ...props }) {
    return (
        <div className="flex items-center w-full">
            {label && (
                <label className={`${labelWidth} font-bold text-sm`}>
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className={`flex-1 border-2 border-black p-1 bg-white focus:outline-none focus:bg-gray-50 ${className}`}
                {...props}
            />
        </div>
    );
}