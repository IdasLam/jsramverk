import React, { useState } from 'react'
import styled from 'styled-components'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const Home: React.FunctionComponent = () => {
    const [value, setValue] = useState('')

    return (
        <Container>
            <Header>
                <div>
                    <img src="https://img.icons8.com/color-glass/48/000000/document.png" />
                    <h1>JsRamverk</h1>
                </div>
                <button onClick={() => console.log(value)}>Save</button>
            </Header>
            <ToolBar>
                <p onClick={() => console.log(value)}>Save</p>
            </ToolBar>
            <Main>
                <ReactQuill value={value} onChange={setValue} />
            </Main>
        </Container>
    )
}

const ToolBar = styled.div`
    border-top: 1px solid white;
    margin-bottom: 30px;
    padding-left: 20px;
    cursor: pointer;
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
