import { useEffect, useState } from 'react'
import socket from '../sockets'

export type Doc = {
    _id: string
    title: string
    content: string
    access: string[]
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
