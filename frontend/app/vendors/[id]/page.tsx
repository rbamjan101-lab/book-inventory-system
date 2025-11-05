import { notFound } from 'next/navigation'
import { api } from '@/lib/api'
import VendorEditor from './VendorEditor'

type Params = { params: { id: string } }

export default async function VendorDetailPage({ params }: Params) {
        const id = Number(params.id)
        if (!Number.isFinite(id)) {
                notFound()
        }
        try {
                const vendor = await api.getVendor(id)
                return <VendorEditor vendor={vendor} />
        } catch (err: any) {
                if (typeof err?.message === 'string' && err.message.includes('not found')) {
                        notFound()
                }
                throw err
        }
}
