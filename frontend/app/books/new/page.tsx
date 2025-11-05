"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BookForm from '@/components/BookForm';
import { api } from '@/lib/api';

export default function NewBookPage() {
	const router = useRouter();

	async function handleCreate(values: Parameters<typeof api.createBook>[0]) {
		await api.createBook(values);
		router.push('/');
	}

	return (
		<div className="space-y-4">
                        <div className="flex items-center justify-between">
                                <Link
                                        href="/"
                                        className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                                >
                                        <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                        >
                                                <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Back
                                </Link>
                                <h2 className="text-lg font-semibold text-slate-800">Add Book</h2>
                        </div>
			<BookForm onSubmit={handleCreate} submitLabel="Create" />
		</div>
	);
}


