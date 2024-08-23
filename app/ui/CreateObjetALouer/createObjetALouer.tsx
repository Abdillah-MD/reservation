'use client'

import { uploadFile } from "@/app/lib/uploadBlob.action";
import Image from "next/image"
import { FormEventHandler, useState } from "react"

const CreateObjet = () => {
    const [data, setData] = useState({
        cover: '',
        productName: '',
        reservation: [{
            startDate: '',
            endDate: '',
        }],
    });

    const [file, setFile] = useState<File | null>(null); // État pour le fichier sélectionné
    const [previewUrl, setPreviewUrl] = useState<string | null>(null); // État pour l'URL du blob

    // Au submit 
    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        if (file) {
            // Créer une instance de FormData
            const formData = new FormData();
            // Ajouter le fichier à FormData
            formData.append('file', file);

            // Passer FormData à la fonction uploadFile
            const imageUrl = await uploadFile(formData);

            // Mettre à jour l'état avec l'URL de l'image téléchargée
            setData(prevData => {
                const newData = {
                    ...prevData,
                    cover: `${imageUrl}`
                };
                console.log('Toute la data après mise à jour :', newData); // S'assurer que l'état est bien mis à jour avant de loguer
                return newData;
            });
        } else {
            console.log('Aucun fichier sélectionné');
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
            {previewUrl && (
                <Image src={previewUrl} width={500} height={300} alt="Aperçu de l'image" />
            )}
            <form onSubmit={handleSubmit}>
                <input type="file" name="cover" id="cover" onChange={handleChange} />
                <input type="text" name="productName" id="productName" onChange={handleChange} />
                <button type="submit">Envoyer</button>
            </form>
        </>
    )
}

export default CreateObjet
