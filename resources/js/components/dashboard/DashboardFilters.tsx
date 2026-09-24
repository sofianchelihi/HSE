import { router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { DashboardFilters, DashboardFilterOptions } from '@/types/dashboard';

const NONE = '__none__';

interface Props {
    filters: DashboardFilters;
    filterOptions: DashboardFilterOptions;
    routeUrl: string;
}

export default function DashboardFilters({ filters, filterOptions, routeUrl }: Props) {
    const [local, setLocal] = useState<DashboardFilters>({ ...filters });

    const apply = useCallback(() => {
        const params: Record<string, string> = {};
        if (local.date_from)  params.date_from  = local.date_from;
        if (local.date_to)    params.date_to    = local.date_to;
        if (local.state_id)   params.state_id   = local.state_id;
        if (local.wilaya_id)  params.wilaya_id  = local.wilaya_id;

        router.get(routeUrl, params, { preserveScroll: true, replace: true });
    }, [local, routeUrl]);

    const reset = useCallback(() => {
        setLocal({});
        router.get(routeUrl, {}, { preserveScroll: true, replace: true });
    }, [routeUrl]);

    const hasActiveFilters =
        !!filters.date_from || !!filters.date_to ||
        !!filters.state_id  || !!filters.wilaya_id;

    return (
        <div className="flex flex-wrap items-end gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm">
            {/* Date from */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">From</label>
                <Input
                    type="date"
                    className="h-8 w-36 text-sm"
                    value={local.date_from ?? ''}
                    onChange={e => setLocal(p => ({ ...p, date_from: e.target.value || undefined }))}
                />
            </div>

            {/* Date to */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">To</label>
                <Input
                    type="date"
                    className="h-8 w-36 text-sm"
                    value={local.date_to ?? ''}
                    onChange={e => setLocal(p => ({ ...p, date_to: e.target.value || undefined }))}
                />
            </div>

            {/* State */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">State</label>
                <Select
                    value={local.state_id ?? NONE}
                    onValueChange={v =>
                        setLocal(p => ({ ...p, state_id: v === NONE ? undefined : v }))
                    }
                >
                    <SelectTrigger size="sm" className="h-8 w-36 text-sm">
                        <SelectValue placeholder="All states" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={NONE}>All states</SelectItem>
                        {filterOptions.states.map(s => (
                            <SelectItem key={s.id} value={String(s.id)}>
                                {s.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Wilaya */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Region</label>
                <Select
                    value={local.wilaya_id ?? NONE}
                    onValueChange={v =>
                        setLocal(p => ({ ...p, wilaya_id: v === NONE ? undefined : v }))
                    }
                >
                    <SelectTrigger size="sm" className="h-8 w-40 text-sm">
                        <SelectValue placeholder="All regions" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={NONE}>All regions</SelectItem>
                        {filterOptions.wilayas.map(w => (
                            <SelectItem key={w.id} value={String(w.id)}>
                                {w.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pb-0.5">
                <Button size="sm" className="h-8" onClick={apply}>
                    Apply
                </Button>
                {hasActiveFilters && (
                    <Button size="sm" variant="ghost" className="h-8 text-muted-foreground" onClick={reset}>
                        Clear
                    </Button>
                )}
            </div>
        </div>
    );
}
