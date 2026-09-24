export function ChartCard({
    title,
    subtitle,
    children,
}: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="mb-4">
                <p className="text-sm font-semibold leading-tight">{title}</p>
                {subtitle && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
                )}
            </div>
            {children}
        </div>
    );
}
