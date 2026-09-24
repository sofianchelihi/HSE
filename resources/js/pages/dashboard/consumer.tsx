import { router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { BarChart2, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import StateSelector from '@/components/dashboard/StateSelector';
import DashboardFilters from '@/components/dashboard/DashboardFilters';
import { ConsumerChartsView } from '@/components/dashboard/ConsumerChartsView';
import { ConsumerComplaint, Props } from '@/types/dashboard';
import { ConsumerDetailModal } from '@/components/dashboard/ConsumerDetailModal';
import { dashboard } from '@/routes';
import { consumer } from '@/routes/dashboard';

// ─── Rating stars ─────────────────────────────────────────────────────────────
function Stars({ value }: { value: number | null }) {
    if (value == null) return <span className="text-muted-foreground">—</span>;
    return (
        <span className="inline-flex items-center gap-0.5 font-medium">
            {value}
            <span className="text-yellow-400">★</span>
        </span>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ConsumerDashboard({ complaints, states, filters, filterOptions, charts }: Props) {
    const [selected, setSelected] = useState<ConsumerComplaint | null>(null);
    const [view, setView]         = useState<'report' | 'charts'>('report');
    const [seenIds, setSeenIds]   = useState<Set<number>>(new Set());

    function handleRowClick(c: ConsumerComplaint) {
        if (!c.seen && !seenIds.has(c.id)) {
            setSeenIds(prev => new Set(prev).add(c.id));
            router.patch(`/dashboard/consumer/${c.id}/seen`, {}, {
                preserveState: true,
                preserveScroll: true,
            });
        }
        setSelected(c);
    }

    return (
        <div className="flex flex-col gap-0">

            {/* ── Filters ──────────────────────────────────────────────── */}
            <div className="border-b px-4 py-3">
                <DashboardFilters
                    filters={filters}
                    filterOptions={filterOptions}
                    routeUrl={consumer().url}
                />
            </div>

            {/* ── Toolbar ──────────────────────────────────────────────── */}
            <div className="flex items-center justify-between border-b px-4 py-3">
                <div>
                    <h2 className="text-lg font-semibold leading-tight">Consumer Complaints</h2>
                    <p className="text-sm text-muted-foreground">{complaints.total} total records</p>
                </div>

                <ToggleGroup
                    type="single"
                    variant="outline"
                    value={view}
                    onValueChange={v => v && setView(v as 'report' | 'charts')}
                >
                    <ToggleGroupItem value="report" className="gap-1.5 px-3 text-sm">
                        <FileText className="size-3.5" />
                        Report
                    </ToggleGroupItem>
                    <ToggleGroupItem value="charts" className="gap-1.5 px-3 text-sm">
                        <BarChart2 className="size-3.5" />
                        Charts
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>

            {/* ── Report view ──────────────────────────────────────────── */}
            {view === 'report' && (
                <div className="flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/60">
                                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">#</th>
                                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Consumer</th>
                                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Product</th>
                                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Type</th>
                                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Region</th>
                                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rating</th>
                                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">State</th>
                                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Date</th>
                                    <th className="px-4 py-2.5" />
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {complaints.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="px-4 py-16 text-center text-sm text-muted-foreground">
                                            No complaints found.
                                        </td>
                                    </tr>
                                ) : (
                                    complaints.data.map((c) => (
                                        <tr
                                            key={c.id}
                                            className="cursor-pointer transition-colors hover:bg-muted/40 even:bg-muted/10"
                                            onClick={() => handleRowClick(c)}
                                        >
                                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                                <span className="inline-flex items-center gap-1.5">
                                                    {!c.seen && !seenIds.has(c.id) && (
                                                        <span className="size-1.5 shrink-0 rounded-full bg-blue-500" />
                                                    )}
                                                    {c.id}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                {c.consumer_name ?? <span className="text-muted-foreground">—</span>}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {c.product?.name ?? '—'}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {c.complaint_type?.name ?? '—'}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {c.wilaya?.name ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Stars value={c.rating} />
                                            </td>
                                            <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                                                <StateSelector
                                                    complaintId={c.id}
                                                    currentStateId={c.state_id}
                                                    states={states}
                                                />
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                                                {new Date(c.created_at).toLocaleDateString('en-GB', {
                                                    day: '2-digit', month: 'short', year: 'numeric',
                                                })}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 px-2 text-xs"
                                                    onClick={e => { e.stopPropagation(); handleRowClick(c); }}
                                                >
                                                    View
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {complaints.last_page > 1 && (
                        <div className="flex items-center justify-between border-t px-4 py-3">
                            <p className="text-xs text-muted-foreground">
                                Page {complaints.current_page} of {complaints.last_page}
                            </p>
                            <div className="flex gap-1">
                                {complaints.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url ?? '#'}
                                        preserveScroll
                                        className={[
                                            'inline-flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-xs transition-colors',
                                            link.active
                                                ? 'bg-primary text-primary-foreground'
                                                : 'hover:bg-muted text-muted-foreground',
                                            !link.url ? 'pointer-events-none opacity-40' : '',
                                        ].join(' ')}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── Charts view ──────────────────────────────────────────── */}
            {view === 'charts' && (
                <ConsumerChartsView charts={charts} />
            )}

            <ConsumerDetailModal
                complaint={selected}
                open={selected !== null}
                onClose={() => setSelected(null)}
            />
        </div>
    );
}

ConsumerDashboard.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Consumer',  href: consumer()   },
    ],
};
