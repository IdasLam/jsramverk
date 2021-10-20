import { useEffect, useState } from 'react'
import socket from '../sockets'

export type Comment = {
    selected: string
    y: number
    comment: string
    user: string
    date: string
    _id: string
}

export type Doc = {
    _id: string
    title: string
    content: string
    access: string[]
    type: 'text' | 'code'
    code: string
    comments?: Comment[]
}

const useSocket = <T = Doc>(name: string) => {
    const [data, setData] = useState<T | null>(null)

    useEffect(() => {
        socket.on(name, (doc: T) => {
            setData(doc)
        })

        return () => {
            socket.off(name)
        }
    }, [])

    return [data, setData] as const
}

export default useSocket
