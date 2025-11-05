"use client";

import { useEffect, useMemo, useState } from 'react';
import { api, type Sale, type SalesReturnCreate } from '@/lib/api';

type Props = {
        onSubmit: (values: SalesReturnCreate) => Promise<void> | void;
};

export default function SalesReturnForm({ onSubmit }: Props) {
        const [sales, setSales] = useState<Sale[]>([]);
        const [saleId, setSaleId] = useState<number | ''>('');
        const [quantity, setQuantity] = useState(1);
        const [reason, setReason] = useState('');
        const [error, setError] = useState<string | null>(null);
        const [loading, setLoading] = useState(false);
        const [loadingOptions, setLoadingOptions] = useState(true);

        useEffect(() => {
                let isMounted = true;
                async function loadSales() {
                        try {
                                setLoadingOptions(true);
                                const salesResponse = await api.listSales({ limit: 100 });
                                if (!isMounted) return;
                                setSales(salesResponse.items);
                        } catch (err: any) {
                                if (isMounted) {
                                        setError(err?.message || 'Failed to load sales records');
                                }
                        } finally {
                                if (isMounted) {
                                        setLoadingOptions(false);
                                }
                        }
                }
                loadSales();
                return () => {
                        isMounted = false;
                };
        }, []);

        const fieldErrors = useMemo(() => {
                const errs: Record<string, string> = {};
                if (!saleId) errs.sale = 'Select a sale';
                if (!Number.isFinite(quantity) || quantity <= 0) errs.quantity = 'Quantity must be greater than 0';
                return errs;
        }, [saleId, quantity]);

        const handleSubmit = async (event: React.FormEvent) => {
                event.preventDefault();
                setError(null);
                if (Object.keys(fieldErrors).length > 0) {
                        return;
                }
                setLoading(true);
                try {
                        await onSubmit({
                                sale_id: Number(saleId),
                                quantity,
                                reason: reason.trim() || undefined,
                        });
                } catch (err: any) {
                        setError(err?.message || 'Failed to record sales return');
                } finally {
                        setLoading(false);
                }
        };

        return (
                <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                                <label className="flex flex-col gap-1 sm:col-span-2">
                                        <span className="text-sm font-medium text-slate-600">Sale</span>
                                        <select
                                                value={saleId}
                                                onChange={(event) => setSaleId(event.target.value ? Number(event.target.value) : '')}
                                                disabled={loadingOptions}
                                                className={`rounded-md border px-3 py-2 text-sm ${
                                                        fieldErrors.sale ? 'border-red-500' : 'border-slate-200'
                                                }`}
                                                aria-invalid={Boolean(fieldErrors.sale)}
                                        >
                                                <option value="">Select sale</option>
                                                {sales.map((sale) => (
                                                        <option key={sale.id} value={sale.id}>
                                                                {sale.customer?.name || 'Customer'} → {sale.book?.title || 'Book'} — Qty {sale.quantity}
                                                        </option>
                                                ))}
                                        </select>
                                        {fieldErrors.sale && <span className="text-xs text-red-600">{fieldErrors.sale}</span>}
                                </label>
                                <label className="flex flex-col gap-1">
                                        <span className="text-sm font-medium text-slate-600">Quantity Returning</span>
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
                                <label className="flex flex-col gap-1 sm:col-span-2">
                                        <span className="text-sm font-medium text-slate-600">Return Reason</span>
                                        <textarea
                                                value={reason}
                                                onChange={(event) => setReason(event.target.value)}
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
                                        {loading ? 'Saving…' : 'Record Return'}
                                </button>
                        </div>
                </form>
        );
}
