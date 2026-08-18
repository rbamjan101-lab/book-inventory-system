import type { Metadata } from 'next'
import Link from 'next/link'
import '../styles/globals.css'

const navItems = [
        { href: '/', label: 'Books' },
        { href: '/vendors', label: 'Vendors' },
        { href: '/customers', label: 'Customers' },
        { href: '/purchases', label: 'Purchases' },
        { href: '/sales', label: 'Sales' },
        { href: '/sales-returns', label: 'Sales Returns' },
]

export const metadata: Metadata = {
        title: 'Book Inventory',
        description: 'Inventory management system for books',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
        return (
                <html lang="en">
                        <body className="min-h-screen bg-slate-50 text-slate-900">
                                <header className="border-b bg-white shadow-sm">
                                        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                                                <Link href="/" className="text-xl font-semibold text-blue-700">
                                                        Little Bub Publications Inventory
                                                </Link>
                                                <nav className="flex flex-wrap gap-2 text-sm">
                                                        {navItems.map((item) => (
                                                                <Link
                                                                        key={item.href}
                                                                        href={item.href}
                                                                        className="rounded-md px-3 py-2 font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
                                                                >
                                                                        {item.label}
                                                                </Link>
                                                        ))}
                                                </nav>
                                        </div>
                                </header>
                                <main className="mx-auto max-w-6xl px-4 py-6">
                                        {children}
                                </main>
                        </body>
                </html>
        )
}


