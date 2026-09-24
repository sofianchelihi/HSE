import { useState } from 'react';
import { useForm , Link ,router} from '@inertiajs/react';
import GCUModal from '@/Components/GCUModal';
import {UserType} from "@/types/home";

export default function Home({ gcuContent }: { gcuContent: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<UserType | null>(null);
    const { post, processing } = useForm();

    const gcuAccepted = localStorage.getItem('gcu_accepted') === 'true';
    const [gcuAcceptedState, setGcuAcceptedState] = useState(gcuAccepted);

    const handleTypeSelect = (type: UserType) => {
        setSelectedType(type);
        if (gcuAcceptedState) {
            submitType(type);
        } else {
            setIsModalOpen(true);
        }
    };

    const submitType = (type: UserType) => {
        if (type === 'consumer') {
            router.get('/home/consumer');
        } else if (type === 'merchant') {
            router.get('/home/merchant');
        }
    };

    const handleAccept = () => {
        localStorage.setItem('gcu_accepted', 'true');
        setGcuAcceptedState(true);
        setIsModalOpen(false);
        if (selectedType) {
            submitType(selectedType);
        }
    };

    const handleDecline = () => {
        localStorage.setItem('gcu_accepted', 'false');
        setGcuAcceptedState(false);
        setIsModalOpen(false);
        setSelectedType(null);
    };

    return (
        <>
            <div className="w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200/50 bg-white shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Left: Text + Buttons */}
                    <div className="flex flex-col justify-center p-8 md:p-12">
                        <div className="mb-6 text-left">
                            <h1 className="text-4xl leading-tight font-bold text-slate-800 md:text-5xl">
                                Submit your <br />
                                <span className="text-blue-600">
                                    complaint
                                </span>{' '}
                                easily
                            </h1>
                            <p className="mt-3 text-lg text-slate-500">
                                Choose your role and get started in seconds.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <button
                                onClick={() => handleTypeSelect('consumer')}
                                disabled={processing}
                                className="btn-card group cursor-pointer rounded-2xl border-2 border-blue-200 bg-white p-4 text-left transition-all duration-200 hover:-translate-y-1.5 hover:border-blue-500 hover:shadow-xl focus:ring-4 focus:ring-blue-200 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 transition group-hover:bg-blue-100">
                                        <i className="fas fa-user text-2xl text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-800">
                                            Consumer
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            Submit complaints
                                        </p>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => handleTypeSelect('merchant')}
                                disabled={processing}
                                className="btn-card group cursor-pointer rounded-2xl border-2 border-indigo-200 bg-white p-4 text-left transition-all duration-200 hover:-translate-y-1.5 hover:border-indigo-500 hover:shadow-xl focus:ring-4 focus:ring-indigo-200 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 transition group-hover:bg-indigo-100">
                                        <i className="fas fa-store text-2xl text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-800">
                                            Merchant
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            Manage & respond
                                        </p>
                                    </div>
                                </div>
                            </button>
                        </div>

                        <p className="mt-6 text-xs text-slate-400">
                            By continuing you agree to our{' '}
                            <a
                                href="#"
                                className="text-blue-600 hover:underline"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsModalOpen(true);
                                }}
                            >
                                General Conditions of Use
                            </a>
                            .
                        </p>
                    </div>

                    {/* Right: Hero Image (desktop) */}
                    <div
                        className="hidden md:block"
                        style={{
                            background:
                                "url('/images/hero.jpg') center/cover no-repeat",
                            minHeight: '400px',
                            borderRadius: '0 2rem 2rem 0',
                        }}
                    />
                </div>

                {/* Mobile Hero Image (below text) */}
                <div
                    className="md:hidden"
                    style={{
                        background:
                            "url('/images/hero.jpg') center/cover no-repeat",
                        minHeight: '200px',
                        borderRadius: '0 0 2rem 2rem',
                    }}
                />
            </div>

            <GCUModal
                isOpen={isModalOpen}
                content={gcuContent}
                onAccept={handleAccept}
                onDecline={handleDecline}
            />
        </>
    );
}
