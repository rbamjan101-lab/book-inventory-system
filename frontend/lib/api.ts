const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

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

export type PaginatedBooks = {
	items: Book[];
	total: number;
	skip: number;
	limit: number;
};

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
	return res.json();
}

export const api = {
	listBooks: (params: { skip?: number; limit?: number; q?: string } = {}) => {
		const query = new URLSearchParams();
		if (params.skip) query.set('skip', String(params.skip));
		if (params.limit) query.set('limit', String(params.limit));
		if (params.q) query.set('q', params.q);
		const qs = query.toString();
		return request<PaginatedBooks>(`/books/?${qs}`);
	},
	getBook: (id: number) => request<Book>(`/books/${id}`),
	createBook: (payload: BookCreate) => request<Book>(`/books/`, { method: 'POST', body: JSON.stringify(payload) }),
	updateBook: (id: number, payload: BookUpdate) => request<Book>(`/books/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
	deleteBook: (id: number) => fetch(`${API_BASE}/books/${id}`, { method: 'DELETE' }).then((r) => {
		if (!r.ok) throw new Error('Delete failed');
	}),
};


