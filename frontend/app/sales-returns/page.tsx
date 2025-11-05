import Link from 'next/link'
import { api } from '@/lib/api'

type SearchParams = { [key: string]: string | string[] | undefined }

async function fetchSalesReturns(searchParams: { page?: string; sale_id?: string }) {
        const page = Number(searchParams.page ?? '1')
        const limit = 10
        const skip = (page - 1) * limit
        const saleId = searchParams.sale_id ? Number(searchParams.sale_id) : undefined
        try {
                const data = await api.listSalesReturns({ skip, limit, sale_id: saleId })
                return { ...data, page, limit, error: null as string | null }
        } catch (err: any) {
                return { items: [], total: 0, skip, limit, page, error: err?.message || 'Failed to reach API' }
        }
}

export default async function SalesReturnsPage({ searchParams }: { searchParams: SearchParams }) {
        const flatParams = Object.fromEntries(
                Object.entries(searchParams).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
        )
        const { items, total, page, limit, error } = await fetchSalesReturns({
                page: flatParams.page,
                sale_id: flatParams.sale_id,
        })
        const totalPages = Math.max(1, Math.ceil(total / limit))

        return (
                <div className="space-y-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <h2 className="text-lg font-semibold text-slate-800">Sales Returns</h2>
                                <Link
                                        href="/sales-returns/new"
                                        className="inline-flex items-center gap-2 rounded-md border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                                >
                                        Record Return
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
                                                        <th className="px-4 py-2">Processed</th>
                                                        <th className="px-4 py-2">Sale</th>
                                                        <th className="px-4 py-2">Customer</th>
                                                        <th className="px-4 py-2">Book</th>
                                                        <th className="px-4 py-2">Quantity</th>
                                                        <th className="px-4 py-2">Reason</th>
                                                </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                                {items.map((salesReturn) => (
                                                        <tr key={salesReturn.id} className="hover:bg-slate-50">
                                                                <td className="px-4 py-2 text-slate-600">
                                                                        {new Date(salesReturn.processed_at).toLocaleString()}
                                                                </td>
                                                                <td className="px-4 py-2 text-slate-600">Sale #{salesReturn.sale_id}</td>
                                                                <td className="px-4 py-2 text-slate-600">{salesReturn.sale?.customer?.name || '—'}</td>
                                                                <td className="px-4 py-2 text-slate-600">{salesReturn.sale?.book?.title || '—'}</td>
                                                                <td className="px-4 py-2 text-slate-600">{salesReturn.quantity}</td>
                                                                <td className="px-4 py-2 text-slate-600">{salesReturn.reason || '—'}</td>
                                                        </tr>
                                                ))}
                                        </tbody>
                                </table>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-slate-500">{total} return records</p>
                                <div className="flex flex-wrap gap-2">
                                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((p) => {
                                                const sp = new URLSearchParams()
                                                if (flatParams.sale_id) sp.set('sale_id', flatParams.sale_id)
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
                                                                href={`/sales-returns?${sp.toString()}`}
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
