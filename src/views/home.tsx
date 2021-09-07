import React, { useState } from 'react'
import styled from 'styled-components'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Tools from '../components/toolbar'

const Home: React.FunctionComponent = () => {
    const [value, setValue] = useState({ content: '', title: 'Title' })
    const [showTitleInput, setShowTitleInput] = useState(false)

    return (
        <Container>
            <Header>
                <div>
                    <img src="https://img.icons8.com/color-glass/48/000000/document.png" />

                    {showTitleInput ? (
                        <input
                            type="text"
                            onBlur={() => setShowTitleInput(false)}
                            autoFocus
                            onChange={(change) => setValue({ ...value, title: change.target.value || 'Title' })}
                            defaultValue={value.title}
                            maxLength={22}
                        />
                    ) : (
                        <h1 onClick={() => setShowTitleInput(true)}>{value.title}</h1>
                    )}
                </div>
                <button onClick={() => console.log(value.content)}>Save</button>
            </Header>
            <Tools />
            <Main>
                <ReactQuill value={value.content} onChange={(change) => setValue({ ...value, content: change })} />
            </Main>
        </Container>
    )
}

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
