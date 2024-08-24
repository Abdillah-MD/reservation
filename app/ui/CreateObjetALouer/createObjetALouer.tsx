'use client'

import { uploadFile } from "@/app/lib/uploadBlob.action";
import Image from "next/image"
import { FormEventHandler, useState } from "react"
import style from './create.module.scss'
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';
import { POST } from "@/app/api/createLoc/route";

const CreateObjet = () => {
    const [data, setData] = useState({
        productName: '',
        price: 0,
        reservation: [{
            startDate: '',
            endDate: '',
        }],
    });
    let imageUrl: string

    const [file, setFile] = useState<File | null>(null); // État pour le fichier sélectionné
    const [previewUrl, setPreviewUrl] = useState<string | null>(null); // État pour l'URL du blob

    // Au submit 
    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        try {
            // Vérifie si un fichier est renseigné
            if (file) {
                // Créer une instance de FormData
                const formData = new FormData();
                // Ajouter le fichier à FormData
                formData.append('file', file);

                // Passer FormData à la fonction uploadFile
                imageUrl = await uploadFile(formData);

                // Mettre à jour l'état avec l'URL de l'image téléchargée
                setData(prevData => {
                    const newData = {
                        ...prevData,
                    };
                    console.log('Toute la data après mise à jour :', newData); // S'assurer que l'état est bien mis à jour avant de loguer
                    return newData;
                });
            } else {
                console.log('Aucun fichier sélectionné');
            }

            // Envoie des données
            const sendData = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/createLoc`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cover: `${imageUrl}`,
                    ...data
                }),
            })

            // Si envoie réussi
            if (sendData.ok) {
                alert("Objet à loué créer avec succès !")
            } else {
                console.error('Error saving event:', await sendData.json());
                alert("Ooops une erreur surevenue lors l'envoie ")
            }

        } catch (error) {
            console.log("Ooops une erreur est surevenue :", error)
        }
    }

    // Au changement d'input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Si le champ est un fichier, mettez à jour l'état du fichier et générez une URL blob
        if (e.target.type === "file") {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) {
                setFile(selectedFile);
                const blobUrl = URL.createObjectURL(selectedFile);
                setPreviewUrl(blobUrl);
            }
        } else {
            // Sinon, mettez à jour l'état avec la valeur de l'input
            setData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    }

    return (
        <>
            <h2 className={style.formTitle}>Ajouter un bien à louer</h2>
            <form className={style.createForm} onSubmit={handleSubmit}>
                {previewUrl ? (
                    <label htmlFor="cover">
                        <Image className={style.imgPreview} src={previewUrl} width={500} height={150} alt="Aperçu de l'image" />
                    </label>
                ) : <label className={style.imgPreview} htmlFor="cover"><ImageIcon /></label>}
                <input type="file" name="cover" id="cover" onChange={handleChange} accept="image/*" />
                <input type="text" name="productName" id="productName" placeholder="Nom du bien" onChange={handleChange} />
                <input type="number" name="price" id="price" placeholder="Prix / jour" onChange={handleChange} />
                <button type="submit">Envoyer <SendIcon /></button>
            </form>
        </>
    )
}

export default CreateObjet
