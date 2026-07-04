export default function Table({ headers, children, className = "" }) {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="w-full border-collapse border-2 border-black text-left text-sm print:text-xs">
                <thead className="bg-gray-300">
                    <tr>
                        {headers.map((col, idx) => (
                            <th key={idx} className={`border-2 border-black p-2 print:p-1 ${col.className || ''}`}>
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {children}
                </tbody>
            </table>
        </div>
    );
}