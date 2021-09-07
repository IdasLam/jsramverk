import React from 'react'
import { useState } from 'react'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import * as document from '../helpers/document'

const Tools: FunctionComponent = () => {
    const [shouldFetch, setShouldFetch] = useState({ all: false })
    const { isAllDocumentsLoading, allDocumentsError, allDocuments } = document.getAll(shouldFetch.all)

    console.log(allDocuments)
    return (
        <ToolBar>
            <p onClick={() => setShouldFetch({ ...shouldFetch, all: true })}>All files</p>
        </ToolBar>
    )
}

const ToolBar = styled.div`
    border-top: 1px solid white;
    margin-bottom: 30px;
    padding-left: 20px;
    cursor: pointer;
`

export default Tools
