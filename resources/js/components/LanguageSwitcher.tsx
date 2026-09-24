import { useState } from 'react';

export default function LanguageSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState('EN');

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'fr', label: 'Français' },
        { code: 'es', label: 'Español' },
        { code: 'de', label: 'Deutsch' },
    ];

    const handleSelect = (code : string, label : string) => {
        setCurrentLang(label);
        setIsOpen(false);
        // TODO: change app locale (e.g., Inertia.visit with query param)
        console.log(`Language changed to ${code}`);
    };

    return (
        <div className="relative" onMouseLeave={() => setIsOpen(false)}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 text-sm text-slate-600 hover:text-slate-900 focus:outline-none"
            >
                <i className="fas fa-globe text-lg" />
                <span className="hidden sm:inline">{currentLang}</span>
                <i className="fas fa-chevron-down text-xs" />
            </button>

            {isOpen && (
                <div className="absolute right-0 z-40 mt-2 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                    {languages.map(({ code, label }) => (
                        <a
                            key={code}
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleSelect(code, label);
                            }}
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                            <span>🌐</span> {/* or use flag icons */}
                            <span>{label}</span>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
