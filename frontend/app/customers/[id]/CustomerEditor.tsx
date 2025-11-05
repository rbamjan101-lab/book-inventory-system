"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CustomerForm from '@/components/CustomerForm';
import { api, type Customer, type CustomerUpdate } from '@/lib/api';

type Props = {
        customer: Customer;
};

export default function CustomerEditor({ customer }: Props) {
        const router = useRouter();
        const [error, setError] = useState<string | null>(null);
        const [deleting, setDeleting] = useState(false);

        async function handleUpdate(values: CustomerUpdate) {
                setError(null);
                await api.updateCustomer(customer.id, values);
                router.push('/customers');
        }

        async function handleDelete() {
                setError(null);
                setDeleting(true);
                try {
                        await api.deleteCustomer(customer.id);
                        router.push('/customers');
                } catch (err: any) {
                        setError(err?.message || 'Unable to delete customer');
                        setDeleting(false);
                }
        }

        return (
                <div className="space-y-4">
                        <div className="flex items-center justify-between">
                                <Link
                                        href="/customers"
                                        className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                                >
                                        Back to Customers
                                </Link>
                                <h2 className="text-lg font-semibold text-slate-800">Edit Customer</h2>
                        </div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <CustomerForm initial={customer} onSubmit={handleUpdate} submitLabel="Save Changes" />
                        <div className="flex justify-end">
                                <button
                                        onClick={handleDelete}
                                        disabled={deleting}
                                        className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed"
                                >
                                        {deleting ? 'Deleting…' : 'Delete Customer'}
                                </button>
                        </div>
                </div>
        );
}
