import { useMutation, useQuery, useQueryClient } from 'react-query'

export const getAll = (shouldFetch: boolean) => {
    const {
        isLoading: isAllDocumentsLoading,
        error: allDocumentsError,
        data: allDocuments,
    } = useQuery(
        'document/all',
        () =>
            fetch('http://127.0.0.1:1337/document/all')
                .then((res) => res.json())
                .then(({ data }) => data),
        {
            enabled: shouldFetch,
        },
    )

    return { isAllDocumentsLoading, allDocumentsError, allDocuments }
}

export const getOne = (id: string) => {
    const queryClient = useQueryClient()
    const {
        isLoading: isOneDocumentLoading,
        error: oneDocumentError,
        data: oneDocument,
    } = useMutation(
        'document/find',
        () =>
            fetch('http://127.0.0.1:1337/document/find', {
                method: 'POST',
                body: JSON.stringify({
                    _id: id,
                }),
            })
                .then((res) => res.json())
                .then(({ data }) => data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('document/find')
            },
        },
    )

    return { isOneDocumentLoading, oneDocumentError, oneDocument }
}

type Document = {
    id: string
    title: string
    content: string
}

export const save = ({ id, title, content }: Document) => {
    const queryClient = useQueryClient()
    const {
        isLoading: isSaveDocumentLoading,
        error: saveDocumentError,
        data: saveDocument,
    } = useMutation(
        'document/save',
        () =>
            fetch('http://127.0.0.1:1337/document/save', {
                method: 'POST',
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
                queryClient.invalidateQueries('document/save')
            },
        },
    )

    return { isSaveDocumentLoading, saveDocumentError, saveDocument }
}

export const newDocument = () => {
    const queryClient = useQueryClient()
    const {
        isLoading: isNewDocumentLoading,
        error: newDocumentError,
        data: newDocument,
    } = useMutation(
        'document/new',
        () =>
            fetch('http://127.0.0.1:1337/document/new')
                .then((res) => res.json())
                .then(({ data }) => data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('document/new')
            },
        },
    )

    return { isNewDocumentLoading, newDocumentError, newDocument }
}

export const deleteDocument = (id: string) => {
    const queryClient = useQueryClient()
    const {
        isLoading: isDeleteDocumentLoading,
        error: deleteDocumentError,
        data: deleteDocument,
    } = useMutation(
        'document/delete',
        () =>
            fetch('http://127.0.0.1:1337/document/delete', {
                method: 'POST',
                body: JSON.stringify({
                    _id: id,
                }),
            })
                .then((res) => res.json())
                .then(({ data }) => data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('document/delete')
            },
        },
    )

    return { isDeleteDocumentLoading, deleteDocumentError, deleteDocument }
}
