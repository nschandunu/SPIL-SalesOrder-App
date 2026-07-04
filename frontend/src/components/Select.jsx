export default function Select({ label, name, value, onChange, options, defaultText = "Select...", labelWidth = "w-32", required, className = "", ...props }) {
    return (
        <div className="flex items-center w-full">
            {label && (
                <label className={`${labelWidth} font-bold text-sm`}>
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <select
                name={name}
                value={value}
                onChange={onChange}
                className={`flex-1 border-2 border-black p-1 bg-white focus:outline-none focus:bg-gray-50 ${className}`}
                {...props}
            >
                <option value="">-- {defaultText} --</option>
                {options.map((opt, index) => (
                    <option key={index} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}