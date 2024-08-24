'use client'

import { useState } from 'react';
import { DateRange, RangeKeyDict } from 'react-date-range';
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import style from "./locationId.module.scss";

interface LocationParams {
    locationId: string;
}

const Page = ({ params }: { params: LocationParams }) => {
    // État pour les dates de réservation
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: 'selection'
        }
    ]);

    // État pour les informations de l'utilisateur
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        phone: '',
    });

    // Gérer la soumission de la réservation
    const handleReservation = async () => {
        const reservationData = {
            locationId: params.locationId,
            startDate: state[0].startDate || new Date(), // Assurez-vous qu'il y a une date par défaut
            endDate: state[0].endDate || new Date(), // Assurez-vous qu'il y a une date par défaut
            ...userInfo,
        };

        try {
            const response = await fetch('/api/reserve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reservationData),
            });

            if (response.ok) {
                alert('Reservation successful!');
            } else {
                alert('Failed to reserve the location.');
            }
        } catch (error) {
            console.error('Error during reservation:', error);
            alert('An error occurred during the reservation.');
        }
    };

    // Gérer le changement des inputs utilisateur
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserInfo(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <>
            <main className={style.main}>
                <h1>{"Page d'un bien loué : " + params.locationId}</h1>

                <h2>Choisissez une période de réservation :</h2>

                <DateRange
                    editableDateInputs={true}
                    onChange={(item: RangeKeyDict) => setState([{
                        startDate: item.selection.startDate || new Date(),
                        endDate: item.selection.endDate || new Date(),
                        key: `${item.selection.key}`,
                    }])}
                    moveRangeOnFirstSelection={false}
                    ranges={state}
                />

                <h2>Vos informations :</h2>
                <input
                    type="text"
                    name="firstName"
                    placeholder="Prénom"
                    value={userInfo.firstName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Nom"
                    value={userInfo.lastName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={userInfo.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Adresse"
                    value={userInfo.address}
                    onChange={handleChange}
                    required
                />
                <input
                    type="tel"
                    name="phone"
                    placeholder="N° de téléphone"
                    value={userInfo.phone}
                    onChange={handleChange}
                    required
                />

                <button className={style.reserveButton} onClick={handleReservation}>
                    Réserver
                </button>
            </main>
        </>
    );
};

export default Page;
