import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
    { code: 'en', label: 'English', flag: '🇬🇧', dir: 'ltr' },
    { code: 'fr', label: 'Français', flag: '🇫🇷', dir: 'ltr' },
    { code: 'ar', label: 'العربية', flag: '🇩🇿', dir: 'rtl' },
] as const;

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

    // Close when clicking anywhere outside the component
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (code: string, dir: string) => {
        i18n.changeLanguage(code);
        document.documentElement.dir = dir;
        document.documentElement.lang = code;
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center space-x-2 text-sm text-slate-600 hover:text-slate-900 focus:outline-none"
            >
                <span>{current.flag}</span>
                <span className="hidden sm:inline font-medium">{current.label}</span>
                <i className="fas fa-chevron-down text-xs" />
            </button>

            {isOpen && (
                <div className="absolute right-0 z-40 mt-2 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                    {LANGUAGES.map(({ code, label, flag, dir }) => (
                        <button
                            key={code}
                            onClick={() => handleSelect(code, dir)}
                            className={`flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 ${
                                code === i18n.language ? 'font-semibold text-blue-600' : ''
                            }`}
                        >
                            <span>{flag}</span>
                            <span>{label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
