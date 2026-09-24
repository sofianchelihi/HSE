import { useRef } from 'react';

export default function BarcodeInput({ value = '', onChange }) {
    const inputsRef = useRef([]);
    const digits = value.padEnd(6, ' ').split('').slice(0, 6);


    const handleChange = (index, char) => {
        if (!/^\d?$/.test(char)) return;
        const newDigits = [...digits];
        newDigits[index] = char || ' ';
        onChange(newDigits.join('').trimEnd());
        if (char && index < 5) inputsRef.current[index + 1].focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            if (digits[index].trim()) {
                const newDigits = [...digits];
                newDigits[index] = ' ';
                onChange(newDigits.join('').trimEnd());
            }
            if (index > 0) inputsRef.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData
            .getData('text')
            .replace(/\D/g, '')
            .slice(0, 6);
        onChange(pasted);
        inputsRef.current[Math.min(pasted.length, 5)].focus();
    };

    return (
        <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
                <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digits[i]?.trim() || ''}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    className="h-13 w-11 rounded-xl border-[1.5px] border-slate-200 bg-slate-50 text-center text-xl font-bold text-slate-800 transition outline-none focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
            ))}
            <span className="mx-1 font-bold text-slate-400">—</span>
            {[3, 4, 5].map((i) => (
                <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digits[i]?.trim() || ''}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    className="h-13 w-11 rounded-xl border-[1.5px] border-slate-200 bg-slate-50 text-center text-xl font-bold text-slate-800 transition outline-none focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
            ))}
        </div>
    );
}
