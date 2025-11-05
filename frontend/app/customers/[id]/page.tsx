import { notFound } from 'next/navigation'
import { api } from '@/lib/api'
import CustomerEditor from './CustomerEditor'

type Params = { params: { id: string } }

export default async function CustomerDetailPage({ params }: Params) {
        const id = Number(params.id)
        if (!Number.isFinite(id)) {
                notFound()
        }
        try {
                const customer = await api.getCustomer(id)
                return <CustomerEditor customer={customer} />
        } catch (err: any) {
                if (typeof err?.message === 'string' && err.message.includes('not found')) {
                        notFound()
                }
                throw err
        }
}
