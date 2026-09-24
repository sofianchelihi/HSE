import { useState } from 'react';

const RATING_LABELS = {
    1: 'Very Bad 😞',
    2: 'Bad 😕',
    3: 'Average 😐',
    4: 'Good 🙂',
    5: 'Excellent 🤩',
};

export default function StarRating({ value = 0, onChange }) {
    const [hovered, setHovered] = useState(0);
    const active = hovered || value;

    return (
        <div className="flex flex-col items-center rounded-2xl border border-amber-100/60 bg-gradient-to-br from-amber-50/50 to-white py-4">
            <div className="flex flex-row-reverse gap-1">
                {[5, 4, 3, 2, 1].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        className="text-3xl transition-transform hover:scale-110 focus:outline-none"
                    >
                        <i
                            className={`fa-star ${star <= active ? 'fas text-amber-400' : 'far text-slate-300'}`}
                        ></i>
                    </button>
                ))}
            </div>
            <p
                className={`mt-3 text-sm font-medium ${active ? 'text-amber-600' : 'text-slate-500'}`}
            >
                {active ? RATING_LABELS[active] : 'Select your rating'}
            </p>
        </div>
    );
}
