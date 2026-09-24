import { dashboard } from '@/routes';
import { consumer } from '@/routes/dashboard';
import { merchant } from '@/routes/dashboard';
import DashboardFilters from '@/components/dashboard/DashboardFilters';
import type { DashboardProps, StateStat } from '@/types/dashboard';

// ─── State colour palette (indexed by position, not id) ───────────────────────
const STATE_COLORS = [
    { bar: 'bg-blue-500',   badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'   },
    { bar: 'bg-amber-500',  badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
    { bar: 'bg-emerald-500',badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
    { bar: 'bg-violet-500', badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300' },
    { bar: 'bg-rose-500',   badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'   },
];
const UNASSIGNED_COLOR = { bar: 'bg-zinc-400', badge: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' };

function colorForState(stat: StateStat, index: number) {
    if (stat.id === null) return UNASSIGNED_COLOR;
    return STATE_COLORS[index % STATE_COLORS.length];
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, href }: { label: string; value: number; sub?: string; href?: string }) {
    const inner = (
        <div className="flex flex-col gap-1 rounded-xl border bg-card px-6 py-5 shadow-sm transition-colors hover:bg-muted/40">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <span className="text-3xl font-bold tabular-nums">{value.toLocaleString()}</span>
            {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
        </div>
    );
    if (href) return <a href={href.toString()} className="block">{inner}</a>;
    return inner;
}

// ─── Horizontal bar ──────────────────────────────────────────────────────────
function Bar({ value, max, colorClass }: { value: number; max: number; colorClass: string }) {
    const pct = max === 0 ? 0 : Math.round((value / max) * 100);
    return (
        <div className="flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                    className={`h-full rounded-full transition-all ${colorClass}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="w-8 text-right text-xs tabular-nums text-muted-foreground">{value}</span>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage({ stats, stateStats, wilayaStats, filters, filterOptions }: DashboardProps) {
    const maxStateTotal = Math.max(...stateStats.map(s => s.total), 1);
    const maxWilaya     = Math.max(...wilayaStats.map(w => w.count), 1);

    return (
        <div className="flex flex-col gap-6 p-6">

            {/* Filters */}
            <DashboardFilters
                filters={filters}
                filterOptions={filterOptions}
                routeUrl={dashboard().url}
            />

            {/* Summary cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Total Complaints" value={stats.total} />
                <StatCard
                    label="Consumer Complaints"
                    value={stats.consumer}
                    sub={stats.total ? `${Math.round((stats.consumer / stats.total) * 100)}% of total` : undefined}
                    href={consumer().url}
                />
                <StatCard
                    label="Merchant Complaints"
                    value={stats.merchant}
                    sub={stats.total ? `${Math.round((stats.merchant / stats.total) * 100)}% of total` : undefined}
                    href={merchant().url}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* State breakdown */}
                <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm">
                    <div>
                        <h2 className="font-semibold">By Complaint State</h2>
                        <p className="text-sm text-muted-foreground">Distribution across all processing states</p>
                    </div>

                    {stateStats.length === 0 ? (
                        <p className="py-6 text-center text-sm text-muted-foreground">No data</p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {stateStats.map((s, i) => {
                                const color = colorForState(s, i);
                                return (
                                    <div key={s.id ?? 'null'} className="flex flex-col gap-1.5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${color.badge}`}>
                                                    {s.name}
                                                </span>
                                            </div>
                                            <span className="text-sm font-semibold tabular-nums">{s.total}</span>
                                        </div>
                                        <Bar value={s.total} max={maxStateTotal} colorClass={color.bar} />
                                        <div className="flex gap-4 text-xs text-muted-foreground">
                                            <span>Consumer: <strong className="text-foreground">{s.consumer}</strong></span>
                                            <span>Merchant: <strong className="text-foreground">{s.merchant}</strong></span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Wilaya breakdown */}
                <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm">
                    <div>
                        <h2 className="font-semibold">Top Regions</h2>
                        <p className="text-sm text-muted-foreground">Consumer complaints by wilaya (top 10)</p>
                    </div>

                    {wilayaStats.length === 0 ? (
                        <p className="py-6 text-center text-sm text-muted-foreground">No data</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {wilayaStats.map((w, i) => (
                                <div key={w.id} className="flex flex-col gap-1">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-5 text-right text-xs tabular-nums text-muted-foreground">
                                                {i + 1}.
                                            </span>
                                            <span className="font-medium">{w.name}</span>
                                        </div>
                                        <span className="tabular-nums font-semibold">{w.count}</span>
                                    </div>
                                    <Bar value={w.count} max={maxWilaya} colorClass="bg-primary/70" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

DashboardPage.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
    ],
};
