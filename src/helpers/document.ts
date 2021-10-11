import { useMutation, useQueryClient } from 'react-query'

// When on localhost use the local api otherwise use azure
const url = window.location.hostname.includes('localhost')
    ? 'http://127.0.0.1:1337'
    : 'https://jsramverk-editor-idla18.azurewebsites.net'

const ALL_DOCS = 'ALL_DOCS'

type Document = {
    id?: string
    title: string
    content: string
}

export const save = () => {
    const queryClient = useQueryClient()
    return useMutation(
        ALL_DOCS,
        ({ id, title, content }: Document) => {
            return fetch(`${url}/document/save`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    _id: id,
                    title,
                    content,
                }),
            })
                .then((res) => res.json())
                .then(({ data }) => data)
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(ALL_DOCS)
            },
        },
    )
}

export const pdfBuffer = async (filename: string) => {
    return fetch(`${url}/document/download-pdf`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            _id: '6156ee9b13757c214d6be2e9',
        }),
    })
        .then((response) => response.blob())
        .then((blob) => {
            const url = window.URL.createObjectURL(new Blob([blob]))
            const a = document.createElement('a')
            a.href = url
            a.download = `${filename}.pdf`
            document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click()
            a.remove()
        })
}
