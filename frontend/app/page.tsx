import Link from 'next/link'
import { api } from '@/lib/api'

async function fetchBooks(searchParams: { page?: string; q?: string }) {
	const page = Number(searchParams.page ?? '1');
	const limit = 10;
	const skip = (page - 1) * limit;
	const q = searchParams.q ?? '';
	try {
		const data = await api.listBooks({ skip, limit, q });
		return { ...data, page, limit, error: null as string | null };
	} catch (err: any) {
		return { items: [], total: 0, skip, limit, page, error: err?.message || 'Failed to reach API' };
	}
}

export default async function Home({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
	const flatParams = Object.fromEntries(Object.entries(searchParams).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]));
	const { items, total, page, limit, error } = await fetchBooks({ page: flatParams.page, q: flatParams.q });
	const totalPages = Math.max(1, Math.ceil(total / limit));

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<form className="flex gap-2" action="/">
					<input
						name="q"
						placeholder="Search title, author, ISBN"
						defaultValue={flatParams.q || ''}
						className="text-black bg-white placeholder-gray-500"
					/>
					<button className="btn btn-secondary" type="submit">Search</button>
				</form>
				<Link href="/books/new">
					<button
						type="button"
						className="btn border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500"
					>
						<span className="inline-flex items-center gap-2">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
								<path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
							Add Book
						</span>
					</button>
				</Link>
			</div>

			{error && (
				<div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900">
					{error} — ensure the backend is running on http://localhost:8000
				</div>
			)}

			<div className="overflow-x-auto">
				<table className="table">
					<thead>
						<tr>
							<th>Title</th>
							<th>Author</th>
							<th>ISBN</th>
							<th>Qty</th>
							<th>Price</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{items.map((b) => (
							<tr key={b.id}>
								<td>{b.title}</td>
								<td>{b.author}</td>
								<td>{b.isbn || '-'}</td>
								<td>{b.quantity}</td>
								<td>${Number(b.price).toFixed(2)}</td>
								<td>
									<Link className="text-blue-600 hover:underline" href={`/books/${b.id}`}>Edit</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="flex items-center justify-between">
				<p className="text-sm text-gray-600">Total: {total}</p>
				<div className="flex gap-2">
					{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
						const sp = new URLSearchParams();
						if (flatParams.q) sp.set('q', flatParams.q);
						sp.set('page', String(p));
						const isActive = p === page;
						return (
							<Link key={p} className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`} href={`/?${sp.toString()}`}>
								{p}
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
}


