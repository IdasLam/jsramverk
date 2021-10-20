import React, { useState } from 'react'
import styled from 'styled-components'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Tools from '../components/toolbar'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import useSocket, { Doc } from '../hooks/useSocket'
import socket from '../sockets'
import { useHistory } from 'react-router-dom'
import { logout } from '../helpers/login'
import { root } from '../helpers/root'
import MonacoEditor from 'react-monaco-editor'
import { executeCode } from '../helpers/document'
import CommentOption from '../components/comment'
import Comments from '../components/comments'

const Inline = Quill.import('blots/inline')

class Comment extends Inline {}
Comment.blotName = 'comment'
Comment.tagName = 'comment'
Quill.register(Comment)

function useQuery() {
    return new URLSearchParams(useLocation().search)
}

type CommentData = {
    selected: string
    y: number
    start: number
    end: number
}

type CommentContext = {
    display: boolean
    x: number
    y: number
    data: CommentData | null
    id: string | null
}

const Home: React.FunctionComponent = () => {
    const id = useQuery().get('id')
    const [showTitleInput, setShowTitleInput] = useState(false)
    const [allDocs, setAllDocs] = useSocket<Doc[]>('allDocs')
    const history = useHistory()
    const [doc, setDoc] = useState<Doc | null>(null)
    const [executedResponse, setExecutedResponse] = useState<string>('')
    const [commentContext, setCommentContext] = useState<CommentContext>({
        id: id,
        display: false,
        x: 0,
        y: 0,
        data: null,
    })

    useEffect(() => {
        if (allDocs === null) return
        console.log(allDocs.find((d) => d._id === id))
        setDoc(allDocs.find((d) => d._id === id) || null)
    }, [allDocs])

    useEffect(() => {
        socket.disconnected && socket.connect()
    }, [])

    useEffect(() => {
        id && socket.emit('getDoc', id)
        setExecutedResponse('')

        if (!id) {
            history.push(`${root}doc`)
            return
        }
        setCommentContext({ ...commentContext, id: id })
    }, [id])

    useEffect(() => {
        if (!doc) return
    }, [doc])

    const setData = ({ title, content }: { title?: string; content?: string }) => {
        if (allDocs !== null) {
            setAllDocs(
                allDocs.map((d) => {
                    if (d._id === id) {
                        return { ...d, title: title ?? d.title, content: content ?? d.content }
                    }

                    return d
                }),
            )
        }
    }

    console.log(doc)

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

                                if (doc?.title === '') {
                                    setData({ title: 'New title' })
                                    socket.emit('updatedDoc', {
                                        ...doc,
                                        title: 'New title',
                                    })
                                }
                            }}
                            autoFocus
                            onChange={(change) => {
                                setData({ title: change.target.value })
                                socket.emit('updatedDoc', {
                                    ...doc,
                                    title: change.target.value,
                                })
                            }}
                            value={doc?.title}
                            maxLength={22}
                        />
                    ) : id ? (
                        <h1
                            className="editable"
                            data-testid="title"
                            onClick={() => {
                                setShowTitleInput(true)
                            }}
                        >
                            {doc?.title}
                        </h1>
                    ) : (
                        <h1>JsRamverk</h1>
                    )}
                </div>
            </Header>
            <Tools allDocs={allDocs} doc={doc} setDoc={setDoc} />
            <Main>
                {id ? (
                    doc?.type === 'text' ? (
                        <div className={!!doc.comments?.length ? 'commentRow' : ''}>
                            <div
                                onContextMenu={(event) => {
                                    event?.preventDefault()

                                    const selected = window.getSelection()
                                    if (selected?.toString()) {
                                        setCommentContext({
                                            ...commentContext,
                                            display: true,
                                            x: event.clientX,
                                            y: event.clientY,
                                            data: {
                                                selected: selected?.toString(),
                                                y: event.clientY,
                                                start: (window as any).startRangeComment,
                                                end: (window as any).endRangeComment,
                                            },
                                        })
                                    }
                                }}
                            >
                                <ReactQuill
                                    modules={{ clipboard: { matchVisual: false } }}
                                    onChangeSelection={(range, source) => {
                                        if (source === 'user' && range) {
                                            ;(window as any).startRangeComment = range?.index
                                            ;(window as any).endRangeComment = range?.index + range?.length
                                        }
                                    }}
                                    value={doc?.content}
                                    onChange={(value, delta, source) => {
                                        if (source === 'user') {
                                            setDoc({ ...doc, content: value })
                                            socket.emit('updatedDoc', {
                                                ...doc,
                                                content: value,
                                            })
                                        }
                                    }}
                                />
                            </div>
                            {!!doc.comments?.length && <Comments comments={doc.comments} content={doc.content} />}
                        </div>
                    ) : doc?.type === 'code' ? (
                        <>
                            <Editor>
                                <MonacoEditor
                                    value={doc.code}
                                    language="javascript"
                                    theme="vs-dark"
                                    height="50vh"
                                    width="100%"
                                    onChange={(value) => {
                                        // update locally
                                        setDoc({ ...doc, code: value })
                                        socket.emit('updatedDoc', {
                                            ...doc,
                                            code: value,
                                        })
                                    }}
                                />
                                <pre className="output">
                                    <p>Output:</p>
                                    <p>{executedResponse}</p>
                                </pre>
                            </Editor>

                            <Button
                                execute
                                onClick={async () => {
                                    const res = await executeCode(doc.code)
                                    setExecutedResponse(res)
                                }}
                            >
                                Execute code
                            </Button>
                        </>
                    ) : null
                ) : (
                    <h2>Please choose a document</h2>
                )}
                {commentContext.display && (
                    <CommentOption
                        id={commentContext.id}
                        x={commentContext.x}
                        y={commentContext.y}
                        data={commentContext.data}
                        text={doc?.content}
                        onClose={() => setCommentContext({ ...commentContext, display: false, x: 0, y: 0, data: null })}
                    />
                )}
            </Main>
            <Button
                onClick={async () => {
                    socket.emit('close')
                    const out = await logout()

                    if (out.info) {
                        history.push(root)
                    }
                }}
            >
                Logout
            </Button>
        </Container>
    )
}

const Editor = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;

    .output {
        background-color: #313131;
        padding: 0px 20px;
        color: white;
        margin: unset;

        p:nth-child(2) {
            font-weight: bold;
        }
    }
`

const Button = styled.button<{ execute?: boolean }>`
    position: absolute;
    bottom: ${(props) => (props.execute ? '30%' : '5%')};
    right: ${(props) => (props.execute ? '52%' : '5%')};
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

    .editable {
        box-sizing: border-box;
        border: 2px solid transparent;
        font-family: sans-serif;
    }

    .editable:hover {
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

    comment {
        background-color: #c7fd93;
    }

    .commentRow {
        display: grid;
        grid-template-columns: 2fr 1fr;
    }
`

export default Home
