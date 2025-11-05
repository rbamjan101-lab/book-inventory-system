"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VendorForm from '@/components/VendorForm';
import { api, type Vendor, type VendorUpdate } from '@/lib/api';

type Props = {
        vendor: Vendor;
};

export default function VendorEditor({ vendor }: Props) {
        const router = useRouter();
        const [error, setError] = useState<string | null>(null);
        const [deleting, setDeleting] = useState(false);

        async function handleUpdate(values: VendorUpdate) {
                setError(null);
                await api.updateVendor(vendor.id, values);
                router.push('/vendors');
        }

        async function handleDelete() {
                setError(null);
                setDeleting(true);
                try {
                        await api.deleteVendor(vendor.id);
                        router.push('/vendors');
                } catch (err: any) {
                        setError(err?.message || 'Unable to delete vendor');
                        setDeleting(false);
                }
        }

        return (
                <div className="space-y-4">
                        <div className="flex items-center justify-between">
                                <Link
                                        href="/vendors"
                                        className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                                >
                                        Back to Vendors
                                </Link>
                                <h2 className="text-lg font-semibold text-slate-800">Edit Vendor</h2>
                        </div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <VendorForm initial={vendor} onSubmit={handleUpdate} submitLabel="Save Changes" />
                        <div className="flex justify-end">
                                <button
                                        onClick={handleDelete}
                                        disabled={deleting}
                                        className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed"
                                >
                                        {deleting ? 'Deleting…' : 'Delete Vendor'}
                                </button>
                        </div>
                </div>
        );
}
