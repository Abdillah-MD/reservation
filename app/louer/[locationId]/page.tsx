import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import style from "./locationId.module.scss";
import Image from 'next/image';
import ReserverForm from '@/app/ui/ReserverForm/reserverForm';

interface LocationParams {
    locationId: string;
}

interface BienEnLoc {
    _id: string;
    cover: string;
    productName: string;
    price: string;
    reservation: Array<object>;
    userId: string;
}

async function fetchLoc(locationId: string): Promise<BienEnLoc | null> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/getLocById?locationId=${locationId}`);
        if (!res.ok) {
            throw new Error('Failed to fetch events');
        }

        const product: BienEnLoc = await res.json();
        return product;
    } catch (error) {
        console.error(`Erreur lors de la récupération de l'événement: ${error}`);
        return null;
    }
}

const Page = async ({ params }: { params: LocationParams }): Promise<JSX.Element | null> => {
    const product = await fetchLoc(params.locationId);
    console.log("Je suis le produit :", product)

    return (
        <main className={style.main}>
            <h1>{"Page d'un bien loué : " + params.locationId}</h1>

            <h2>Choisissez une période de réservation :</h2>

            <div className={style.bienEnLocation}>
                <div className={style.bienEnLocation_content}>
                    <article>
                        <img src={product?.cover} width={400} height={250} alt={product?.productName} />
                        <h3>{product?.productName}</h3>
                        <p>{product?.price} €</p>
                    </article>
                </div>
                <div className={style.bienEnLocation_form}>
                    <ReserverForm locationId={params.locationId} />
                </div>
            </div>
        </main>
    );
};

export default Page;
