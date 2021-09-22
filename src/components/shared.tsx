import React, { FunctionComponent, useEffect, useState } from 'react'
import styled from 'styled-components'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

type Props = {
    doc: {
        _id: string
        title: string
        content: string
        access: string
    } | null
}

const Shared: FunctionComponent<Props> = ({ doc }) => {
    const [valid, setValid] = useState(false)
    const [usernames, setUsernames] = useState('')

    useEffect(() => {
        if (usernames.length > 0) {
            setValid(true)
        } else {
            setValid(false)
        }
    }, [usernames])

    console.log(doc)

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
                        // onClick={() => {
                        //     signup.mutateAsync(data).then((data) => {
                        //         localStorage.setItem('token', data.token)
                        //         history.push('/doc')
                        //     })
                        // }}
                    >
                        Add
                    </Button>
                </div>
                <div>
                    <h4>Users already invited</h4>
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
            }
        }
    }
`

export default Shared
