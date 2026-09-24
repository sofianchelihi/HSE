export default function SectionCard({
    icon,
    iconBg,
    title,
    subtitle,
    children,
}) {
    return (
        <section>
            <div className="mb-5 flex items-center gap-3">
                <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}
                >
                    <i className={icon}></i>
                </div>
                <div>
                    <h2 className="text-base font-bold text-slate-800">
                        {title}
                    </h2>
                    <p className="text-xs text-slate-400">{subtitle}</p>
                </div>
            </div>
            {children}
        </section>
    );
}
