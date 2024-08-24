import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
    try {
        // Connexion à la database
        const client = await clientPromise
        const db = client.db()
        const userLoc = db.collection("location")
        console.log("Connexion à la database réussie !")

        // Récupérér les données envoyé par le user
        const body = await request.json()
        console.log(body)

        console.log("Ma location à enregistré dans la db : ", body)

        const saveEvent = await userLoc.insertOne({
            _id: new ObjectId(),
            ...body,
            userId: 'Abdillah',
            createAt: new Date(Date.now()),
            updateAt: new Date(Date.now()),
        })

        console.log("Bien loué qui est enregistré dans la db :", saveEvent)

        return new NextResponse(JSON.stringify({message: "Location créé avec succès !"}), { status: 201});

    } catch (error) {
        console.error('Error create location:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}