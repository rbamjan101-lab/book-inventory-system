"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PurchaseForm from '@/components/PurchaseForm';
import { api, type PurchaseCreate } from '@/lib/api';

export default function NewPurchasePage() {
        const router = useRouter();

        async function handleCreate(values: PurchaseCreate) {
                await api.createPurchase(values);
                router.push('/purchases');
        }

        return (
                <div className="space-y-4">
                        <div className="flex items-center justify-between">
                                <Link
                                        href="/purchases"
                                        className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                                >
                                        Back to Purchases
                                </Link>
                                <h2 className="text-lg font-semibold text-slate-800">Record Purchase</h2>
                        </div>
                        <PurchaseForm onSubmit={handleCreate} />
                </div>
        );
}
