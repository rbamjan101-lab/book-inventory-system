"use client";

import { useEffect, useMemo, useState } from 'react';
import { api, type Book, type PurchaseCreate, type Vendor } from '@/lib/api';

type Props = {
        onSubmit: (values: PurchaseCreate) => Promise<void> | void;
};

export default function PurchaseForm({ onSubmit }: Props) {
        const [vendors, setVendors] = useState<Vendor[]>([]);
        const [books, setBooks] = useState<Book[]>([]);
        const [vendorId, setVendorId] = useState<number | ''>('');
        const [bookId, setBookId] = useState<number | ''>('');
        const [quantity, setQuantity] = useState(1);
        const [unitCost, setUnitCost] = useState(0);
        const [purchasedAt, setPurchasedAt] = useState('');
        const [notes, setNotes] = useState('');
        const [error, setError] = useState<string | null>(null);
        const [loading, setLoading] = useState(false);
        const [loadingOptions, setLoadingOptions] = useState(true);

        useEffect(() => {
                let isMounted = true;
                async function loadOptions() {
                        try {
                                setLoadingOptions(true);
                                const [vendorResponse, bookResponse] = await Promise.all([
                                        api.listVendors({ limit: 100 }),
                                        api.listBooks({ limit: 100 }),
                                ]);
                                if (!isMounted) return;
                                setVendors(vendorResponse.items);
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
                if (!vendorId) errs.vendor = 'Select a vendor';
                if (!bookId) errs.book = 'Select a book';
                if (!Number.isFinite(quantity) || quantity <= 0) errs.quantity = 'Quantity must be greater than 0';
                if (!Number.isFinite(unitCost) || unitCost < 0) errs.unitCost = 'Unit cost must be 0 or greater';
                return errs;
        }, [vendorId, bookId, quantity, unitCost]);

        const handleSubmit = async (event: React.FormEvent) => {
                        event.preventDefault();
                        setError(null);
                        if (Object.keys(fieldErrors).length > 0) {
                                return;
                        }
                        setLoading(true);
                        try {
                                await onSubmit({
                                        vendor_id: Number(vendorId),
                                        book_id: Number(bookId),
                                        quantity,
                                        unit_cost: unitCost,
                                        purchased_at: purchasedAt ? new Date(purchasedAt).toISOString() : undefined,
                                        notes: notes.trim() || undefined,
                                });
                        } catch (err: any) {
                                setError(err?.message || 'Failed to record purchase');
                        } finally {
                                setLoading(false);
                        }
        };

        return (
                <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                                <label className="flex flex-col gap-1">
                                        <span className="text-sm font-medium text-slate-600">Vendor</span>
                                        <select
                                                value={vendorId}
                                                onChange={(event) => setVendorId(event.target.value ? Number(event.target.value) : '')}
                                                disabled={loadingOptions}
                                                className={`rounded-md border px-3 py-2 text-sm ${
                                                        fieldErrors.vendor ? 'border-red-500' : 'border-slate-200'
                                                }`}
                                                aria-invalid={Boolean(fieldErrors.vendor)}
                                        >
                                                <option value="">Select vendor</option>
                                                {vendors.map((vendor) => (
                                                        <option key={vendor.id} value={vendor.id}>
                                                                {vendor.name}
                                                        </option>
                                                ))}
                                        </select>
                                        {fieldErrors.vendor && <span className="text-xs text-red-600">{fieldErrors.vendor}</span>}
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
                                                                {book.title}
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
                                        <span className="text-sm font-medium text-slate-600">Unit Cost</span>
                                        <input
                                                type="number"
                                                min={0}
                                                step="0.01"
                                                value={unitCost}
                                                onChange={(event) => setUnitCost(Number(event.target.value))}
                                                className={`rounded-md border px-3 py-2 text-sm ${
                                                        fieldErrors.unitCost ? 'border-red-500' : 'border-slate-200'
                                                }`}
                                                aria-invalid={Boolean(fieldErrors.unitCost)}
                                        />
                                        {fieldErrors.unitCost && (
                                                <span className="text-xs text-red-600">{fieldErrors.unitCost}</span>
                                        )}
                                </label>
                                <label className="flex flex-col gap-1">
                                        <span className="text-sm font-medium text-slate-600">Purchased Date</span>
                                        <input
                                                type="date"
                                                value={purchasedAt}
                                                onChange={(event) => setPurchasedAt(event.target.value)}
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
                                        {loading ? 'Saving…' : 'Record Purchase'}
                                </button>
                        </div>
                </form>
        );
}
