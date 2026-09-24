import { useRef, useState } from 'react';

const MAX_PHOTOS = 3;

export default function PhotoUpload({ onChange }) {
    const [previews, setPreviews] = useState([]); // [{ url, file }]
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    const addFiles = (incoming) => {
        setError('');
        const valid = Array.from(incoming).filter((f) =>
            f.type.startsWith('image/'),
        );

        if (valid.length === 0) {
            setError('Only image files are accepted.');
            return;
        }

        setPreviews((prev) => {
            const remaining = MAX_PHOTOS - prev.length;
            if (remaining <= 0) {
                setError(`You can upload a maximum of ${MAX_PHOTOS} photos.`);
                return prev;
            }

            const toAdd = valid.slice(0, remaining);
            if (valid.length > remaining) {
                setError(
                    `Only ${remaining} more photo${remaining > 1 ? 's' : ''} can be added (max ${MAX_PHOTOS}).`,
                );
            }

            const newEntries = toAdd.map((file) => ({
                url: URL.createObjectURL(file),
                file,
            }));
            const next = [...prev, ...newEntries];
            onChange?.(next.map((e) => e.file));
            return next;
        });
    };

    const remove = (index) => {
        setPreviews((prev) => {
            URL.revokeObjectURL(prev[index].url);
            const next = prev.filter((_, i) => i !== index);
            onChange?.(next.map((e) => e.file));
            setError('');
            return next;
        });
    };

    const handleInputChange = (e) => {
        addFiles(e.target.files);
        // reset so the same file can be re-selected if removed
        e.target.value = '';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        addFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className="space-y-3">
            {/* Drop zone / trigger */}
            {previews.length < MAX_PHOTOS && (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center transition hover:border-blue-300 hover:bg-blue-50"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                        <i className="fas fa-camera text-xl" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                        Click or drag photos here
                    </p>
                    <p className="text-xs text-slate-400">
                        {previews.length === 0
                            ? `Up to ${MAX_PHOTOS} photos`
                            : `${MAX_PHOTOS - previews.length} more photo${MAX_PHOTOS - previews.length > 1 ? 's' : ''} allowed`}
                    </p>
                </button>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleInputChange}
            />

            {/* Preview grid */}
            {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                    {previews.map((entry, i) => (
                        <div key={i} className="group relative">
                            <img
                                src={entry.url}
                                alt={`Photo ${i + 1}`}
                                className="aspect-square w-full rounded-2xl border border-slate-200 object-cover shadow-sm"
                            />
                            <button
                                type="button"
                                onClick={() => remove(i)}
                                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-rose-400 shadow-sm opacity-0 transition hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                                title="Remove photo"
                            >
                                <i className="fas fa-times text-xs" />
                            </button>
                        </div>
                    ))}

                    {/* "Add more" tile if slots remain */}
                    {previews.length < MAX_PHOTOS && (
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="flex aspect-square cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-blue-300 hover:bg-blue-50"
                        >
                            <i className="fas fa-plus text-slate-400" />
                        </button>
                    )}
                </div>
            )}

            {error && (
                <p className="flex items-center gap-1.5 text-xs text-rose-500">
                    <i className="fas fa-exclamation-circle" />
                    {error}
                </p>
            )}
        </div>
    );
}
