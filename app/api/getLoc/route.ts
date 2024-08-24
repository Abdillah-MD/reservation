// app/api/events/route.ts
import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/app/lib/mongodb'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidation toutes les 60 secondes

export async function GET(req: NextRequest) {
    try {
        const client = await clientPromise
        // const db = client.db("Event_Dynect");
        const db = client.db()
        const loc = await db.collection('location').find({}).sort({ metacritic: -1 }).toArray()
        return NextResponse.json(loc)
    } catch (e) {
        console.error(e)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}