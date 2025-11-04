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
				<Link href="/">
					<button type="button" className="btn border border-gray-300 text-gray-700 hover:bg-gray-100">
						<span className="inline-flex items-center gap-2">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
								<path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
							Back
						</span>
					</button>
				</Link>
				<h2 className="text-lg font-semibold">Edit Book</h2>
			</div>
			<BookForm initial={book} onSubmit={handleUpdate} submitLabel="Update" />
			<div>
				<button onClick={handleDelete} className="btn btn-secondary">Delete</button>
			</div>
		</div>
	);
}


