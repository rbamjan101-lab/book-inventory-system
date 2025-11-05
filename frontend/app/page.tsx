import Link from 'next/link'
import { api } from '@/lib/api'

type SearchParams = { [key: string]: string | string[] | undefined }

async function fetchBooks(searchParams: { page?: string; q?: string }) {
        const page = Number(searchParams.page ?? '1')
        const limit = 10
        const skip = (page - 1) * limit
        const q = searchParams.q ?? ''
        try {
                const data = await api.listBooks({ skip, limit, q })
                return { ...data, page, limit, error: null as string | null }
        } catch (err: any) {
                return { items: [], total: 0, skip, limit, page, error: err?.message || 'Failed to reach API' }
        }
}

async function fetchOverview() {
        try {
                const [booksMeta, vendorsMeta, customersMeta, purchasesMeta, salesMeta, returnsMeta] = await Promise.all([
                        api.listBooks({ limit: 1 }),
                        api.listVendors({ limit: 1 }),
                        api.listCustomers({ limit: 1 }),
                        api.listPurchases({ limit: 1 }),
                        api.listSales({ limit: 1 }),
                        api.listSalesReturns({ limit: 1 }),
                ])
                return {
                        bookCount: booksMeta.total,
                        vendorCount: vendorsMeta.total,
                        customerCount: customersMeta.total,
                        purchaseCount: purchasesMeta.total,
                        saleCount: salesMeta.total,
                        returnCount: returnsMeta.total,
                        error: null as string | null,
                }
        } catch (err: any) {
                return {
                        bookCount: 0,
                        vendorCount: 0,
                        customerCount: 0,
                        purchaseCount: 0,
                        saleCount: 0,
                        returnCount: 0,
                        error: err?.message || 'Unable to load overview data',
                }
        }
}

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
        const flatParams = Object.fromEntries(
                Object.entries(searchParams).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
        )
        const [{ items, total, page, limit, error }, overview] = await Promise.all([
                fetchBooks({ page: flatParams.page, q: flatParams.q }),
                fetchOverview(),
        ])
        const totalPages = Math.max(1, Math.ceil(total / limit))

        const stats = [
                { label: 'Total Book Titles', value: overview.bookCount },
                { label: 'Registered Vendors', value: overview.vendorCount },
                { label: 'Registered Customers', value: overview.customerCount },
                { label: 'Purchase Records', value: overview.purchaseCount },
                { label: 'Sales Records', value: overview.saleCount },
                { label: 'Sales Returns', value: overview.returnCount },
        ]

        return (
                <div className="space-y-6">
                        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {stats.map((stat) => (
                                        <div key={stat.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                                                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                                <p className="mt-1 text-2xl font-semibold text-slate-900">{stat.value}</p>
                                        </div>
                                ))}
                        </section>

                        {(error || overview.error) && (
                                <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900">
                                        {error || overview.error} — ensure the backend is running on http://localhost:8000
                                </div>
                        )}

                        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <form className="flex flex-1 items-center gap-2" action="/">
                                                <input
                                                        name="q"
                                                        placeholder="Search title, author, ISBN"
                                                        defaultValue={flatParams.q || ''}
                                                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                />
                                                <button
                                                        className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                                                        type="submit"
                                                >
                                                        Search
                                                </button>
                                        </form>
                                        <Link
                                                href="/books/new"
                                                className="inline-flex items-center gap-2 rounded-md border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                                        >
                                                <svg
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4"
                                                >
                                                        <path
                                                                d="M12 5v14M5 12h14"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                        />
                                                </svg>
                                                Add Book
                                        </Link>
                                </div>

                                <div className="mt-6 overflow-x-auto">
                                        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                                                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                                        <tr>
                                                                <th className="px-4 py-2">Title</th>
                                                                <th className="px-4 py-2">Author</th>
                                                                <th className="px-4 py-2">ISBN</th>
                                                                <th className="px-4 py-2">Quantity</th>
                                                                <th className="px-4 py-2">Price</th>
                                                                <th className="px-4 py-2" aria-label="Actions" />
                                                        </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                        {items.map((book) => (
                                                                <tr key={book.id} className="hover:bg-slate-50">
                                                                        <td className="px-4 py-2 font-medium text-slate-900">{book.title}</td>
                                                                        <td className="px-4 py-2 text-slate-600">{book.author}</td>
                                                                        <td className="px-4 py-2 text-slate-600">{book.isbn || '—'}</td>
                                                                        <td className="px-4 py-2 text-slate-600">{book.quantity}</td>
                                                                        <td className="px-4 py-2 text-slate-600">${Number(book.price).toFixed(2)}</td>
                                                                        <td className="px-4 py-2 text-right">
                                                                                <Link
                                                                                        className="text-sm font-medium text-blue-600 hover:underline"
                                                                                        href={`/books/${book.id}`}
                                                                                >
                                                                                        Edit
                                                                                </Link>
                                                                        </td>
                                                                </tr>
                                                        ))}
                                                </tbody>
                                        </table>
                                </div>

                                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="text-sm text-slate-500">{total} titles found</p>
                                        <div className="flex flex-wrap gap-2">
                                                {Array.from({ length: totalPages }, (_, index) => index + 1).map((p) => {
                                                        const sp = new URLSearchParams()
                                                        if (flatParams.q) sp.set('q', flatParams.q)
                                                        sp.set('page', String(p))
                                                        const isActive = p === page
                                                        return (
                                                                <Link
                                                                        key={p}
                                                                        className={`rounded-md px-3 py-1 text-sm font-medium transition ${
                                                                                isActive
                                                                                        ? 'bg-blue-600 text-white shadow'
                                                                                        : 'border border-slate-300 text-slate-600 hover:bg-slate-100'
                                                                        }`}
                                                                        href={`/?${sp.toString()}`}
                                                                >
                                                                        {p}
                                                                </Link>
                                                        )
                                                })}
                                        </div>
                                </div>
                        </section>
                </div>
        )
}


