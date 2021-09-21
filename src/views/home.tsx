import React, { useState } from 'react'
import styled from 'styled-components'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Tools from '../components/toolbar'
import * as document from '../helpers/document'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import useSocket from '../hooks/useSocket'
import socket from '../sockets'
import { useHistory } from 'react-router-dom'

function useQuery() {
    return new URLSearchParams(useLocation().search)
}

const Home: React.FunctionComponent = () => {
    const id = useQuery().get('id')
    const [title, setTitle] = useState('New title')
    const [content, setContent] = useState('')
    const [showTitleInput, setShowTitleInput] = useState(false)
    const doc = useSocket('doc')
    const saveDocument = document.save()
    const history = useHistory()

    useEffect(() => {
        setTitle('New Title')
        setContent('')
    }, [])

    useEffect(() => {
        socket.emit('create', { id })
    }, [id])

    useEffect(() => {
        if (!doc) return

        setTitle(doc.title)
        setContent(doc.content)
    }, [doc])

    return (
        <Container>
            <Header>
                <div>
                    <img src="https://img.icons8.com/color-glass/48/000000/document.png" />

                    {showTitleInput ? (
                        <input
                            data-testid="input"
                            type="text"
                            onBlur={() => {
                                setShowTitleInput(false)
                                if (title === '') {
                                    setTitle('New title')
                                }
                            }}
                            autoFocus
                            onChange={(change) => {
                                setTitle(change.target.value)
                                socket.emit('updatedDoc', { _id: id, title: change.target.value, content })
                            }}
                            value={title}
                            maxLength={22}
                        />
                    ) : (
                        <h1
                            data-testid="title"
                            onClick={() => {
                                setShowTitleInput(true)
                            }}
                        >
                            {title}
                        </h1>
                    )}
                </div>
                <button
                    data-testid="saveButton"
                    onClick={() => {
                        if (id) {
                            saveDocument.mutate({ id, title, content })
                        }
                    }}
                >
                    Save
                </button>
            </Header>
            <Tools />
            <Main>
                <ReactQuill
                    value={content}
                    onChange={(value) => {
                        setContent(value)
                        socket.emit('updatedDoc', { _id: id, title, content: value })
                    }}
                />
                <Button
                    onClick={() => {
                        localStorage.removeItem('token')
                        history.push('/')
                        socket.emit('close')
                    }}
                >
                    Logout
                </Button>
            </Main>
        </Container>
    )
}

const Button = styled.button`
    position: absolute;
    bottom: 5%;
    right: 5%;
    background-color: #ffffff94;
    border: 1px solid whitesmoke;
    border-radius: 4px;
    padding: 10px 20px;
    height: fit-content;
    align-self: center;
    transition: ease-in-out 0.2s;
    cursor: pointer;

    :hover {
        background-color: #fffffff2;
    }
`

const Container = styled.div`
    padding: 20px 30px;
`
const Header = styled.header`
    display: flex;
    justify-content: space-between;

    div {
        display: flex;
        align-items: center;

        img {
            width: 50px;
            height: 50px;
        }
    }

    button {
        background-color: #ffffff94;
        border: 1px solid whitesmoke;
        border-radius: 4px;
        padding: 10px 20px;
        height: fit-content;
        align-self: center;
        transition: ease-in-out 0.2s;
        cursor: pointer;
    }

    button:hover {
        background-color: #fffffff2;
    }

    input {
        box-sizing: border-box;
        background-color: transparent;
        border: 2px solid black;
        font-size: 2em;
        margin: 0.67em 0;
        padding: unset;
        font-weight: bold;
        font-family: sans-serif;
    }

    h1 {
        box-sizing: border-box;
        border: 2px solid transparent;
        font-family: sans-serif;
    }

    h1:hover {
        border: 2px solid black;
    }
`

const Main = styled.main`
    background-color: #ffffff94;
    padding: 30px 20px;
    border-radius: 4px;
    border: 1px solid whitesmoke;

    .ql-editor {
        height: 30vh;
    }

    .quill {
        background-color: white;
    }
`

export default Home
