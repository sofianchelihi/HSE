import { ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function MainLayout({ children }: { children: ReactNode }) {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = i18n.language;
    }, [i18n.language]);

    const resetGCU = () => {
        localStorage.removeItem('gcu_accepted');
        window.location.reload();
    };

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-slate-100 font-sans antialiased">
            {/* HEADER */}
            <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md">
                            <i className="fas fa-bullhorn text-lg text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-800">
                            Complaint<span className="text-blue-600">Hub</span>
                        </span>
                    </div>

                    {/* Right: Language switcher + social icons */}
                    <div className="flex items-center space-x-6">
                        <LanguageSwitcher />
                        <div className="hidden items-center space-x-4 text-slate-500 sm:flex">
                            <a href="#" className="social-icon text-lg transition hover:text-blue-600">
                                <i className="fab fa-facebook" />
                            </a>
                            <a href="#" className="social-icon text-lg transition hover:text-sky-500">
                                <i className="fab fa-twitter" />
                            </a>
                            <a href="#" className="social-icon text-lg transition hover:text-pink-600">
                                <i className="fab fa-instagram" />
                            </a>
                            <a href="#" className="social-icon text-lg transition hover:text-blue-700">
                                <i className="fab fa-linkedin-in" />
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="flex flex-1 items-center justify-center p-4">
                {children}
            </main>

            {/* FOOTER */}
            <footer className="mt-4 border-t border-slate-200/60 bg-white/80 py-6 backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6 lg:px-8">
                    <p className="text-sm text-slate-500">{t('layout.copyright')}</p>
                    <div className="flex items-center space-x-5">
                        <button
                            onClick={resetGCU}
                            className="text-sm text-blue-600 hover:underline focus:outline-none"
                        >
                            <i className="fas fa-undo-alt mr-1" /> {t('layout.resetGcu')}
                        </button>
                        <div className="flex items-center space-x-4 text-slate-500">
                            <a href="#" className="social-icon text-lg transition hover:text-blue-600">
                                <i className="fab fa-facebook" />
                            </a>
                            <a href="#" className="social-icon text-lg transition hover:text-sky-500">
                                <i className="fab fa-twitter" />
                            </a>
                            <a href="#" className="social-icon text-lg transition hover:text-pink-600">
                                <i className="fab fa-instagram" />
                            </a>
                            <a href="#" className="social-icon text-lg transition hover:text-blue-700">
                                <i className="fab fa-linkedin-in" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
