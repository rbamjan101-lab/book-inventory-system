import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
	title: 'Book Inventory',
	description: 'Inventory management system for books',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className="min-h-screen">
				<header className="border-b bg-white">
					<div className="mx-auto max-w-5xl px-4 py-4">
						<h1 className="text-xl font-semibold">Book Inventory</h1>
					</div>
				</header>
				<main className="mx-auto max-w-5xl px-4 py-6">
					{children}
				</main>
			</body>
		</html>
	)
}


