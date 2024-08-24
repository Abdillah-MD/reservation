'use client';

import React, { useEffect, useState } from 'react';
import style from "./locationList.module.scss"
import Image from 'next/image';
import Link from 'next/link';

interface Reservation {
    startDate: string;
    endDate: string;
}

interface Location {
    _id: string;
    productName: string;
    price: number;
    cover: string; // URL de l'image du bien
    reservation: Reservation[];
    createAt: string;
    updateAt: string;
}

const LocationsList: React.FC = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch('/api/getLoc');
                if (!response.ok) {
                    throw new Error('Failed to fetch locations');
                }

                const data: Location[] = await response.json();
                setLocations(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className={style.locationList}>
            <h2>Liste des biens loués</h2>
            {locations.length === 0 ? (
                <p>Aucun bien mis en location</p>
            ) : (
                <div className={style.ListContainer}>
                    {locations.map((location) => (
                        <article key={location._id}>
                            {location.cover && <Image width={200} height={100} src={location.cover} alt={location.productName} />}
                            <h3>{location.productName}</h3>
                            <p>Price: {location.price} €/day</p>
                            <Link className={style.reservationBtn} href={`${process.env.NEXT_PUBLIC_URL}/louer/${location._id}`}>Réserver</Link>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LocationsList;
