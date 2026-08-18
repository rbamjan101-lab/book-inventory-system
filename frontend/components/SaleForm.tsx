"use client";

import { useEffect, useMemo, useState } from 'react';
import { api, type Book, type Customer, type SaleCreate } from '@/lib/api';

type Props = {
        onSubmit: (values: SaleCreate) => Promise<void> | void;
};

export default function SaleForm({ onSubmit }: Props) {
        const [customers, setCustomers] = useState<Customer[]>([]);
        const [books, setBooks] = useState<Book[]>([]);
        const [customerId, setCustomerId] = useState<number | ''>('');
        const [bookId, setBookId] = useState<number | ''>('');
        const [quantity, setQuantity] = useState(1);
        const [unitPrice, setUnitPrice] = useState(0);
        const [soldAt, setSoldAt] = useState('');
        const [notes, setNotes] = useState('');
        const [error, setError] = useState<string | null>(null);
        const [loading, setLoading] = useState(false);
        const [loadingOptions, setLoadingOptions] = useState(true);

        useEffect(() => {
                let isMounted = true;
                async function loadOptions() {
                        try {
                                setLoadingOptions(true);
                                const [customerResponse, bookResponse] = await Promise.all([
                                        api.listCustomers({ limit: 100 }),
                                        api.listBooks({ limit: 100 }),
                                ]);
                                if (!isMounted) return;
                                setCustomers(customerResponse.items);
                                setBooks(bookResponse.items);
                        } catch (err: any) {
                                if (isMounted) {
                                        setError(err?.message || 'Failed to load options');
                                }
                        } finally {
                                if (isMounted) {
                                        setLoadingOptions(false);
                                }
                        }
                }
                loadOptions();
                return () => {
                        isMounted = false;
                };
        }, []);

        const fieldErrors = useMemo(() => {
                const errs: Record<string, string> = {};
                if (!customerId) errs.customer = 'Select a customer';
                if (!bookId) errs.book = 'Select a book';
                if (!Number.isFinite(quantity) || quantity <= 0) errs.quantity = 'Quantity must be greater than 0';
                if (!Number.isFinite(unitPrice) || unitPrice < 0) errs.unitPrice = 'Unit price must be 0 or greater';
                return errs;
        }, [customerId, bookId, quantity, unitPrice]);

        const handleSubmit = async (event: React.FormEvent) => {
                event.preventDefault();
                setError(null);
                if (Object.keys(fieldErrors).length > 0) {
                        return;
                }
                setLoading(true);
                try {
                        await onSubmit({
                                customer_id: Number(customerId),
                                book_id: Number(bookId),
                                quantity,
                                unit_price: unitPrice,
                                sold_at: soldAt ? new Date(soldAt).toISOString() : undefined,
                                notes: notes.trim() || undefined,
                        });
                } catch (err: any) {
                        setError(err?.message || 'Failed to record sale');
                } finally {
                        setLoading(false);
                }
        };

        return (
                <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                                <label className="flex flex-col gap-1">
                                        <span className="text-sm font-medium text-slate-600">Customer</span>
                                        <select
                                                value={customerId}
                                                onChange={(event) =>
                                                        setCustomerId(event.target.value ? Number(event.target.value) : '')
                                                }
                                                disabled={loadingOptions}
                                                className={`rounded-md border px-3 py-2 text-sm ${
                                                        fieldErrors.customer ? 'border-red-500' : 'border-slate-200'
                                                }`}
                                                aria-invalid={Boolean(fieldErrors.customer)}
                                        >
                                                <option value="">Select customer</option>
                                                {customers.map((customer) => (
                                                        <option key={customer.id} value={customer.id}>
                                                                {customer.name}
                                                        </option>
                                                ))}
                                        </select>
                                        {fieldErrors.customer && (
                                                <span className="text-xs text-red-600">{fieldErrors.customer}</span>
                                        )}
                                </label>
                                <label className="flex flex-col gap-1">
                                        <span className="text-sm font-medium text-slate-600">Book</span>
                                        <select
                                                value={bookId}
                                                onChange={(event) => setBookId(event.target.value ? Number(event.target.value) : '')}
                                                disabled={loadingOptions}
                                                className={`rounded-md border px-3 py-2 text-sm ${
                                                        fieldErrors.book ? 'border-red-500' : 'border-slate-200'
                                                }`}
                                                aria-invalid={Boolean(fieldErrors.book)}
                                        >
                                                <option value="">Select book</option>
                                                {books.map((book) => (
                                                        <option key={book.id} value={book.id}>
                                                                {book.title} (Stock: {book.quantity})
                                                        </option>
                                                ))}
                                        </select>
                                        {fieldErrors.book && <span className="text-xs text-red-600">{fieldErrors.book}</span>}
                                </label>
                                <label className="flex flex-col gap-1">
                                        <span className="text-sm font-medium text-slate-600">Quantity</span>
                                        <input
                                                type="number"
                                                min={1}
                                                value={quantity}
                                                onChange={(event) => setQuantity(Number(event.target.value))}
                                                className={`rounded-md border px-3 py-2 text-sm ${
                                                        fieldErrors.quantity ? 'border-red-500' : 'border-slate-200'
                                                }`}
                                                aria-invalid={Boolean(fieldErrors.quantity)}
                                        />
                                        {fieldErrors.quantity && (
                                                <span className="text-xs text-red-600">{fieldErrors.quantity}</span>
                                        )}
                                </label>
                                <label className="flex flex-col gap-1">
                                        <span className="text-sm font-medium text-slate-600">Unit Price</span>
                                        <input
                                                type="number"
                                                min={0}
                                                step="0.01"
                                                value={unitPrice}
                                                onChange={(event) => setUnitPrice(Number(event.target.value))}
                                                className={`rounded-md border px-3 py-2 text-sm ${
                                                        fieldErrors.unitPrice ? 'border-red-500' : 'border-slate-200'
                                                }`}
                                                aria-invalid={Boolean(fieldErrors.unitPrice)}
                                        />
                                        {fieldErrors.unitPrice && (
                                                <span className="text-xs text-red-600">{fieldErrors.unitPrice}</span>
                                        )}
                                </label>
                                <label className="flex flex-col gap-1">
                                        <span className="text-sm font-medium text-slate-600">Sold Date</span>
                                        <input
                                                type="date"
                                                value={soldAt}
                                                onChange={(event) => setSoldAt(event.target.value)}
                                                className="rounded-md border border-slate-200 px-3 py-2 text-sm"
                                        />
                                </label>
                                <label className="flex flex-col gap-1 sm:col-span-2">
                                        <span className="text-sm font-medium text-slate-600">Notes</span>
                                        <textarea
                                                value={notes}
                                                onChange={(event) => setNotes(event.target.value)}
                                                rows={3}
                                                className="rounded-md border border-slate-200 px-3 py-2 text-sm"
                                        />
                                </label>
                        </div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <div className="flex gap-2">
                                <button
                                        type="submit"
                                        disabled={loading || Object.keys(fieldErrors).length > 0}
                                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                                >
                                        {loading ? 'Saving…' : 'Record Sale'}
                                </button>
                        </div>
                </form>
        );
}
