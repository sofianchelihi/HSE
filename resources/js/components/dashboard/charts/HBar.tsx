import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import type { ChartPoint } from '@/types/dashboard';

function ChartTooltip({
    active,
    payload,
    valueFormatter,
    valueLabel,
}: any & { valueFormatter?: (v: number) => string; valueLabel?: string }) {
    if (!active || !payload?.length) return null;
    const raw = payload[0].value as number;
    return (
        <div className="rounded-lg border bg-background px-3 py-2 shadow-lg text-xs">
            <p className="mb-1 max-w-[160px] truncate font-medium">{payload[0].payload.name}</p>
            <p className="text-muted-foreground">
                {valueLabel ?? 'Count'}:{' '}
                <span className="font-semibold text-foreground">
                    {valueFormatter ? valueFormatter(raw) : raw}
                </span>
            </p>
        </div>
    );
}

export function HBar({
    data,
    color = '#3b82f6',
    domain,
    valueFormatter,
    valueLabel,
}: {
    data: ChartPoint[];
    color?: string;
    domain?: [number, number];
    valueFormatter?: (v: number) => string;
    valueLabel?: string;
}) {
    if (!data.length) {
        return (
            <p className="py-10 text-center text-xs text-muted-foreground">No data for current filters</p>
        );
    }

    // Dynamically size height so each bar gets enough room
    const barH  = 28;
    const height = Math.max(100, Math.min(data.length * barH + 28, 380));

    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 2, right: 8, left: 4, bottom: 2 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" horizontal={false} />
                <XAxis
                    type="number"
                    domain={domain}
                    tick={{ fontSize: 10, fill: '#888' }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={domain !== undefined}
                    tickFormatter={valueFormatter}
                />
                <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fontSize: 10, fill: '#888' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: string) => (v.length > 16 ? v.slice(0, 14) + '…' : v)}
                />
                <Tooltip
                    content={
                        <ChartTooltip
                            valueFormatter={valueFormatter}
                            valueLabel={valueLabel}
                        />
                    }
                    cursor={{ fill: 'rgba(128,128,128,0.08)' }}
                />
                <Bar dataKey="value" fill={color} radius={[0, 3, 3, 0]} maxBarSize={18} />
            </BarChart>
        </ResponsiveContainer>
    );
}
