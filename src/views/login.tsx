import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import * as loginHelper from '../helpers/login'
import { useHistory } from 'react-router'
import { root } from '../helpers/root'

const Login = () => {
    const [registerBox, setRegisterBox] = useState(false)
    const [data, setData] = useState({ password: '', username: '' })
    const [valid, setValid] = useState(false)
    const login = loginHelper.login()
    const signup = loginHelper.signup()
    const history = useHistory()

    useEffect(() => {
        const email = validateEmail(data.username)

        if (data.password.length > 0 && email) {
            setValid(true)
        } else {
            setValid(false)
        }
    }, [data])

    const validateEmail = (email: string) => {
        const re =
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(email)
    }

    return (
        <>
            {registerBox ? (
                <LogIn>
                    <h1>Register</h1>
                    <TextField
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                        onChange={(event) => setData({ ...data, username: event.target.value.replace(/\s+/g, '') })}
                    />
                    <TextField
                        id="outlined-basic"
                        label="Password"
                        variant="outlined"
                        type="password"
                        onChange={(event) => setData({ ...data, password: event.target.value })}
                    />
                    <Button
                        disabled={!valid}
                        variant="outlined"
                        onClick={() => {
                            signup.mutateAsync(data).then((data) => {
                                if (data) {
                                    history.push(`${root}doc`)
                                }
                            })
                        }}
                    >
                        Register & Login
                    </Button>
                    <a onClick={() => setRegisterBox(false)}>Back to login</a>
                </LogIn>
            ) : (
                <LogIn>
                    <h1>Login</h1>
                    <TextField
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                        onChange={(event) => setData({ ...data, username: event.target.value.replace(/\s+/g, '') })}
                    />
                    <TextField
                        id="outlined-basic"
                        label="Password"
                        variant="outlined"
                        type="password"
                        onChange={(event) => setData({ ...data, password: event.target.value })}
                    />
                    <Button
                        disabled={!valid}
                        variant="outlined"
                        onClick={() => {
                            login.mutateAsync(data).then((incommingData) => {
                                if (incommingData) {
                                    history.push(`${root}doc`)
                                }
                            })
                        }}
                    >
                        Login
                    </Button>
                    <a
                        onClick={() => {
                            setRegisterBox(true)
                        }}
                    >
                        Register here
                    </a>
                </LogIn>
            )}
        </>
    )
}

const LogIn = styled.div`
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #ffffff94;
    text-align: center;
    padding: 40px 30px;
    row-gap: 20px;
    display: grid;
    width: 400px;
    border: 1px solid whitesmoke;
    border-radius: 4px;

    a {
        text-decoration: underline;
        color: blue;
        cursor: pointer;
    }

    div {
        background-color: white;
    }

    h1 {
        margin: unset;
    }
`

export default Login
