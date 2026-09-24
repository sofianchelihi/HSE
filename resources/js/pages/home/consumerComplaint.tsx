import { useForm, Link } from '@inertiajs/react';
import { useRef } from 'react';
import SectionCard from '@/Components/Home/SectionCard';
import InputField from '@/Components/Home/InputField';
import BarcodeInput from '@/Components/Home/BarcodeInput';
import VoiceRecorder from '@/Components/Home/VoiceRecorder';
import StarRating from '@/Components/Home/StarRating';

const INPUT_CLASS =
    'w-full bg-slate-50 border-[1.5px] border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 outline-none transition';


export default function consumerComplaint(props: {
    products: Array<{ id: number; name: string; brand_id: number; barcode: string }>;
    types: Array<{ id: number; name: string }>;
    wilayas: Array<{ id: number; name: string; communes: Array<{ id: number; name: string ,wilaya_id: number }> }>;
}
,) {
    const voiceFileRef = useRef<File | null>(null);

    const { data, setData, post, processing, errors } = useForm<{
        product_id: number;
        barcode: string;
        batch_number: string;
        fabrication_date: string;
        complaint_type_id: number;
        comment: string;
        voice_note: File | null;
        wilaya_id: number;
        commune_id: number;
        market_name: string;
        consumer_name: string;
        consumer_phone: string;
        consumer_email: string;
        rating: number;
    }>({
        product_id: -1,
        barcode: '',
        batch_number: '',
        fabrication_date: '',
        complaint_type_id: -1,
        comment: '',
        voice_note: null,
        wilaya_id: -1,
        commune_id: -1,
        market_name: '',
        consumer_name: '',
        consumer_phone: '',
        consumer_email: '',
        rating: 0,
    });


    const communes = props.wilayas.find((w) => w.id === data.wilaya_id)?.communes ?? [];


    const handleBarcodeChange = (e: any) => {
        setData('barcode', e);
        let product = props.products.find((p: any) => p.barcode == e);
        if (product) {
            setData('product_id', product.id);
        }
    };



    const submit = (e: { preventDefault(): void }) => {
        e.preventDefault();
        setData('voice_note', voiceFileRef.current);
        post('/home/consumer', { forceFormData: true });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 px-4 py-8">
            <div className="mx-auto max-w-3xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mb-4 flex items-center">
                        <Link
                            href="/home"
                            className="group inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                        >
                            <i className="fas fa-arrow-left text-xs transition-transform duration-200 group-hover:-translate-x-0.5" />
                            Return
                        </Link>
                    </div>
                    <div className="mb-4 inline-flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/25">
                            <i className="fas fa-bullhorn text-white"></i>
                        </div>
                        <span className="text-2xl font-bold text-slate-800">
                            Complaint<span className="text-blue-600">Hub</span>
                        </span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-800">
                        Submit a Complaint
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Fields marked <span className="text-rose-500">*</span>{' '}
                        are required.
                    </p>
                </div>

                {/* Form Card */}
                <form
                    onSubmit={submit}
                    className="space-y-8 rounded-3xl border border-slate-200/60 bg-white p-6 shadow-[0_10px_40px_-15px_rgba(15,23,42,0.08)] md:p-10"
                >
                    {/* ===== Section 1: Product ===== */}
                    <SectionCard
                        icon="fas fa-box-open"
                        iconBg="bg-blue-50 text-blue-600"
                        title="Product Information"
                        subtitle="Identify the product concerned"
                    >
                        <div className="space-y-4">
                            <InputField
                                label="Select Product"
                                required
                                error={errors.product_id}
                            >
                                <select
                                    value={data.product_id}
                                    onChange={(e) =>
                                        setData(
                                            'product_id',
                                            parseInt(e.target.value),
                                        )
                                    }
                                    className={INPUT_CLASS}
                                >
                                    <option value={-1}>
                                        — Choose a product —
                                    </option>
                                    {props.products.map((product) => (
                                        <option
                                            key={product.id}
                                            value={product.id}
                                        >
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                            </InputField>

                            <div className="flex items-center gap-3 text-xs text-slate-400">
                                <div className="h-px flex-1 bg-slate-200"></div>
                                <span className="font-medium">OR</span>
                                <div className="h-px flex-1 bg-slate-200"></div>
                            </div>

                            <InputField
                                label="Enter the last 6 digits of the barcode"
                                required
                                error={errors.product_id}
                            >
                                <BarcodeInput
                                    value={data.barcode}
                                    onChange={handleBarcodeChange}
                                />
                            </InputField>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <InputField
                                    required
                                    label="Batch Number"
                                    error={errors.batch_number}
                                >
                                    <input
                                        type="text"
                                        value={data.batch_number}
                                        onChange={(e) =>
                                            setData(
                                                'batch_number',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="e.g. LOT-2024-A15"
                                        className={INPUT_CLASS}
                                    />
                                </InputField>
                                <InputField
                                    required
                                    label="Fabrication Date"
                                    error={errors.fabrication_date}
                                >
                                    <input
                                        type="date"
                                        value={data.fabrication_date}
                                        onChange={(e) =>
                                            setData(
                                                'fabrication_date',
                                                e.target.value,
                                            )
                                        }
                                        className={INPUT_CLASS}
                                    />
                                </InputField>
                            </div>
                        </div>
                    </SectionCard>

                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

                    {/* ===== Section 2: Complaint ===== */}
                    <SectionCard
                        icon="fas fa-exclamation-circle"
                        iconBg="bg-rose-50 text-rose-500"
                        title="Complaint Details"
                        subtitle="Tell us what went wrong"
                    >
                        <div className="space-y-4">
                            <InputField
                                label="Type of Complaint"
                                required
                                error={errors.complaint_type_id}
                            >
                                <select
                                    value={data.complaint_type_id}
                                    onChange={(e) =>
                                        setData(
                                            'complaint_type_id',
                                            parseInt(e.target.value),
                                        )
                                    }
                                    className={INPUT_CLASS}
                                >
                                    <option value={-1}>
                                        — Select the type —
                                    </option>
                                    {props.types.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </InputField>

                            <InputField
                                label="Comment"
                                required
                                error={errors.comment}
                            >
                                <textarea
                                    rows={4}
                                    value={data.comment}
                                    onChange={(e) =>
                                        setData('comment', e.target.value)
                                    }
                                    placeholder="Describe your complaint in detail..."
                                    className={INPUT_CLASS}
                                ></textarea>
                            </InputField>

                            <InputField
                                label="Voice Record (optional)"
                                required={false}
                                error={errors.voice_note}
                            >
                                <VoiceRecorder
                                    onChange={(v: File | null) => {
                                        voiceFileRef.current = v;
                                        setData('voice_note', v);
                                    }}
                                />
                            </InputField>
                        </div>
                    </SectionCard>

                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

                    {/* ===== Section 3: Location ===== */}
                    <SectionCard
                        icon="fas fa-map-marker-alt"
                        iconBg="bg-emerald-50 text-emerald-600"
                        title="Location"
                        subtitle="Where did the issue occur?"
                    >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <InputField
                                label="Wilaya"
                                required
                                error={errors.wilaya_id}
                            >
                                <select
                                    value={data.wilaya_id}
                                    onChange={(e) => {
                                        setData(
                                            'wilaya_id',
                                            parseInt(e.target.value),
                                        );
                                        setData('commune_id', -1);
                                    }}
                                    className={INPUT_CLASS}
                                >
                                    <option value={-1}>
                                        — Select Wilaya —
                                    </option>
                                    {props.wilayas.map((wilaya) => (
                                        <option
                                            key={wilaya.id}
                                            value={wilaya.id}
                                        >
                                            {wilaya.name}
                                        </option>
                                    ))}
                                </select>
                            </InputField>

                            <InputField
                                label="Commune"
                                required
                                error={errors.commune_id}
                            >
                                <select
                                    value={data.commune_id}
                                    onChange={(e) =>
                                        setData(
                                            'commune_id',
                                            parseInt(e.target.value),
                                        )
                                    }
                                    className={INPUT_CLASS}
                                >
                                    <option value={-1}>
                                        — Select Commune —
                                    </option>
                                    {communes.map((commune) => (
                                        <option
                                            key={commune.id}
                                            value={commune.id}
                                        >
                                            {commune.name}
                                        </option>
                                    ))}
                                </select>
                            </InputField>

                            <div className="sm:col-span-2">
                                <InputField
                                    label="Market Name"
                                    required
                                    error={errors.market_name}
                                >
                                    <input
                                        type="text"
                                        value={data.market_name}
                                        onChange={(e) =>
                                            setData(
                                                'market_name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="e.g. Marché Central"
                                        className={INPUT_CLASS}
                                    />
                                </InputField>
                            </div>
                        </div>
                    </SectionCard>

                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

                    {/* ===== Section 4: Contact ===== */}
                    <SectionCard
                        icon="fas fa-user-circle"
                        iconBg="bg-indigo-50 text-indigo-600"
                        title="Your Contact Details"
                        subtitle="So we can reach you back"
                    >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <InputField
                                    label="Full Name"
                                    required
                                    error={errors.consumer_name}
                                >
                                    <input
                                        type="text"
                                        value={data.consumer_name}
                                        onChange={(e) =>
                                            setData('consumer_name', e.target.value)
                                        }
                                        placeholder="e.g. Ahmed Benali"
                                        className={INPUT_CLASS}
                                    />
                                </InputField>
                            </div>

                            <InputField
                                label="Phone"
                                required
                                error={errors.consumer_phone}
                            >
                                <div className="flex">
                                    <span className="inline-flex items-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 px-3 text-sm font-semibold text-slate-500">
                                        +213
                                    </span>
                                    <input
                                        type="tel"
                                        value={data.consumer_phone}
                                        onChange={(e) =>
                                            setData('consumer_phone', e.target.value)
                                        }
                                        placeholder="5XX XX XX XX"
                                        className={`${INPUT_CLASS} rounded-l-none`}
                                    />
                                </div>
                            </InputField>

                            <InputField
                                label="Email"
                                required
                                error={errors.consumer_email}
                            >
                                <input
                                    type="email"
                                    value={data.consumer_email}
                                    onChange={(e) =>
                                        setData('consumer_email', e.target.value)
                                    }
                                    placeholder="you@example.com"
                                    className={INPUT_CLASS}
                                />
                            </InputField>
                        </div>
                    </SectionCard>

                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

                    {/* ===== Section 5: Rating ===== */}
                    <SectionCard
                        icon="fas fa-star"
                        iconBg="bg-amber-50 text-amber-500"
                        title="Rate the Product"
                        subtitle="Your overall experience"
                    >
                        <StarRating
                            value={data.rating}
                            onChange={(v: number) => setData('rating', v)}
                        />
                    </SectionCard>
                    {errors.rating && (
                        <p className="mt-1 text-xs text-rose-500">{errors.rating}</p>
                    )}

                    {/* ===== Actions ===== */}
                    <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-4 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-800"
                        >
                            <i className="fas fa-times-circle"></i> Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="cursor-pointer inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 px-10 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <i className="fas fa-paper-plane"></i>
                            {processing ? 'Submitting...' : 'Submit Complaint'}
                        </button>
                    </div>
                </form>

                <p className="mt-6 text-center text-xs text-slate-400">
                    <i className="fas fa-lock mr-1"></i> Your data is safe and
                    will only be used to process your complaint.
                </p>
            </div>
        </div>
    );
}
