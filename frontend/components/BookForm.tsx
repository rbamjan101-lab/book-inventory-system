"use client";

import { useMemo, useState } from 'react';
import type { BookCreate, BookUpdate, Book } from '@/lib/api';

type Props = {
	initial?: Partial<Book>;
	onSubmit: (values: BookCreate | BookUpdate) => Promise<void> | void;
	submitLabel?: string;
};

export default function BookForm({ initial, onSubmit, submitLabel = 'Save' }: Props) {
	const [title, setTitle] = useState(initial?.title ?? '');
	const [author, setAuthor] = useState(initial?.author ?? '');
	const [isbn, setIsbn] = useState(initial?.isbn ?? '');
	const [quantity, setQuantity] = useState<number>(initial?.quantity ?? 0);
	const [price, setPrice] = useState<number>(Number(initial?.price ?? 0));
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const fieldErrors = useMemo(() => {
		const errs: Record<string, string> = {};
		if (!title.trim()) errs.title = 'Title is required';
		if (!author.trim()) errs.author = 'Author is required';
		if (!Number.isFinite(quantity) || quantity < 0) errs.quantity = 'Quantity must be 0 or greater';
		if (!Number.isFinite(price) || price < 0) errs.price = 'Price must be 0 or greater';
		return errs;
	}, [title, author, quantity, price]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		if (Object.keys(fieldErrors).length > 0) {
			return;
		}
		setLoading(true);
		try {
			await onSubmit({
				title: title.trim(),
				author: author.trim(),
				isbn: (isbn || '').trim() || undefined,
				quantity,
				price,
			});
		} catch (err: any) {
			setError(err?.message || 'Failed to submit');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<label className="flex flex-col gap-1">
					<span className="text-sm font-medium">Title</span>
					<input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
						aria-invalid={!!fieldErrors.title}
						className={fieldErrors.title ? 'border-red-500' : ''}
					/>
					{fieldErrors.title && <span className="text-xs text-red-600">{fieldErrors.title}</span>}
				</label>
				<label className="flex flex-col gap-1">
					<span className="text-sm font-medium">Author</span>
					<input
						value={author}
						onChange={(e) => setAuthor(e.target.value)}
						required
						aria-invalid={!!fieldErrors.author}
						className={fieldErrors.author ? 'border-red-500' : ''}
					/>
					{fieldErrors.author && <span className="text-xs text-red-600">{fieldErrors.author}</span>}
				</label>
				<label className="flex flex-col gap-1">
					<span className="text-sm font-medium">ISBN</span>
					<input value={isbn ?? ''} onChange={(e) => setIsbn(e.target.value)} />
				</label>
				<label className="flex flex-col gap-1">
					<span className="text-sm font-medium">Quantity</span>
					<input
						type="number"
						min={0}
						value={quantity}
						onChange={(e) => setQuantity(Number(e.target.value))}
						required
						aria-invalid={!!fieldErrors.quantity}
						className={fieldErrors.quantity ? 'border-red-500' : ''}
					/>
					{fieldErrors.quantity && <span className="text-xs text-red-600">{fieldErrors.quantity}</span>}
				</label>
				<label className="flex flex-col gap-1">
					<span className="text-sm font-medium">Price</span>
					<input
						type="number"
						min={0}
						step="0.01"
						value={price}
						onChange={(e) => setPrice(Number(e.target.value))}
						required
						aria-invalid={!!fieldErrors.price}
						className={fieldErrors.price ? 'border-red-500' : ''}
					/>
					{fieldErrors.price && <span className="text-xs text-red-600">{fieldErrors.price}</span>}
				</label>
			</div>
			{error && <p className="text-sm text-red-600">{error}</p>}
			<div className="flex gap-2">
				<button type="submit" disabled={loading || Object.keys(fieldErrors).length > 0} className="btn btn-primary">
					{loading ? 'Saving...' : submitLabel}
				</button>
			</div>
		</form>
	);
}


