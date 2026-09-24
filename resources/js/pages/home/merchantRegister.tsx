import { useState } from 'react';
import { Form, Link } from '@inertiajs/react';
import PasswordInput from '@/components/home/PasswordInput';
import { Clock10 } from 'lucide-react';

const INPUT_CLASS =
    'w-full bg-slate-50 border-[1.5px] border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 outline-none transition';

export default function MerchantRegister(props: any) {
    const { merchantTypes, wilayas } = props;

    const [wilaya, setWilaya] = useState('');
    const [commune, setCommune] = useState('');
    const [communes, setCommunes] = useState([]);

    const handleWilayaChange = (e: any) => {
        setWilaya(e.target.value);
        setCommune('');
        let communes = wilayas.find(
            (w: any) => w.id == e.target.value,
        ).communes;
        setCommunes(communes);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 px-4 py-10">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mb-4 inline-flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/25">
                            <i className="fas fa-store text-white"></i>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-slate-800">
                            Complaint<span className="text-blue-600">Hub</span>
                        </span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-800">
                        Create a Merchant Account
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Join us to manage and respond to complaints
                    </p>
                </div>

                {/* Card */}
                <div className="rounded-3xl border border-slate-200/60 bg-white p-8 shadow-[0_10px_40px_-15px_rgba(15,23,42,0.08)] md:p-10">
                    <Form
                        action="/home/merchant/register"
                        method="post"
                        resetOnSuccess={['password', 'password_confirmation']}
                    >
                        {({ processing, errors }) => (
                            <div className="space-y-5">
                                {/* Full Name + Email */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-xs font-semibold text-slate-600">
                                            Full Name{' '}
                                            <span className="text-rose-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="e.g. Ahmed Benali"
                                            autoComplete="name"
                                            className={INPUT_CLASS}
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-xs text-rose-500">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-semibold text-slate-600">
                                            Email{' '}
                                            <span className="text-rose-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="you@example.com"
                                            autoComplete="email"
                                            className={INPUT_CLASS}
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-xs text-rose-500">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Phone + Market Name */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-xs font-semibold text-slate-600">
                                            Phone Number{' '}
                                            <span className="text-rose-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="flex">
                                            <span className="inline-flex items-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 px-3 text-sm font-semibold text-slate-500">
                                                +213
                                            </span>
                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder="5XX XX XX XX"
                                                autoComplete="tel"
                                                className={`${INPUT_CLASS} rounded-l-none`}
                                            />
                                        </div>
                                        {errors.phone && (
                                            <p className="mt-1 text-xs text-rose-500">
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-semibold text-slate-600">
                                            Market Name{' '}
                                            <span className="text-rose-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            name="market_name"
                                            placeholder="e.g. Superette El Baraka"
                                            className={INPUT_CLASS}
                                        />
                                        {errors.market_name && (
                                            <p className="mt-1 text-xs text-rose-500">
                                                {errors.market_name}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Merchant Type */}
                                <div>
                                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                                        Merchant Type{' '}
                                        <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        name="merchant_type_id"
                                        className={INPUT_CLASS}
                                        defaultValue=""
                                    >
                                        <option value="">
                                            — Select your business type —
                                        </option>
                                        {merchantTypes.map(
                                            (type: {
                                                id: number;
                                                name: string;
                                            }) => (
                                                <option
                                                    key={type.id}
                                                    value={type.id}
                                                >
                                                    {type.name}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                    {errors.merchant_type_id && (
                                        <p className="mt-1 text-xs text-rose-500">
                                            {errors.merchant_type_id}
                                        </p>
                                    )}
                                </div>

                                {/* Wilaya + Commune */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-xs font-semibold text-slate-600">
                                            Wilaya{' '}
                                            <span className="text-rose-500">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            name="wilaya_id"
                                            className={INPUT_CLASS}
                                            value={wilaya}
                                            onChange={(e) =>
                                                handleWilayaChange(e)
                                            }
                                        >
                                            <option value="">
                                                — Select Wilaya —
                                            </option>
                                            {wilayas.map(
                                                (w: {
                                                    id: number;
                                                    name: string;
                                                }) => (
                                                    <option
                                                        key={w.id}
                                                        value={w.id}
                                                    >
                                                        {w.name}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                        {errors.wilaya_id && (
                                            <p className="mt-1 text-xs text-rose-500">
                                                {errors.wilaya_id}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-semibold text-slate-600">
                                            Commune{' '}
                                            <span className="text-rose-500">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            name="commune_id"
                                            className={INPUT_CLASS}
                                            disabled={!wilaya}
                                            defaultValue=""
                                            value={commune}
                                            onChange={(e) =>
                                                setCommune(e.target.value)
                                            }
                                        >
                                            <option value="">
                                                {wilaya
                                                    ? '— Select Commune —'
                                                    : 'Select wilaya first'}
                                            </option>
                                            {communes.map(
                                                (c: {
                                                    id: number;
                                                    name: string;
                                                }) => (
                                                    <option
                                                        key={c.id}
                                                        value={c.id}
                                                    >
                                                        {c.name}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                        {errors.commune_id && (
                                            <p className="mt-1 text-xs text-rose-500">
                                                {errors.commune_id}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Password + Confirm */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-xs font-semibold text-slate-600">
                                            Password{' '}
                                            <span className="text-rose-500">
                                                *
                                            </span>
                                        </label>
                                        <PasswordInput
                                            name="password"
                                            error={errors.password}
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-semibold text-slate-600">
                                            Confirm Password{' '}
                                            <span className="text-rose-500">
                                                *
                                            </span>
                                        </label>
                                        <PasswordInput
                                            name="password_confirmation"
                                            error={errors.password_confirmation}
                                        />
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing ? (
                                        <>
                                            <i className="fas fa-circle-notch fa-spin"></i>
                                            Creating account...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-user-plus"></i>
                                            Create Account
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </Form>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-slate-200"></div>
                        <span className="text-xs font-medium text-slate-400">
                            ALREADY HAVE AN ACCOUNT?
                        </span>
                        <div className="h-px flex-1 bg-slate-200"></div>
                    </div>

                    <Link
                        href="/home/merchant/login"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-[1.5px] border-slate-200 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-white"
                    >
                        <i className="fas fa-sign-in-alt text-slate-500"></i>
                        Sign in instead
                    </Link>
                </div>

                <p className="mt-6 text-center text-xs text-slate-400">
                    <i className="fas fa-lock mr-1"></i>
                    Your information is secure and encrypted.
                </p>
            </div>
        </div>
    );
}
