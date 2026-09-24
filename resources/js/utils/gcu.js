/**
 * Persists General Conditions of Use (GCU) acceptance in the browser.
 * Keyed by user type ("consumer" | "merchant") so each path tracks its
 * own acceptance independently.
 */

const ACCEPTANCE_KEY = 'complaint_portal.gcu_acceptance';
const USER_TYPE_KEY = 'complaint_portal.user_type';
const GCU_VERSION = '1.0';

function readStore() {
    try {
        const raw = localStorage.getItem(ACCEPTANCE_KEY);

        return raw ? JSON.parse(raw) : {};
    } catch (error) {
        console.error('GCU store is unreadable, resetting.', error);

        return {};
    }
}

/**
 * Returns the acceptance record for a user type, or null if the user
 * never accepted (or accepted an older version of the GCU).
 */
export function getGcuAcceptance(userType) {
    const store = readStore();
    const record = store[userType];

    if (!record || record.version !== GCU_VERSION) {return null;}

    return record;
}

export function hasAcceptedGcu(userType) {
    return getGcuAcceptance(userType) !== null;
}

/**
 * Records acceptance for a given user type and remembers the last
 * chosen user type, so returning visitors can be routed directly.
 */
export function saveGcuAcceptance(userType) {
    const store = readStore();
    const record = {
        accepted: true,
        version: GCU_VERSION,
        acceptedAt: new Date().toISOString(),
    };
    store[userType] = record;

    try {
        localStorage.setItem(ACCEPTANCE_KEY, JSON.stringify(store));
        localStorage.setItem(USER_TYPE_KEY, userType);
    } catch (error) {
        console.error('Unable to persist GCU acceptance.', error);
    }

    return record;
}

export function getLastUserType() {
    try {
        return localStorage.getItem(USER_TYPE_KEY);
    } catch {
        return null;
    }
}

export function clearGcuAcceptance() {
    try {
        localStorage.removeItem(ACCEPTANCE_KEY);
        localStorage.removeItem(USER_TYPE_KEY);
    } catch {
        /* no-op */
    }
}
