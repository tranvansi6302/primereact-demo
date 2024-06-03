import { useState } from 'react'
import axios from 'axios'

export default function CreateProduct() {
    const [file, setFile] = useState(null)
    const [name, setName] = useState('')

    const submitForm = (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('product', JSON.stringify({ name: name }))
        formData.append('files', file)

        axios
            .post('/api/v1/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <form onSubmit={submitForm}>
            <label>
                Product Name:
                <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
                Product Image:
                <input type='file' onChange={(e) => setFile(e.target.files[0])} />
            </label>
            <button type='submit'>Upload</button>
        </form>
    )
}
