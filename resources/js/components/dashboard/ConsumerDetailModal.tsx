import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ConsumerComplaint } from '@/types/dashboard';
import { Field } from './Field';

// ─── State colour map ─────────────────────────────────────────────────────────
const STATE_CLASSES: Record<number, string> = {
    1: 'border-blue-200    bg-blue-50    text-blue-700    dark:border-blue-800    dark:bg-blue-950/40    dark:text-blue-300',
    2: 'border-amber-200   bg-amber-50   text-amber-700   dark:border-amber-800   dark:bg-amber-950/40   dark:text-amber-300',
    3: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300',
    4: 'border-violet-200  bg-violet-50  text-violet-700  dark:border-violet-800  dark:bg-violet-950/40  dark:text-violet-300',
    5: 'border-rose-200    bg-rose-50    text-rose-700    dark:border-rose-800    dark:bg-rose-950/40    dark:text-rose-300',
};

function Section({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-2">
            <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {title}
            </span>
            <div className="flex-1 border-t" />
        </div>
    );
}

export function ConsumerDetailModal({
    complaint,
    open,
    onClose,
}: {
    complaint: ConsumerComplaint | null;
    open: boolean;
    onClose: () => void;
}) {
    if (!complaint) return null;

    const stateClass = complaint.state
        ? (STATE_CLASSES[complaint.state.id] ?? 'border-border bg-muted text-muted-foreground')
        : 'border-border bg-muted text-muted-foreground';

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col overflow-hidden p-0">

                {/* Header */}
                <div className="flex items-start justify-between border-b px-6 py-4 pr-14">
                    <div className="flex flex-col gap-0.5">
                        <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                            Consumer Complaint
                        </p>
                        <h2 className="text-2xl font-bold tracking-tight">
                            #{String(complaint.id).padStart(4, '0')}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            {new Date(complaint.created_at).toLocaleDateString('en-GB', {
                                day: '2-digit', month: 'long', year: 'numeric',
                            })}
                        </p>
                    </div>
                    <span className={`mt-1 inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium ${stateClass}`}>
                        {complaint.state?.name ?? 'Unassigned'}
                    </span>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">

                    {/* Contact */}
                    <div className="space-y-2">
                        <Section title="Contact" />
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-lg border bg-muted/30 p-4 text-sm">
                            <Field label="Name"  value={complaint.consumer_name} />
                            <Field label="Phone" value={complaint.consumer_phone} />
                            <div className="col-span-2">
                                <Field label="Email" value={complaint.consumer_email} />
                            </div>
                        </div>
                    </div>

                    {/* Complaint details */}
                    <div className="space-y-2">
                        <Section title="Complaint Details" />
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-lg border bg-muted/30 p-4 text-sm">
                            <Field label="Product"          value={complaint.product?.name} />
                            <Field label="Complaint Type"   value={complaint.complaint_type?.name} />
                            <Field label="Region"           value={complaint.wilaya?.name} />
                            <Field label="Commune"          value={complaint.commune?.name} />
                            <Field label="Market Name"      value={complaint.market_name} />
                            <Field label="Batch Number"     value={complaint.batch_number} />
                            <Field label="Fabrication Date" value={complaint.fabrication_date} />
                        </div>
                    </div>

                    {/* Rating */}
                    {complaint.rating != null && (
                        <div className="space-y-2">
                            <Section title="Rating" />
                            <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-4 py-3">
                                <div className="flex">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span
                                            key={i}
                                            className={`text-xl leading-none ${i < complaint.rating! ? 'text-yellow-400' : 'text-muted-foreground/20'}`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <span className="text-sm font-semibold">{complaint.rating}</span>
                                <span className="text-sm text-muted-foreground">/ 5</span>
                            </div>
                        </div>
                    )}

                    {/* Comment */}
                    {complaint.comment && (
                        <div className="space-y-2">
                            <Section title="Comment" />
                            <p className="rounded-lg border bg-muted/30 p-4 text-sm leading-relaxed whitespace-pre-wrap">
                                {complaint.comment}
                            </p>
                        </div>
                    )}

                    {/* Audio */}
                    {complaint.audio_path && (
                        <div className="space-y-2">
                            <Section title="Audio Recording" />
                            <div className="rounded-lg border bg-muted/30 p-3">
                                <audio controls className="h-9 w-full">
                                    <source src={`/storage/${complaint.audio_path}`} />
                                </audio>
                            </div>
                        </div>
                    )}

                </div>
            </DialogContent>
        </Dialog>
    );
}
