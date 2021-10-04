const url = window.location.hostname.includes('localhost')
    ? 'http://127.0.0.1:1337'
    : 'https://jsramverk-editor-idla18.azurewebsites.net'

export const documentData = (id: string) => {
    return fetch(`${url}/graphql`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            query: `{
                document (id: "${id}") {
                    title
                    content
                    access
                }
            }`,
        }),
    })
        .then((res) => res.json())
        .then(({ data }) => {
            return JSON.stringify(data, null, 6)
        })
}
