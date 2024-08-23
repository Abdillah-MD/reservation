'use client'

import { useState } from "react"

const CreateObjet = () => {
    const [data, setData] = useState({
        cover: '',
        productName: '',
        reservation: [{
            startDate: '',
            endDate: '',
        }],
    })

    // Au submit 
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log(data)
    }

    // Au changement d'input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <input type="file" name="cover" id="cover" onChange={handleChange} />
                <input type="text" name="productName" id="productName" onChange={handleChange} />
                <button type="submit">Envoyer</button>
            </form>
        </>
    )
}

export default CreateObjet