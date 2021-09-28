import { useEffect, useState } from 'react'
import socket from '../sockets'

type Doc = {
    _id: string
    title: string
    content: string
    access: string[]
}

const useSocket = (name: string) => {
    const [data, setData] = useState<Doc | null>(null)

    useEffect(() => {
        socket.on(name, (doc: Doc) => {
            setData(doc)
        })

        return () => {
            socket.off(name)
        }
    }, [])

    return data
}

export default useSocket
