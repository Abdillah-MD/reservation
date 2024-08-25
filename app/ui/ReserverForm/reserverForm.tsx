'use client';

import { useState } from 'react';
import { DateRange, RangeKeyDict } from 'react-date-range';
import { addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import style from "@/app/louer/[locationId]/locationId.module.scss";
import { useEffect } from 'react';

interface ReserverFormProps {
    locationId: string,
}

const ReserverForm: React.FC<ReserverFormProps> = ({ locationId }) => {
    // État pour les dates de réservation
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 0),
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

    // État pour les heures de réservation
    const [timeInfo, setTimeInfo] = useState({
        startTime: '12:00',
        endTime: '14:00',
    });

    // Fonction pour combiner une date et une heure en utilisant l'heure locale
    const combineDateAndTime = (date: Date, time: string): Date => {
        const [hours, minutes] = time.split(':').map(Number);
        const newDate = new Date(date);

        // Ajuster les heures et les minutes localement
        newDate.setHours(hours, minutes, 0, 0);

        // Ajuster le décalage UTC pour obtenir l'heure locale correcte
        const offset = newDate.getTimezoneOffset() * 60000;
        return new Date(newDate.getTime() - offset);
    };

    // Gérer la soumission de la réservation
    const handleReservation = async () => {
        const reservationData = {
            locationId: locationId,
            startDate: state[0].startDate || new Date(),
            endDate: state[0].endDate || new Date(),
            startTime: timeInfo.startTime,
            endTime: timeInfo.endTime,
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
                alert('Réservation réussie!');
            } else {
                alert('Échec de la réservation.');
            }
        } catch (error) {
            console.error('Erreur lors de la réservation:', error);
            alert('Une erreur s\'est produite lors de la réservation.');
        }
    };

    // Gérer le changement des inputs utilisateur
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'startTime' || name === 'endTime') {
            setTimeInfo(prevState => ({
                ...prevState,
                [name]: value,
            }));

            setState(prevState => [
                {
                    ...prevState[0],
                    startDate: name === 'startTime' ? combineDateAndTime(prevState[0].startDate, value) : prevState[0].startDate,
                    endDate: name === 'endTime' ? combineDateAndTime(prevState[0].endDate, value) : prevState[0].endDate,
                }
            ]);
        } else {
            setUserInfo(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    // Au submit 
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        console.log("Les dates envoyé : " + JSON.stringify(state))
        console.log("Les dates envoyé : " + JSON.stringify(timeInfo))
    }

    useEffect(() => {
        console.log("Les dates choisis : " + JSON.stringify(state))
        console.log("Les dates choisis : " + JSON.stringify(timeInfo))

    }, [state, timeInfo])

    return (
        <>
            <DateRange
                locale={fr}
                months={1}
                direction='vertical'
                minDate={addDays(new Date(), 0)}
                maxDate={addDays(new Date(), 180)}
                editableDateInputs={true}
                onChange={(item: RangeKeyDict) => setState([{
                    startDate: combineDateAndTime(item.selection.startDate || new Date(), timeInfo.startTime),
                    endDate: combineDateAndTime(item.selection.endDate || new Date(), timeInfo.endTime),
                    key: `${item.selection.key}`,
                }])}
                moveRangeOnFirstSelection={false}
                // scroll={{ enabled: true }}
                ranges={state}
            />

            <form className={style.reserver} onSubmit={handleSubmit}>
                <h3>Choisissez l&apos;heure de réservation :</h3>
                <div className={style.reserver_selectTime}>
                    <label>
                        Heure de début: <span>{timeInfo.startTime}</span>
                        <input
                            type="time"
                            name="startTime"
                            value={timeInfo.startTime}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Heure de fin: <span>{timeInfo.endTime}</span>
                        <input
                            type="time"
                            name="endTime"
                            value={timeInfo.endTime}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>

                <h3>Vos informations :</h3>
                <div className={style.reserver_userInfoPerso}>
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
                </div>
                <div className={style.reserver_userInfoPerso}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={userInfo.email}
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
                </div>

                <input
                    type="text"
                    name="address"
                    placeholder="Adresse"
                    value={userInfo.address}
                    onChange={handleChange}
                    required
                />
                <div className={style.submit}>
                    <button type='submit' className={style.reserveButton} onClick={handleReservation}>
                        Réserver
                    </button>
                </div>
            </form>
        </>
    )
}

export default ReserverForm;
