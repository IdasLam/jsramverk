import { useMutation, useQuery, useQueryClient } from 'react-query'

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
    const {
        isLoading: isAllDocumentsLoading,
        refetch: refetchAll,
        error: allDocumentsError,
        data: allDocuments,
    } = useQuery(ALL_DOCS, () =>
        fetch('http://127.0.0.1:1337/document/all')
            .then((res) => res.json())
            .then(({ data }) => data),
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
        () =>
            fetch('http://127.0.0.1:1337/document/find', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                }),
            })
                .then((res) => res.json())
                .then(({ data }) => data),
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
            fetch('http://127.0.0.1:1337/document/save', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
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
            fetch('http://127.0.0.1:1337/document/delete', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
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
