"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CustomerForm from '@/components/CustomerForm';
import { api, type CustomerCreate } from '@/lib/api';

export default function NewCustomerPage() {
        const router = useRouter();

        async function handleCreate(values: CustomerCreate) {
                await api.createCustomer(values);
                router.push('/customers');
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
                                <h2 className="text-lg font-semibold text-slate-800">Add Customer</h2>
                        </div>
                        <CustomerForm onSubmit={handleCreate} submitLabel="Create Customer" />
                </div>
        );
}
