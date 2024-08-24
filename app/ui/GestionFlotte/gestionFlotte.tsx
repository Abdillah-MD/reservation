'use client';

import React, { useEffect, useState, useRef } from 'react';
import { addMonths, format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval, isBefore, isAfter } from 'date-fns';
import style from './fleet.module.scss';
import Image from 'next/image';

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

const FleetTable: React.FC = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedRange, setSelectedRange] = useState<{ carId: string; startDate: Date; endDate: Date } | null>(null);
    const [dragging, setDragging] = useState<boolean>(false);
    const tableRef = useRef<HTMLTableElement | null>(null);

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
                console.error(err.message);
            }
        };

        fetchLocations();
    }, []);

    const months = Array.from({ length: 5 }, (_, i) => addMonths(new Date(), i));

    const daysInMonth = (month: Date) => eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });

    const handleDateSelection = (carId: string, date: Date) => {
        if (!selectedRange) {
            // Si aucune plage n'est sélectionnée, sélectionnez la date comme plage unique
            setSelectedRange({ carId, startDate: date, endDate: date });
        } else if (selectedRange.carId === carId) {
            // Si la même voiture est sélectionnée, mettez à jour la plage de dates
            setSelectedRange({
                carId,
                startDate: isBefore(date, selectedRange.startDate) ? date : selectedRange.startDate,
                endDate: isAfter(date, selectedRange.endDate) ? date : selectedRange.endDate,
            });
        } else {
            // Si une autre voiture est sélectionnée, réinitialisez la plage
            setSelectedRange({ carId, startDate: date, endDate: date });
        }
    };

    const handleMouseDown = (carId: string, date: Date) => {
        setDragging(true);
        handleDateSelection(carId, date);
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    const handleMouseMove = (carId: string, date: Date) => {
        if (dragging) {
            handleDateSelection(carId, date);
        }
    };

    // Prevent default behavior while dragging
    const preventDefaultBehavior = (event: MouseEvent) => {
        event.preventDefault();
    };

    useEffect(() => {
        const table = tableRef.current;

        // Attach event listeners for preventing default behavior
        window.addEventListener('mousemove', preventDefaultBehavior);
        window.addEventListener('mousedown', preventDefaultBehavior);
        window.addEventListener('mouseup', preventDefaultBehavior);

        return () => {
            window.removeEventListener('mousemove', preventDefaultBehavior);
            window.removeEventListener('mousedown', preventDefaultBehavior);
            window.removeEventListener('mouseup', preventDefaultBehavior);
        };
    }, []);

    return (
        <div className={style.container}>
            <div className={style.monthsContainer}>
                {months.map((month) => (
                    <div key={month.toString()} className={style.monthHeader}>
                        {format(month, 'MMMM yyyy')}
                    </div>
                ))}
            </div>

            <div className={style.tableContainer}>
                <table
                    className={style.fleetTable}
                    ref={tableRef}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={() => setDragging(false)}
                >
                    <thead>
                        <tr>
                            <th style={{ width: '200px' }} className={style.sticky_col}>Véhicule</th>
                            {months.flatMap((month) =>
                                daysInMonth(month).map((day) => (
                                    <th key={day.toString()} className={style.dateHeader}>
                                        {format(day, 'dd/MM')}
                                    </th>
                                ))
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {locations.map((location) => (
                            <tr key={location._id}>
                                <td style={{ width: '230px' }} className={style.bienALouer}>
                                    <Image src={location.cover} width={50} height={50} alt={location.productName} />
                                    <p>{location.productName}</p>
                                </td>
                                {months.flatMap((month) =>
                                    daysInMonth(month).map((day) => {
                                        const isReserved = location.reservation.some((reservation) =>
                                            isWithinInterval(day, { start: new Date(reservation.startDate), end: new Date(reservation.endDate) })
                                        );
                                        const isSelected =
                                            selectedRange &&
                                            selectedRange.carId === location._id &&
                                            isWithinInterval(day, { start: selectedRange.startDate, end: selectedRange.endDate });

                                        return (
                                            <td
                                                key={day.toString()}
                                                className={`${style.dayCell} ${isReserved ? style.reserved : ''} ${isSelected ? style.selected : ''}`}
                                                onMouseDown={() => handleMouseDown(location._id, day)}
                                                onMouseEnter={() => handleMouseMove(location._id, day)}
                                            ></td>
                                        );
                                    })
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedRange && (
                <button className={style.confirmButton} onClick={() => console.log('Confirmer la réservation')}>
                    Confirmer la réservation pour {locations.find((loc) => loc._id === selectedRange.carId)?.productName}
                </button>
            )}
        </div>
    );
};

export default FleetTable;
