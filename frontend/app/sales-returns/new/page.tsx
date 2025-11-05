"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SalesReturnForm from '@/components/SalesReturnForm';
import { api, type SalesReturnCreate } from '@/lib/api';

export default function NewSalesReturnPage() {
        const router = useRouter();

        async function handleCreate(values: SalesReturnCreate) {
                await api.createSalesReturn(values);
                router.push('/sales-returns');
        }

        return (
                <div className="space-y-4">
                        <div className="flex items-center justify-between">
                                <Link
                                        href="/sales-returns"
                                        className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                                >
                                        Back to Returns
                                </Link>
                                <h2 className="text-lg font-semibold text-slate-800">Record Sales Return</h2>
                        </div>
                        <SalesReturnForm onSubmit={handleCreate} />
                </div>
        );
}
