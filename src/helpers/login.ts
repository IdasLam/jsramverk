import { useMutation, useQuery, useQueryClient } from 'react-query'

// When on localhost use the local api otherwise use azure
const url = window.location.hostname.includes('localhost')
    ? 'http://127.0.0.1:1337'
    : 'https://jsramverk-editor-idla18.azurewebsites.net'

const LOGIN = 'LOGIN'

type credentials = {
    password: string
    username: string
}

export const login = () => {
    const queryClient = useQueryClient()
    return useMutation(
        LOGIN,
        ({ password, username }: credentials) =>
            fetch(`${url}/login`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    password,
                    username,
                }),
            })
                .then((res) => res.json())
                .then(({ data }) => data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(LOGIN)
            },
        },
    )
}

export const signup = () => {
    const queryClient = useQueryClient()

    return useMutation(
        LOGIN,
        ({ password, username }: credentials) =>
            fetch(`${url}/signup`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    password,
                    username,
                }),
            })
                .then((res) => res.json())
                .then(({ data }) => data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(LOGIN)
            },
        },
    )
}

export const isLoggedIn = () => {
    return useQuery('loggedin', () => fetch(`${url}/status`, { credentials: 'include' }).then((res) => res.json()))
}

export const logout = async () => {
    return await fetch(`${url}/logout`, { method: 'GET', credentials: 'include' }).then((res) => res.json())
}
