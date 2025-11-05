"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VendorForm from '@/components/VendorForm';
import { api, type VendorCreate } from '@/lib/api';

export default function NewVendorPage() {
        const router = useRouter();

        async function handleCreate(values: VendorCreate) {
                await api.createVendor(values);
                router.push('/vendors');
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
                                <h2 className="text-lg font-semibold text-slate-800">Add Vendor</h2>
                        </div>
                        <VendorForm onSubmit={handleCreate} submitLabel="Create Vendor" />
                </div>
        );
}
