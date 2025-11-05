import Link from 'next/link'
import { api, type CustomerCategory } from '@/lib/api'

type SearchParams = { [key: string]: string | string[] | undefined }

const categoryLabels: Record<CustomerCategory, string> = {
        school: 'School',
        stationery_shop: 'Stationery Shop',
        dealer: 'Dealer',
}

async function fetchCustomers(searchParams: { page?: string; q?: string; category?: string }) {
        const page = Number(searchParams.page ?? '1')
        const limit = 10
        const skip = (page - 1) * limit
        const q = searchParams.q ?? ''
        const category = searchParams.category as CustomerCategory | undefined
        try {
                const data = await api.listCustomers({ skip, limit, q, category })
                return { ...data, page, limit, error: null as string | null }
        } catch (err: any) {
                return { items: [], total: 0, skip, limit, page, error: err?.message || 'Failed to reach API' }
        }
}

export default async function CustomersPage({ searchParams }: { searchParams: SearchParams }) {
        const flatParams = Object.fromEntries(
                Object.entries(searchParams).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
        )
        const { items, total, page, limit, error } = await fetchCustomers({
                page: flatParams.page,
                q: flatParams.q,
                category: flatParams.category,
        })
        const totalPages = Math.max(1, Math.ceil(total / limit))

        return (
                <div className="space-y-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <form className="flex flex-1 flex-wrap items-center gap-2" action="/customers">
                                        <input
                                                name="q"
                                                placeholder="Search customers"
                                                defaultValue={flatParams.q || ''}
                                                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:max-w-xs"
                                        />
                                        <select
                                                name="category"
                                                defaultValue={flatParams.category || ''}
                                                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                                        >
                                                <option value="">All Categories</option>
                                                {Object.entries(categoryLabels).map(([value, label]) => (
                                                        <option key={value} value={value}>
                                                                {label}
                                                        </option>
                                                ))}
                                        </select>
                                        <button
                                                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                                                type="submit"
                                        >
                                                Filter
                                        </button>
                                </form>
                                <Link
                                        href="/customers/new"
                                        className="inline-flex items-center gap-2 rounded-md border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                                >
                                        Add Customer
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
                                                        <th className="px-4 py-2">Customer</th>
                                                        <th className="px-4 py-2">Category</th>
                                                        <th className="px-4 py-2">Contact Person</th>
                                                        <th className="px-4 py-2">Phone</th>
                                                        <th className="px-4 py-2">Email</th>
                                                        <th className="px-4 py-2">PAN / VAT</th>
                                                        <th className="px-4 py-2" aria-label="Actions" />
                                                </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                                {items.map((customer) => (
                                                        <tr key={customer.id} className="hover:bg-slate-50">
                                                                <td className="px-4 py-2">
                                                                        <div className="font-medium text-slate-900">{customer.name}</div>
                                                                        {customer.contact_address && (
                                                                                <div className="text-xs text-slate-500">{customer.contact_address}</div>
                                                                        )}
                                                                </td>
                                                                <td className="px-4 py-2 text-slate-600">{categoryLabels[customer.category]}</td>
                                                                <td className="px-4 py-2 text-slate-600">{customer.contact_person || '—'}</td>
                                                                <td className="px-4 py-2 text-slate-600">{customer.contact_number || '—'}</td>
                                                                <td className="px-4 py-2 text-slate-600">{customer.email || '—'}</td>
                                                                <td className="px-4 py-2 text-slate-600">{customer.tax_number || '—'}</td>
                                                                <td className="px-4 py-2 text-right">
                                                                        <Link
                                                                                href={`/customers/${customer.id}`}
                                                                                className="text-sm font-medium text-blue-600 hover:underline"
                                                                        >
                                                                                Edit
                                                                        </Link>
                                                                </td>
                                                        </tr>
                                                ))}
                                        </tbody>
                                </table>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-slate-500">{total} customers</p>
                                <div className="flex flex-wrap gap-2">
                                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((p) => {
                                                const sp = new URLSearchParams()
                                                if (flatParams.q) sp.set('q', flatParams.q)
                                                if (flatParams.category) sp.set('category', flatParams.category)
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
                                                                href={`/customers?${sp.toString()}`}
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
