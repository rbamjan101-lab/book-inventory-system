"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SaleForm from '@/components/SaleForm';
import { api, type SaleCreate } from '@/lib/api';

export default function NewSalePage() {
        const router = useRouter();

        async function handleCreate(values: SaleCreate) {
                await api.createSale(values);
                router.push('/sales');
        }

        return (
                <div className="space-y-4">
                        <div className="flex items-center justify-between">
                                <Link
                                        href="/sales"
                                        className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                                >
                                        Back to Sales
                                </Link>
                                <h2 className="text-lg font-semibold text-slate-800">Record Sale</h2>
                        </div>
                        <SaleForm onSubmit={handleCreate} />
                </div>
        );
}
