import Link from 'next/link'
import { api } from '@/lib/api'

type SearchParams = { [key: string]: string | string[] | undefined }

async function fetchSales(searchParams: { page?: string; customer_id?: string; book_id?: string }) {
        const page = Number(searchParams.page ?? '1')
        const limit = 10
        const skip = (page - 1) * limit
        const customerId = searchParams.customer_id ? Number(searchParams.customer_id) : undefined
        const bookId = searchParams.book_id ? Number(searchParams.book_id) : undefined
        try {
                const data = await api.listSales({ skip, limit, customer_id: customerId, book_id: bookId })
                return { ...data, page, limit, error: null as string | null }
        } catch (err: any) {
                return { items: [], total: 0, skip, limit, page, error: err?.message || 'Failed to reach API' }
        }
}

export default async function SalesPage({ searchParams }: { searchParams: SearchParams }) {
        const flatParams = Object.fromEntries(
                Object.entries(searchParams).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
        )
        const { items, total, page, limit, error } = await fetchSales({
                page: flatParams.page,
                customer_id: flatParams.customer_id,
                book_id: flatParams.book_id,
        })
        const totalPages = Math.max(1, Math.ceil(total / limit))

        return (
                <div className="space-y-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <h2 className="text-lg font-semibold text-slate-800">Sales History</h2>
                                <Link
                                        href="/sales/new"
                                        className="inline-flex items-center gap-2 rounded-md border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                                >
                                        Record Sale
                                </Link>
                        </div>

                        {error && (
                                <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900">
                                        {error} — ensure the backend is running on http://localhost:8000
                                </div>
                        )}

                        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
                                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                                <tr>
                                                        <th className="px-4 py-2">Sold</th>
                                                        <th className="px-4 py-2">Customer</th>
                                                        <th className="px-4 py-2">Book</th>
                                                        <th className="px-4 py-2">Quantity</th>
                                                        <th className="px-4 py-2">Unit Price</th>
                                                        <th className="px-4 py-2">Total</th>
                                                        <th className="px-4 py-2">Notes</th>
                                                </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                                {items.map((sale) => (
                                                        <tr key={sale.id} className="hover:bg-slate-50">
                                                                <td className="px-4 py-2 text-slate-600">
                                                                        {new Date(sale.sold_at).toLocaleString()}
                                                                </td>
                                                                <td className="px-4 py-2 text-slate-600">{sale.customer?.name || '—'}</td>
                                                                <td className="px-4 py-2 text-slate-600">{sale.book?.title || '—'}</td>
                                                                <td className="px-4 py-2 text-slate-600">{sale.quantity}</td>
                                                                <td className="px-4 py-2 text-slate-600">${Number(sale.unit_price).toFixed(2)}</td>
                                                                <td className="px-4 py-2 text-slate-600">${Number(sale.total_amount).toFixed(2)}</td>
                                                                <td className="px-4 py-2 text-slate-600">{sale.notes || '—'}</td>
                                                        </tr>
                                                ))}
                                        </tbody>
                                </table>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-slate-500">{total} sales records</p>
                                <div className="flex flex-wrap gap-2">
                                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((p) => {
                                                const sp = new URLSearchParams()
                                                if (flatParams.customer_id) sp.set('customer_id', flatParams.customer_id)
                                                if (flatParams.book_id) sp.set('book_id', flatParams.book_id)
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
                                                                href={`/sales?${sp.toString()}`}
                                                        >
                                                                {p}
                                                        </Link>
                                                )
                                        })}
                                </div>
                        </div>
                </div>
        )
}
