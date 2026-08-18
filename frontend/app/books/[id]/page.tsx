"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import BookForm from '@/components/BookForm';
import { api, type Book } from '@/lib/api';

export default function EditBookPage() {
	const router = useRouter();
	const params = useParams();
	const id = Number(params?.id);
	const [book, setBook] = useState<Book | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!Number.isFinite(id)) return;
		api.getBook(id)
			.then(setBook)
			.catch((e) => setError(e.message || 'Failed to load book'));
	}, [id]);

	async function handleUpdate(values: Parameters<typeof api.updateBook>[1]) {
		await api.updateBook(id, values);
		router.push('/');
	}

	async function handleDelete() {
		await api.deleteBook(id);
		router.push('/');
	}

	if (!Number.isFinite(id)) return <p>Invalid ID</p>;
	if (error) return <p className="text-red-600">{error}</p>;
	if (!book) return <p>Loading...</p>;

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
                                <h2 className="text-lg font-semibold text-slate-800">Edit Book</h2>
                        </div>
			<BookForm initial={book} onSubmit={handleUpdate} submitLabel="Update" />
                        <div className="flex justify-end">
                                <button
                                        onClick={handleDelete}
                                        className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                                >
                                        Delete Book
                                </button>
                        </div>
		</div>
	);
}


