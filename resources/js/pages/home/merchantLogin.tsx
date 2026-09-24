import { Link, useForm } from '@inertiajs/react';
import PasswordInput from '@/components/home/PasswordInput';

const INPUT_CLASS =
    'w-full bg-slate-50 border-[1.5px] border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 outline-none transition';

export default function MerchantLogin() {
    const form = useForm({
        phone: '',
        password: '',
        remember: false,
    });

    const submit = (e: any) => {
        e.preventDefault();

        form.post('/home/merchant/login', {
            onFinish: () => form.reset('password'),
        });
    };

    return (
        <div className="flex h-full w-screen items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 px-4">
            <div className="w-[35%]">
                {/* Header */}
                <div className="items-center text-center">
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
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/25">
                            <i className="fas fa-store text-white"></i>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-slate-800">
                            Complaint<span className="text-blue-600">Hub</span>
                        </span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-800">
                        Merchant Login
                    </h1>
                    <p className="my-4 text-sm text-slate-500">
                        Sign in to manage your complaints
                    </p>
                </div>

                {/* Card */}
                <div className="rounded-3xl border border-slate-200/60 bg-white p-8 shadow-[0_10px_40px_-15px_rgba(15,23,42,0.08)]">
                    <form onSubmit={submit} className="space-y-5">
                        {/* Phone */}
                        <div>
                            <label className="mb-2 block text-xs font-semibold text-slate-600">
                                Phone Number{' '}
                                <span className="text-rose-500">*</span>
                            </label>
                            <div className="flex">
                                <span className="inline-flex items-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 px-3 text-sm font-semibold text-slate-500">
                                    +213
                                </span>
                                <input
                                    type="text"
                                    name="phone"
                                    value={form.data.phone}
                                    onChange={(e) =>
                                        form.setData('phone', e.target.value)
                                    }
                                    placeholder="5XX XX XX XX"
                                    autoComplete="tel"
                                    autoFocus
                                    className={`${INPUT_CLASS} rounded-l-none`}
                                />
                            </div>
                            {form.errors.phone && (
                                <p className="mt-1 text-xs text-rose-500">
                                    {form.errors.phone}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="text-xs font-semibold text-slate-600">
                                    Password{' '}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <span
                                    // href={route('merchant.password.request')}
                                    className="cursor-pointer text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                >
                                    Forgot?
                                </span>
                            </div>
                            <PasswordInput
                                value={form.data.password}
                                onChange={(e: any) =>
                                    form.setData('password', e.target.value)
                                }
                                error={form.errors.password}
                            />
                        </div>

                        {/* Remember me */}
                        <label className="flex cursor-pointer items-center gap-2 select-none">
                            <input
                                type="checkbox"
                                checked={form.data.remember}
                                onChange={(e) =>
                                    form.setData('remember', e.target.checked)
                                }
                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-slate-600">
                                Remember me
                            </span>
                        </label>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="my-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {form.processing ? (
                                <>
                                    <i className="fas fa-circle-notch fa-spin"></i>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-sign-in-alt"></i>
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-4 flex items-center gap-3">
                        <div className="h-px flex-1 bg-slate-200"></div>
                        <span className="text-xs font-medium text-slate-400">
                            NEW HERE?
                        </span>
                        <div className="h-px flex-1 bg-slate-200"></div>
                    </div>

                    {/* Register link */}
                    <Link
                        href="/home/merchant/register"
                        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl border-[1.5px] border-slate-200 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-white"
                    >
                        <i className="fas fa-user-plus text-slate-500"></i>
                        Create a merchant account
                    </Link>
                </div>

                {/* Footer links */}
                <div className="mt-6 space-y-2 text-center">
                    <p className="text-xs text-slate-400">
                        <i className="fas fa-lock mr-1"></i>
                        Secured with end-to-end encryption
                    </p>
                </div>
            </div>
        </div>
    );
}
