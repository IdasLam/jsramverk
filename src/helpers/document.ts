import { useMutation, useQuery, useQueryClient } from 'react-query'

// When on localhost use the local api otherwise use azure
const url = window.location.hostname.includes('localhost')
    ? 'http://127.0.0.1:1337'
    : 'https://jsramverk-editor-idla18.azurewebsites.net'

type DocumentType = {
    _id: string
    title: string
    content: string
}

type GetAll = {
    isAllDocumentsLoading: boolean
    refetchAll: () => void
    allDocumentsError: unknown
    allDocuments: DocumentType[]
}

const ALL_DOCS = 'ALL_DOCS'

export const getAll = (): GetAll => {
    const token = localStorage.getItem('token')
    const {
        isLoading: isAllDocumentsLoading,
        refetch: refetchAll,
        error: allDocumentsError,
        data: allDocuments,
    } = useQuery(
        ALL_DOCS,
        () => {
            return fetch(`${url}/document/all`, {
                headers: {
                    'x-access-token': localStorage.getItem('token') ?? '',
                },
            })
                .then((res) => res.json())
                .then(({ data }) => data)
        },
        {
            enabled: token !== null,
        },
    )

    return { isAllDocumentsLoading, refetchAll, allDocumentsError, allDocuments }
}

type GetOne = {
    isOneDocumentLoading: boolean
    oneDocumentError: unknown
    oneDocument: DocumentType
}

export const getOne = (id: string | null): GetOne => {
    const {
        isLoading: isOneDocumentLoading,
        error: oneDocumentError,
        data: oneDocument,
    } = useQuery(
        [ALL_DOCS, id],
        () => {
            return fetch(`${url}/document/find`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-access-token': localStorage.getItem('token') ?? '',
                },
                body: JSON.stringify({
                    id,
                }),
            })
                .then((res) => res.json())
                .then(({ data }) => data)
        },
        {
            enabled: !!id,
        },
    )

    return { isOneDocumentLoading, oneDocumentError, oneDocument }
}

type Document = {
    id?: string
    title: string
    content: string
}

export const save = () => {
    const queryClient = useQueryClient()
    return useMutation(
        ALL_DOCS,
        ({ id, title, content }: Document) =>
            fetch(`${url}/document/save`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-access-token': localStorage.getItem('token') ?? '',
                },
                body: JSON.stringify({
                    _id: id,
                    title,
                    content,
                }),
            })
                .then((res) => res.json())
                .then(({ data }) => data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(ALL_DOCS)
            },
        },
    )
}

// export const newDocument = () => {
//     const queryClient = useQueryClient()
//     return useMutation(
//         ALL_DOCS,
//         () =>
//             fetch('http://127.0.0.1:1337/document/new')
//                 .then((res) => res.json())
//                 .then(({ data }) => data),
//         {
//             onSuccess: () => {
//                 queryClient.invalidateQueries('document/new')
//             },
//         },
//     )
// }

export const deleteDocument = () => {
    const queryClient = useQueryClient()
    return useMutation(
        ALL_DOCS,
        (id: string) =>
            fetch(`${url}/document/delete`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-access-token': localStorage.getItem('token') ?? '',
                },
                body: JSON.stringify({
                    _id: id,
                }),
            }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(ALL_DOCS)
            },
        },
    )
}
