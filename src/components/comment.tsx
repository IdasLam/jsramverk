import { TextField, Button } from '@mui/material'
import React, { useState } from 'react'
import styled from 'styled-components'
import socket from '../sockets'

type Comment = {
    x: number
    y: number
    onClose: () => void
    data: CommentData | null
    id: string | null
    text?: string
}

type CommentData = {
    selected: string
    y: number
    start: number
    end: number
}

const CommentOption: React.FC<Comment> = ({ x, y, onClose, data, id }) => {
    const [comment, setCommet] = useState<string>()

    return (
        <>
            <Bg onClick={() => onClose()} />
            <Container x={x} y={y}>
                <TextField id="outlined" label="Comment" onChange={(event) => setCommet(event.target.value)} />
                <Button
                    variant="contained"
                    onClick={() => {
                        socket.emit('comment', { id, data: { ...data, comment: comment } })

                        // also close comment
                        onClose()
                    }}
                >
                    Comment
                </Button>
            </Container>
        </>
    )
}

const Bg = styled.div`
    position: fixed;
    height: 100vh;
    width: 100vw;
    top: 0px;
    left: 0px;
`

const Container = styled.div<{ x: number; y: number }>`
    position: fixed;
    left: ${(props) => props.x}px;
    top: ${(props) => props.y}px;
    background-color: white;
    width: fit-content;
    box-shadow: 0px 0px 15px -6px rgba(0, 0, 0, 0.76);
    cursor: pointer;
    padding: 10px;
    display: grid;

    button {
        width: 100%;
        margin: 10px 0px 0px;
    }
`

export default CommentOption
