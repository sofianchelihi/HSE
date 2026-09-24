export interface State {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    name: string;
}

export interface ComplaintType {
    id: number;
    name: string;
}

export interface Wilaya {
    id: number;
    name: string;
}

export interface Commune {
    id: number;
    name: string;
}

export interface ConsumerComplaint {
    id: number;
    consumer_name: string | null;
    consumer_phone: string | null;
    consumer_email: string | null;
    comment: string | null;
    audio_path: string | null;
    batch_number: string | null;
    fabrication_date: string | null;
    market_name: string | null;
    rating: number | null;
    seen: boolean;
    created_at: string;
    state_id: number | null;
    product: Product | null;
    complaint_type: ComplaintType | null;
    wilaya: Wilaya | null;
    commune: Commune | null;
    state: State | null;
}

export interface PaginatorLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface Paginator<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    links: PaginatorLink[];
}

export interface Props {
    complaints: Paginator<ConsumerComplaint>;
    states: State[];
    filters: DashboardFilters;
    filterOptions: DashboardFilterOptions;
}

export interface Merchant {
    id: number;
    name: string;
    email: string;
    phone: string;
    market_name: string;
}

export interface ComplaintImage {
    id: number;
    image_path: string;
}

export interface MerchantComplaint {
    id: number;
    comment: string | null;
    audio_path: string | null;
    batch_number: string | null;
    fabrication_date: string | null;
    seen: boolean;
    created_at: string;
    state_id: number | null;
    product: Product | null;
    complaint_type: ComplaintType | null;
    merchant: Merchant | null;
    state: State | null;
    images: ComplaintImage[];
}

export interface MerchantProps {
    complaints: Paginator<MerchantComplaint>;
    states: State[];
    filters: DashboardFilters;
    filterOptions: DashboardFilterOptions;
}

// ─── Dashboard stats ──────────────────────────────────────────────────────────

export interface DashboardStats {
    total: number;
    consumer: number;
    merchant: number;
}

export interface StateStat {
    id: number | null;
    name: string;
    consumer: number;
    merchant: number;
    total: number;
}

export interface WilayaStat {
    id: number;
    name: string;
    count: number;
}

export interface DashboardFilters {
    date_from?: string;
    date_to?: string;
    state_id?: string;
    wilaya_id?: string;
}

export interface DashboardFilterOptions {
    states: State[];
    wilayas: Wilaya[];
}

export interface DashboardProps {
    stats: DashboardStats;
    stateStats: StateStat[];
    wilayaStats: WilayaStat[];
    filters: DashboardFilters;
    filterOptions: DashboardFilterOptions;
}
