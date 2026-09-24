import { useState } from 'react';
import { router } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { State } from '@/types/dashboard';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';

// ─── Config ───────────────────────────────────────────────────────────────────
/** Transitioning TO these states shows a confirmation dialog. */
const CONFIRM_STATES = new Set([3, 4]);

/** Complaints already in these states cannot be changed further. */
const LOCKED_STATES = new Set([3, 4]);

const STATE_CLASSES: Record<number, string> = {
    1: 'border-blue-200    bg-blue-50    text-blue-700    dark:border-blue-800    dark:bg-blue-950/40    dark:text-blue-300',
    2: 'border-amber-200   bg-amber-50   text-amber-700   dark:border-amber-800   dark:bg-amber-950/40   dark:text-amber-300',
    3: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300',
    4: 'border-violet-200  bg-violet-50  text-violet-700  dark:border-violet-800  dark:bg-violet-950/40  dark:text-violet-300',
    5: 'border-rose-200    bg-rose-50    text-rose-700    dark:border-rose-800    dark:bg-rose-950/40    dark:text-rose-300',
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function StateSelector({
    complaintId,
    currentStateId,
    states,
    basePath = '/dashboard/consumer',
}: {
    complaintId: number;
    currentStateId: number | null;
    states: State[];
    basePath?: string;
}) {
    const [value, setValue]     = useState(currentStateId ? String(currentStateId) : '');
    const [pending, setPending] = useState<string | null>(null);

    const numValue   = value ? Number(value) : null;
    const isLocked   = numValue != null && LOCKED_STATES.has(numValue);
    const colorClass = numValue != null ? (STATE_CLASSES[numValue] ?? '') : '';
    const pendingState = pending ? states.find(s => String(s.id) === pending) : null;

    function handleChange(next: string) {
        if (CONFIRM_STATES.has(Number(next))) {
            setPending(next);          // hold — show dialog first
        } else {
            commit(next);
        }
    }

    function commit(next: string) {
        setValue(next);
        router.patch(
            `${basePath}/${complaintId}/state`,
            { state_id: next },
            { preserveScroll: true },
        );
        setPending(null);
    }

    return (
        <>
            <Select
                value={value || undefined}
                onValueChange={handleChange}
                disabled={isLocked}
            >
                <SelectTrigger
                    size="sm"
                    className={cn('w-32', colorClass)}
                    onClick={(e) => e.stopPropagation()}
                >
                    <SelectValue placeholder="— none —" />
                </SelectTrigger>
                <SelectContent onClick={(e) => e.stopPropagation()}>
                    {states.map((s) => (
                        <SelectItem key={s.id} value={String(s.id)}>
                            {s.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Confirmation dialog for terminal states */}
            <Dialog
                open={pending !== null}
                onOpenChange={(open) => !open && setPending(null)}
            >
                <DialogContent onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                        <DialogTitle>Confirm state change</DialogTitle>
                        <DialogDescription>
                            You are about to mark this complaint as{' '}
                            <strong className="text-foreground">{pendingState?.name}</strong>.
                            This is a terminal state — it cannot be changed again once confirmed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setPending(null)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={() => commit(pending!)}>
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
