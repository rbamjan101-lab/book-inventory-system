const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

type Pagination<T> = {
        items: T[];
        total: number;
        skip: number;
        limit: number;
};

export type Book = {
        id: number;
        title: string;
        author: string;
        isbn?: string | null;
        quantity: number;
        price: number;
        created_at: string;
        updated_at: string;
};

export type BookCreate = {
        title: string;
        author: string;
        isbn?: string | null;
        quantity: number;
        price: number;
};

export type BookUpdate = Partial<BookCreate>;

export type PaginatedBooks = Pagination<Book>;

export type Vendor = {
        id: number;
        name: string;
        contact_address?: string | null;
        contact_person?: string | null;
        contact_number?: string | null;
        email?: string | null;
        tax_number?: string | null;
        created_at: string;
        updated_at: string;
};

export type VendorCreate = Omit<Vendor, 'id' | 'created_at' | 'updated_at'>;
export type VendorUpdate = Partial<VendorCreate>;
export type PaginatedVendors = Pagination<Vendor>;

export type CustomerCategory = 'school' | 'stationery_shop' | 'dealer';

export type Customer = {
        id: number;
        name: string;
        contact_address?: string | null;
        contact_person?: string | null;
        contact_number?: string | null;
        email?: string | null;
        tax_number?: string | null;
        category: CustomerCategory;
        created_at: string;
        updated_at: string;
};

export type CustomerCreate = Omit<Customer, 'id' | 'created_at' | 'updated_at'>;
export type CustomerUpdate = Partial<CustomerCreate>;
export type PaginatedCustomers = Pagination<Customer>;

export type Purchase = {
        id: number;
        vendor_id: number;
        book_id: number;
        quantity: number;
        unit_cost: number;
        total_cost: number;
        purchased_at: string;
        notes?: string | null;
        created_at: string;
        updated_at: string;
        vendor?: Vendor | null;
        book?: Book | null;
};

export type PurchaseCreate = {
        vendor_id: number;
        book_id: number;
        quantity: number;
        unit_cost: number;
        purchased_at?: string | null;
        notes?: string | null;
};

export type PaginatedPurchases = Pagination<Purchase>;

export type Sale = {
        id: number;
        customer_id: number;
        book_id: number;
        quantity: number;
        unit_price: number;
        total_amount: number;
        sold_at: string;
        notes?: string | null;
        created_at: string;
        updated_at: string;
        customer?: Customer | null;
        book?: Book | null;
};

export type SaleCreate = {
        customer_id: number;
        book_id: number;
        quantity: number;
        unit_price: number;
        sold_at?: string | null;
        notes?: string | null;
};

export type PaginatedSales = Pagination<Sale>;

export type SalesReturn = {
        id: number;
        sale_id: number;
        quantity: number;
        reason?: string | null;
        processed_at: string;
        created_at: string;
        updated_at: string;
        sale?: Sale | null;
};

export type SalesReturnCreate = {
        sale_id: number;
        quantity: number;
        reason?: string | null;
};

export type PaginatedSalesReturns = Pagination<SalesReturn>;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
        const res = await fetch(`${API_BASE}${path}`, {
                ...options,
                headers: {
                        'Content-Type': 'application/json',
                        ...(options?.headers || {}),
                },
                cache: 'no-store',
        });
        if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `Request failed: ${res.status}`);
        }
        if (res.status === 204) {
                return undefined as T;
        }
        return res.json();
}

function buildQuery(params: Record<string, string | number | undefined | null>): string {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                        query.set(key, String(value));
                }
        });
        const qs = query.toString();
        return qs ? `?${qs}` : '';
}

export const api = {
        listBooks: (params: { skip?: number; limit?: number; q?: string } = {}) => {
                const qs = buildQuery(params);
                return request<PaginatedBooks>(`/books/${qs}`);
        },
        getBook: (id: number) => request<Book>(`/books/${id}`),
        createBook: (payload: BookCreate) => request<Book>(`/books/`, { method: 'POST', body: JSON.stringify(payload) }),
        updateBook: (id: number, payload: BookUpdate) => request<Book>(`/books/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
        deleteBook: (id: number) => request<void>(`/books/${id}`, { method: 'DELETE' }),

        listVendors: (params: { skip?: number; limit?: number; q?: string } = {}) => {
                const qs = buildQuery(params);
                return request<PaginatedVendors>(`/vendors/${qs}`);
        },
        getVendor: (id: number) => request<Vendor>(`/vendors/${id}`),
        createVendor: (payload: VendorCreate) => request<Vendor>(`/vendors/`, { method: 'POST', body: JSON.stringify(payload) }),
        updateVendor: (id: number, payload: VendorUpdate) => request<Vendor>(`/vendors/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
        deleteVendor: (id: number) => request<void>(`/vendors/${id}`, { method: 'DELETE' }),

        listCustomers: (
                params: { skip?: number; limit?: number; q?: string; category?: CustomerCategory } = {},
        ) => {
                const qs = buildQuery(params);
                return request<PaginatedCustomers>(`/customers/${qs}`);
        },
        getCustomer: (id: number) => request<Customer>(`/customers/${id}`),
        createCustomer: (payload: CustomerCreate) => request<Customer>(`/customers/`, { method: 'POST', body: JSON.stringify(payload) }),
        updateCustomer: (id: number, payload: CustomerUpdate) =>
                request<Customer>(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
        deleteCustomer: (id: number) => request<void>(`/customers/${id}`, { method: 'DELETE' }),

        listPurchases: (
                params: { skip?: number; limit?: number; vendor_id?: number; book_id?: number } = {},
        ) => {
                const qs = buildQuery(params);
                return request<PaginatedPurchases>(`/purchases/${qs}`);
        },
        createPurchase: (payload: PurchaseCreate) =>
                request<Purchase>(`/purchases/`, { method: 'POST', body: JSON.stringify(payload) }),

        listSales: (params: { skip?: number; limit?: number; customer_id?: number; book_id?: number } = {}) => {
                const qs = buildQuery(params);
                return request<PaginatedSales>(`/sales/${qs}`);
        },
        createSale: (payload: SaleCreate) => request<Sale>(`/sales/`, { method: 'POST', body: JSON.stringify(payload) }),

        listSalesReturns: (params: { skip?: number; limit?: number; sale_id?: number } = {}) => {
                const qs = buildQuery(params);
                return request<PaginatedSalesReturns>(`/sales-returns/${qs}`);
        },
        createSalesReturn: (payload: SalesReturnCreate) =>
                request<SalesReturn>(`/sales-returns/`, { method: 'POST', body: JSON.stringify(payload) }),
};


