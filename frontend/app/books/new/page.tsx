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
				<h2 className="text-lg font-semibold">Add Book</h2>
			</div>
			<BookForm onSubmit={handleCreate} submitLabel="Create" />
		</div>
	);
}


