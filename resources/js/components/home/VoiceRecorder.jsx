import { useEffect, useRef, useState } from 'react';

const isMediaRecorderSupported =
    typeof window !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof window.MediaRecorder !== 'undefined';

function pickMimeType() {
    const candidates = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4', // Safari/iOS
        'audio/ogg',
    ];
    return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? '';
}

export default function VoiceRecorder({ onChange }) {
    const [status, setStatus] = useState(
        isMediaRecorderSupported ? 'idle' : 'unsupported',
    ); // idle | recording | done | error | unsupported
    const [seconds, setSeconds] = useState(0);
    const [audioUrl, setAudioUrl] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const streamRef = useRef(null);
    const timerRef = useRef(null);
    const audioUrlRef = useRef(null); // avoid stale closure on unmount

    useEffect(() => {
        return () => {
            stopTimer();
            releaseStream();
            if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
        };
    }, []);

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const releaseStream = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
    };

    const startRecording = async () => {
        if (!isMediaRecorderSupported) {
            setErrorMsg('Voice recording is not supported in this browser.');
            setStatus('unsupported');
            return;
        }

        setErrorMsg('');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            streamRef.current = stream;

            const mimeType = pickMimeType();
            const recorder = mimeType
                ? new MediaRecorder(stream, { mimeType })
                : new MediaRecorder(stream); // let browser pick a default

            mediaRecorderRef.current = recorder;
            chunksRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            recorder.onstop = () => {
                const usedType = recorder.mimeType || mimeType || 'audio/webm';
                const blob = new Blob(chunksRef.current, { type: usedType });

                let ext = 'webm';
                if (usedType.includes('mp4')) ext = 'm4a';
                else if (usedType.includes('ogg')) ext = 'ogg';
                else if (usedType.includes('webm')) ext = 'webm';

                const file = new File([blob], `voice_note.${ext}`, {
                    type: usedType,
                });

                const url = URL.createObjectURL(blob);
                audioUrlRef.current = url;
                setAudioUrl(url);
                setStatus('done');
                onChange?.(file);

                releaseStream();
            };

            recorder.onerror = () => {
                setErrorMsg('Recording failed unexpectedly. Please try again.');
                setStatus('error');
                releaseStream();
            };

            recorder.start();
            setSeconds(0);
            setStatus('recording');

            timerRef.current = setInterval(
                () => setSeconds((s) => s + 1),
                1000,
            );
        } catch (err) {
            const msg =
                err.name === 'NotAllowedError'
                    ? 'Microphone access denied. Please allow microphone permissions.'
                    : err.name === 'NotFoundError'
                      ? 'No microphone was found on this device.'
                      : 'Unable to access the microphone.';
            setErrorMsg(msg);
            setStatus('error');
        }
    };

    const stopRecording = () => {
        stopTimer();
        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state !== 'inactive'
        ) {
            mediaRecorderRef.current.stop();
        }
    };

    const reset = () => {
        stopTimer();
        releaseStream();
        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state !== 'inactive'
        ) {
            mediaRecorderRef.current.stop();
        }
        if (audioUrlRef.current) {
            URL.revokeObjectURL(audioUrlRef.current);
            audioUrlRef.current = null;
            setAudioUrl(null);
        }
        chunksRef.current = [];
        setSeconds(0);
        setStatus(isMediaRecorderSupported ? 'idle' : 'unsupported');
        setErrorMsg('');
        onChange?.(null);
    };

    const toggle = () => {
        if (status === 'recording') stopRecording();
        else startRecording();
    };

    const formatTime = (s) => {
        const m = String(Math.floor(s / 60)).padStart(2, '0');
        const sec = String(s % 60).padStart(2, '0');
        return `${m}:${sec}`;
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <button
                    type="button"
                    onClick={toggle}
                    disabled={
                        status === 'done' ||
                        status === 'error' ||
                        status === 'unsupported'
                    }
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                        status === 'recording'
                            ? 'animate-pulse bg-gradient-to-br from-rose-400 to-rose-500 shadow-lg shadow-rose-500/40'
                            : 'bg-gradient-to-br from-blue-400 to-blue-500 shadow-lg shadow-blue-500/40 hover:scale-105'
                    }`}
                >
                    <i
                        className={`fas ${status === 'recording' ? 'fa-stop' : 'fa-microphone'} text-lg`}
                    />
                </button>

                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-700">
                        {status === 'recording' && 'Recording…'}
                        {status === 'done' && 'Recording saved'}
                        {status === 'idle' && 'Tap to start recording'}
                        {status === 'error' && 'Microphone error'}
                        {status === 'unsupported' &&
                            'Not supported on this browser'}
                    </p>
                    <p className="text-xs text-slate-400">
                        {formatTime(seconds)}
                    </p>
                </div>

                <div className="flex h-8 items-end gap-1">
                    {[20, 50, 80, 40, 70, 30, 60].map((h, i) => (
                        <span
                            key={i}
                            className={`w-1 rounded-full transition-all duration-300 ${
                                status === 'recording'
                                    ? i % 2 === 0
                                        ? 'animate-bounce bg-rose-400'
                                        : 'bg-rose-300'
                                    : status === 'done'
                                      ? 'bg-emerald-400'
                                      : 'bg-blue-300'
                            }`}
                            style={{ height: `${h}%` }}
                        />
                    ))}
                </div>

                {(status === 'done' || status === 'error') && (
                    <button
                        type="button"
                        onClick={reset}
                        className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-100 hover:text-slate-700"
                        title="Re-record"
                    >
                        <i className="fas fa-redo text-xs" />
                    </button>
                )}
            </div>

            {(status === 'error' || status === 'unsupported') && errorMsg && (
                <p className="flex items-center gap-1.5 text-xs text-rose-500">
                    <i className="fas fa-exclamation-circle" />
                    {errorMsg}
                </p>
            )}

            {status === 'done' && audioUrl && (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                        <i className="fas fa-check-circle" />
                        Recording ready — listen before submitting
                    </p>
                    <audio
                        controls
                        src={audioUrl}
                        className="w-full rounded-xl"
                    />
                </div>
            )}
        </div>
    );
}
