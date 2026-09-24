export default function InputField({ label, required, error, children }) {
    
    return (
        <div>
            <label className="mb-2 block text-xs font-semibold text-slate-600">
                {label} {required && <span className="text-rose-500">*</span>}
            </label>
            {children}
            {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
        </div>
    );
}
