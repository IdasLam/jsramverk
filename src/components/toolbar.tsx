import React from 'react'
import { useState } from 'react'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import * as document from '../helpers/document'
import { useHistory, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Shared from './shared'
import socket from '../sockets'
import { Doc } from '../hooks/useSocket'
import { root } from '../helpers/root'
import { documentData } from '../helpers/graphql'

function useQuery() {
    return new URLSearchParams(useLocation().search)
}

type ToolsProps = {
    allDocs: Doc[] | null
    doc: Doc | null
    setDoc: React.Dispatch<React.SetStateAction<Doc | null>>
}

const Tools: FunctionComponent<ToolsProps> = (props) => {
    const { allDocs, doc: currentDoc, setDoc } = props
    const id = useQuery().get('id')
    const newDoc = document.save()
    const [displayDeletePromt, setDisplayDeletePromt] = useState(false)
    const history = useHistory()
    const [displayRaw, setDisplayRaw] = useState(false)

    const [selectedValue, setSelectedValue] = useState(id ?? 'all')
    const [displayShared, setDisplayShared] = useState(false)
    const [rawData, setRawData] = useState<string>('')

    const download = async () => {
        await document.pdfBuffer(currentDoc?.title ?? 'file')
    }

    const getRaw = async () => {
        if (!id) return

        const data = await documentData(id)
        setRawData(data)
    }

    useEffect(() => {
        socket.emit('login')
    }, [])

    useEffect(() => {
        if (id) {
            setSelectedValue(id)
        }
    }, [id])

    useEffect(() => {
        if (!displayRaw) return

        getRaw()
    }, [displayRaw])

    useEffect(() => {
        if (id && Array.isArray(allDocs)) {
            const found = allDocs.filter((document) => document._id === id)
            if (found.length === 0) {
                setSelectedValue('all')
                history.push(`${root}doc`)
                return
            }

            setSelectedValue(id)
        }
    }, [allDocs])

    return (
        <ToolBar>
            <div>
                <select
                    value={selectedValue}
                    onChange={(event) => {
                        setSelectedValue(event.target.value)
                        if (event.target.value !== 'all') {
                            history.push('?id=' + event.target.value)
                        }

                        if (id) {
                            socket.emit('leave', id)
                        }

                        socket.emit('create', event.target.value)
                    }}
                >
                    <option value="all" disabled>
                        All Documents
                    </option>
                    {Array.isArray(allDocs)
                        ? allDocs.map((doc) => {
                              return (
                                  <option key={doc._id} value={doc._id}>
                                      {doc.title}
                                  </option>
                              )
                          })
                        : null}
                </select>
            </div>
            {id && (
                <>
                    <ButtonDelete data-testid="deleteButton" onClick={() => setDisplayDeletePromt(true)}>
                        Delete
                    </ButtonDelete>
                    <Button onClick={() => setDisplayShared(true)}>Share</Button>
                    <Button onClick={() => setDisplayRaw(true)}>Raw-document</Button>
                    <Button
                        onClick={() => {
                            socket.emit('changeType', currentDoc)
                        }}
                    >
                        {currentDoc?.type === 'text' ? 'code mode' : 'text mode'}
                    </Button>
                    <Button onClick={() => download()}>Download</Button>
                </>
            )}
            <ButtonAccept
                data-testid="newDoc"
                onClick={() => {
                    newDoc.mutateAsync({ title: 'New title', content: '', code: '' }).then((data) => {
                        history.push('?id=' + data._id)
                        socket.emit('create', data._id)
                    })
                }}
            >
                New File
            </ButtonAccept>
            {displayRaw && (
                <section data-testid="popup">
                    <Popup>
                        <div>
                            <h2>Raw-data</h2>
                            <pre>{rawData}</pre>
                            <div>
                                <ButtonDelete onClick={() => setDisplayRaw(false)}>Close</ButtonDelete>
                            </div>
                        </div>
                    </Popup>
                </section>
            )}
            {displayDeletePromt && (
                <section data-testid="popup">
                    <Popup>
                        <div>
                            <h2>Are you sure that you want to delete this file?</h2>
                            <div>
                                <ButtonDelete
                                    onClick={() => {
                                        if (id) {
                                            // delete
                                            history.push(`${root}doc`)

                                            socket.emit('delete', id, () => {
                                                setDisplayDeletePromt(false)

                                                setSelectedValue('all')
                                            })
                                        }
                                    }}
                                >
                                    Yes
                                </ButtonDelete>
                                <ButtonAccept data-testid="close" onClick={() => setDisplayDeletePromt(false)}>
                                    No
                                </ButtonAccept>
                            </div>
                        </div>
                    </Popup>
                </section>
            )}
            {displayShared && (
                <>
                    <section onClick={() => setDisplayShared(false)}></section>
                    <Shared doc={currentDoc} onClose={() => setDisplayShared(false)} />
                </>
            )}
        </ToolBar>
    )
}

const Popup = styled.div`
    position: absolute;
    z-index: 200;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-image: linear-gradient(to bottom right, #c9ffda, #ea92e3);
    background-repeat: no-repeat;
    padding: 10px;

    > div {
        background-color: white;
        padding: 20px;
        text-align: center;

        > div {
            column-gap: 20px;
            display: flex;
            place-content: center;

            button {
                width: 50px;
            }
        }

        pre {
            text-align: left;
            background-color: #222222;
            color: white;
            padding: 10px 10px;
        }
    }
`
const Button = styled.button`
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

const ButtonDelete = styled.button`
    background-color: #ff7a7a92;
    border: none;
    height: 40px;
    cursor: pointer;
    transition: ease-in-out 0.2s;
    border-radius: 4px;

    :hover {
        background-color: #fa5c5c93;
    }
`

const ButtonAccept = styled.button`
    background-color: #95ff7a92;
    border: none;
    height: 40px;
    cursor: pointer;
    transition: ease-in-out 0.2s;
    border-radius: 4px;

    :hover {
        background-color: #61fa5c92;
    }
`

const ToolBar = styled.div`
    border-top: 1px solid white;
    margin-bottom: 30px;
    padding-left: 20px;
    cursor: pointer;
    display: flex;
    place-items: center;
    padding-top: 20px;
    column-gap: 20px;

    select {
        height: 40px;
        background-color: #ffffff94;
        border: 1px solid whitesmoke;
        transition: ease-in-out 0.2s;
        border-radius: 4px;
    }

    select:hover {
        background-color: #ffffffbe;
    }

    section {
        width: 100vw;
        height: 100vh;
        background-color: #00000039;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 200;
        cursor: grab;
    }
`

export default Tools
