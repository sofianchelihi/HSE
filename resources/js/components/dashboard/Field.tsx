export function Field({
    label,
    value,
}: {
    label: string;
    value: string | number | null | undefined;
}) {
    return (
        <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {label}
            </p>
            <p className="mt-0.5">
                {value ?? (
                    <span className="text-muted-foreground italic">—</span>
                )}
            </p>
        </div>
    );
}
