const CHART_COLORS = [
    '#6366f1',
    '#8b5cf6',
    '#a78bfa',
    '#c4b5fd',
    '#ddd6fe',
    '#ede9fe',
];

export default function PlaceholderBarChart({
    title,
    bars,
}: {
    title: string;
    bars: number[];
}) {
    const max = Math.max(...bars);
    return (
        <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex h-24 items-end gap-1.5">
                {bars.map((v, i) => (
                    <div
                        key={i}
                        className="flex-1 rounded-t-sm"
                        style={{
                            height: `${(v / max) * 100}%`,
                            backgroundColor:
                                CHART_COLORS[i % CHART_COLORS.length],
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
