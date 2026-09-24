import { ChangeEventHandler, useState } from 'react';

interface Props {
    // Controlled mode (used with useForm)
    value?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    // Uncontrolled mode (used with <Form>)
    name?: string;
    // Shared
    placeholder?: string;
    error?: string;
}

export default function PasswordInput({
    value,
    onChange,
    name,
    placeholder = '••••••••',
    error,
}: Props) {
    const [show, setShow] = useState(false);

    // If `name` is provided, treat as uncontrolled (Inertia <Form>)
    const isUncontrolled = !!name && value === undefined;

    return (
        <div>
            <div className="relative">
                <input
                    type={show ? 'text' : 'password'}
                    {...(isUncontrolled
                        ? { name, defaultValue: '' }
                        : { value, onChange }
                    )}
                    placeholder={placeholder}
                    className="w-full bg-slate-50 border-[1.5px] border-slate-200 rounded-xl px-4 py-3 pr-12 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 outline-none transition"
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
                >
                    <i className={`fas ${show ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                </button>
            </div>
            {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
        </div>
    );
}
