import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/app/lib/mongodb'
import { ObjectId } from 'mongodb'

export const dynamic = 'force-dynamic'
export const revalidate = 600 // Revalidation toutes les 600 secondes

export async function GET(req: NextRequest) {
    try {
        const client = await clientPromise
        const db = client.db()

        const { searchParams } = new URL(req.url)
        const locationId = searchParams.get('locationId')

        if (!locationId) {
            return new NextResponse('No ID provided', { status: 400 })
        }

        // Valider l'ID pour s'assurer qu'il est bien un ObjectId valide
        if (!ObjectId.isValid(locationId)) {
            return new NextResponse('Invalid ID format', { status: 400 })
        }

        const objectId = new ObjectId(locationId)

        const product = await db.collection('location').findOne({ _id: objectId })

        if (!product) {
            return new NextResponse('Event not found', { status: 404 })
        }

        return NextResponse.json(product)
    } catch (error) {
        console.error(error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
