import React, { FunctionComponent, useEffect, useState } from 'react'
import styled from 'styled-components'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import socket from '../sockets'

type Props = {
    doc: {
        _id: string
        title: string
        content: string
        access: string[]
    } | null
    onClose: () => void
}

const Shared: FunctionComponent<Props> = (props) => {
    const [valid, setValid] = useState(false)
    const [usernames, setUsernames] = useState('')

    useEffect(() => {
        if (usernames.length > 0) {
            setValid(true)
        } else {
            setValid(false)
        }
    }, [usernames])

    const addUsers = () => {
        const users = usernames.replace(/\s+/g, '').split(',')

        if (props.doc) {
            const updatedDoc = { ...props.doc, access: props.doc.access.concat(users) }
            socket.emit('updatedAcess', updatedDoc)
        }

        props.onClose()
    }

    const removeUser = (username: string) => {
        const updatedDoc = { ...props.doc, access: props.doc?.access.filter((user) => user !== username) }
        socket.emit('updatedAcess', updatedDoc)
    }

    return (
        <Popup>
            <div>
                <h2>Share document</h2>
                <div className="share-doc">
                    <TextField
                        id="outlined-basic"
                        label="Username, comma seperated"
                        variant="outlined"
                        onChange={(event) => setUsernames(event.target.value)}
                    />
                    <Button
                        disabled={!valid}
                        variant="outlined"
                        onClick={() => {
                            addUsers()
                        }}
                    >
                        Add
                    </Button>
                </div>
                <div className="users">
                    <h4>Users already invited</h4>
                    {props.doc?.access.map((user) => {
                        return (
                            <User key={user}>
                                <p>{user}</p>
                                <Button variant="outlined" color="secondary" onClick={() => removeUser(user)}>
                                    Remove
                                </Button>
                            </User>
                        )
                    })}
                </div>
            </div>
        </Popup>
    )
}

const Popup = styled.div`
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-image: linear-gradient(to bottom right, #c9ffda, #ea92e3);
    background-repeat: no-repeat;
    padding: 10px;
    z-index: 2000;
    width: 400px;
    cursor: grab;

    > div {
        background-color: white;
        padding: 20px;
        text-align: center;

        > .share-doc {
            column-gap: 20px;
            display: flex;
            place-content: center;

            input {
                width: 500px;
            }

            button {
                width: 50px;
                cursor: pointer;
            }
        }

        .users {
            display: grid;
            justify-content: center;
        }
    }
`

const User = styled.div`
    display: inline-flex;
    column-gap: 30px;
    align-items: center;

    button {
        height: fit-content;
    }

    p {
        min-width: 200px;
    }
`

export default Shared
