"use client";

import { useMemo, useState } from 'react';
import type { Vendor, VendorCreate, VendorUpdate } from '@/lib/api';

type Props = {
        initial?: Partial<Vendor>;
        submitLabel?: string;
        onSubmit: (values: VendorCreate | VendorUpdate) => Promise<void> | void;
};

const emailPattern = /.+@.+\..+/;

export default function VendorForm({ initial, submitLabel = 'Save', onSubmit }: Props) {
        const [name, setName] = useState(initial?.name ?? '');
        const [contactAddress, setContactAddress] = useState(initial?.contact_address ?? '');
        const [contactPerson, setContactPerson] = useState(initial?.contact_person ?? '');
        const [contactNumber, setContactNumber] = useState(initial?.contact_number ?? '');
        const [email, setEmail] = useState(initial?.email ?? '');
        const [taxNumber, setTaxNumber] = useState(initial?.tax_number ?? '');
        const [error, setError] = useState<string | null>(null);
        const [loading, setLoading] = useState(false);

        const fieldErrors = useMemo(() => {
                const errs: Record<string, string> = {};
                if (!name.trim()) {
                        errs.name = 'Vendor name is required';
                }
                if (email && !emailPattern.test(email)) {
                        errs.email = 'Enter a valid email';
                }
                return errs;
        }, [name, email]);

        const handleSubmit = async (event: React.FormEvent) => {
                event.preventDefault();
                setError(null);
                if (Object.keys(fieldErrors).length > 0) {
                        return;
                }
                setLoading(true);
                try {
                        await onSubmit({
                                name: name.trim(),
                                contact_address: contactAddress.trim() || undefined,
                                contact_person: contactPerson.trim() || undefined,
                                contact_number: contactNumber.trim() || undefined,
                                email: email.trim() || undefined,
                                tax_number: taxNumber.trim() || undefined,
                        });
                } catch (err: any) {
                        setError(err?.message || 'Failed to save vendor');
                } finally {
                        setLoading(false);
                }
        };

        return (
                <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                                <label className="flex flex-col gap-1">
                                        <span className="text-sm font-medium text-slate-600">Vendor Name</span>
                                        <input
                                                value={name}
                                                onChange={(event) => setName(event.target.value)}
                                                required
                                                className={`rounded-md border px-3 py-2 text-sm ${
                                                        fieldErrors.name ? 'border-red-500' : 'border-slate-200'
                                                }`}
                                                aria-invalid={Boolean(fieldErrors.name)}
                                        />
                                        {fieldErrors.name && <span className="text-xs text-red-600">{fieldErrors.name}</span>}
                                </label>
                                <label className="flex flex-col gap-1">
                                        <span className="text-sm font-medium text-slate-600">Email</span>
                                        <input
                                                type="email"
                                                value={email}
                                                onChange={(event) => setEmail(event.target.value)}
                                                className={`rounded-md border px-3 py-2 text-sm ${
                                                        fieldErrors.email ? 'border-red-500' : 'border-slate-200'
                                                }`}
                                                aria-invalid={Boolean(fieldErrors.email)}
                                        />
                                        {fieldErrors.email && <span className="text-xs text-red-600">{fieldErrors.email}</span>}
                                </label>
                                <label className="flex flex-col gap-1 sm:col-span-2">
                                        <span className="text-sm font-medium text-slate-600">Contact Address</span>
                                        <textarea
                                                value={contactAddress}
                                                onChange={(event) => setContactAddress(event.target.value)}
                                                rows={3}
                                                className="rounded-md border border-slate-200 px-3 py-2 text-sm"
                                        />
                                </label>
                                <label className="flex flex-col gap-1">
                                        <span className="text-sm font-medium text-slate-600">Contact Person</span>
                                        <input
                                                value={contactPerson}
                                                onChange={(event) => setContactPerson(event.target.value)}
                                                className="rounded-md border border-slate-200 px-3 py-2 text-sm"
                                        />
                                </label>
                                <label className="flex flex-col gap-1">
                                        <span className="text-sm font-medium text-slate-600">Contact Number</span>
                                        <input
                                                value={contactNumber}
                                                onChange={(event) => setContactNumber(event.target.value)}
                                                className="rounded-md border border-slate-200 px-3 py-2 text-sm"
                                        />
                                </label>
                                <label className="flex flex-col gap-1">
                                        <span className="text-sm font-medium text-slate-600">PAN / VAT Number</span>
                                        <input
                                                value={taxNumber}
                                                onChange={(event) => setTaxNumber(event.target.value)}
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
                                        {loading ? 'Saving…' : submitLabel}
                                </button>
                        </div>
                </form>
        );
}
