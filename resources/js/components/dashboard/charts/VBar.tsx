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

function fmtMonth(ym: string) {
    const [y, m] = ym.split('-');
    return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-GB', {
        month: 'short',
        year: '2-digit',
    });
}

function ChartTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border bg-background px-3 py-2 shadow-lg text-xs">
            <p className="mb-1 font-medium">{fmtMonth(label)}</p>
            <p className="text-muted-foreground">
                Complaints: <span className="font-semibold text-foreground">{payload[0].value}</span>
            </p>
        </div>
    );
}

export function VBar({ data, color = '#3b82f6' }: { data: ChartPoint[]; color?: string }) {
    if (!data.length) {
        return (
            <p className="py-10 text-center text-xs text-muted-foreground">No data for current filters</p>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" vertical={false} />
                <XAxis
                    dataKey="name"
                    tickFormatter={fmtMonth}
                    tick={{ fontSize: 10, fill: '#888' }}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 10, fill: '#888' }}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(128,128,128,0.08)' }} />
                <Bar dataKey="value" fill={color} radius={[3, 3, 0, 0]} maxBarSize={36} />
            </BarChart>
        </ResponsiveContainer>
    );
}
