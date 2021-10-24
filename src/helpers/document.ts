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
    code: string
    type?: 'code' | 'text'
}

export const save = () => {
    const queryClient = useQueryClient()
    return useMutation(
        ALL_DOCS,
        ({ id, title, content, code }: Document) => {
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
                    code,
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

export const pdfBuffer = async (filename: string, id: string) => {
    return fetch(`${url}/document/download-pdf`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            _id: id,
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

export const executeCode = (data: string) => {
    return fetch('https://execjs.emilfolino.se/code', {
        body: JSON.stringify({ code: btoa(data) }),
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
    })
        .then((response) => {
            return response.json()
        })
        .then((result) => {
            return atob(result.data)
        })
}
