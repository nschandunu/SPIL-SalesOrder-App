export default function Button({ children, onClick, variant = 'primary', className = '', type = 'button', ...props }) {
    const baseStyle = "border-2 border-black px-6 py-1 font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 print:hidden";
    
    const variants = {
        primary: "bg-blue-500 text-white hover:bg-blue-600",
        secondary: "bg-white text-black hover:bg-gray-50",
        success: "bg-green-400 text-black hover:bg-green-500",
        danger: "bg-red-400 text-white hover:bg-red-500",
        warning: "bg-yellow-400 text-black hover:bg-yellow-500"
    };

    return (
        <button 
            type={type}
            onClick={onClick} 
            className={`${baseStyle} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}