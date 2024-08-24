
import style from "./locationId.module.scss"

// Définition du type pour les paramètres de l'ID de l'événement
interface LocationParams {
    locationId: string;
}

const Page = async ({ params }: { params: LocationParams }): Promise<any> => {
    return (
        <>
            <main className={style.main}>
                <h1>{"Page d'un bien loué : " + params.locationId}</h1>
            </main>
        </>
    )
}

export default Page