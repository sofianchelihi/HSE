export default function UserTypeCard({
    title,
    description,
    accent,
    icon,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group relative flex flex-col items-start gap-4 border border-[#D8D2C4] bg-[#FBFAF6] px-7 py-8 text-left transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-16px_rgba(28,42,58,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ '--accent': accent }}
        >
            <span
                className="flex h-11 w-11 items-center justify-center rounded-full border"
                style={{ borderColor: accent, color: accent }}
            >
                {icon}
            </span>

            <span>
                <span className="block font-serif text-2xl text-[#1C2A3A]">
                    {title}
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-[#5B5647]">
                    {description}
                </span>
            </span>

            <span
                className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium transition group-hover:gap-2.5"
                style={{ color: accent }}
            >
                Start here
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                        d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </span>

            <span
                className="absolute inset-x-0 bottom-0 h-[3px] scale-x-0 transition-transform duration-200 group-hover:scale-x-100"
                style={{ backgroundColor: accent }}
            />
        </button>
    );
}
