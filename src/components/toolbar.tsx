import React from 'react'
import { useState } from 'react'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import * as document from '../helpers/document'
import { useHistory, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

function useQuery() {
    return new URLSearchParams(useLocation().search)
}

const Tools: FunctionComponent = () => {
    const id = useQuery().get('id')
    const del = document.deleteDocument()
    const newDoc = document.save()
    const { isAllDocumentsLoading, refetchAll, allDocumentsError, allDocuments } = document.getAll()
    const [displayDeletePromt, setDisplayDeletePromt] = useState(false)
    const historyR = useHistory()
    const [selectedValue, setSelectedValue] = useState(id ?? 'all')

    useEffect(() => {
        if (id) {
            setSelectedValue(id)
        }
    }, [id])

    return (
        <ToolBar>
            <div>
                <select
                    value={selectedValue}
                    onChange={(event) => {
                        setSelectedValue(event.target.value)
                        if (event.target.value !== 'all') {
                            historyR.push('?id=' + event.target.value)
                        }
                    }}
                >
                    <option value="all">All files</option>
                    {!isAllDocumentsLoading && allDocuments
                        ? allDocuments.map((doc) => {
                              return (
                                  <option key={doc._id} value={doc._id}>
                                      {doc.title}
                                  </option>
                              )
                          })
                        : null}
                </select>
            </div>
            <ButtonDelete onClick={() => setDisplayDeletePromt(true)}>Delete</ButtonDelete>
            <ButtonAccept
                onClick={() => {
                    newDoc.mutateAsync({ title: 'New title', content: '' }).then((data) => {
                        historyR.push('?id=' + data._id)
                    })
                }}
            >
                New File
            </ButtonAccept>
            {displayDeletePromt ? (
                <section>
                    <Popup>
                        <div>
                            <h2>Are you sure that you want to delete this file?</h2>
                            <div>
                                <ButtonDelete
                                    onClick={() => {
                                        if (id) {
                                            // delete
                                            del.mutateAsync(id).then(() => {
                                                refetchAll()
                                                setDisplayDeletePromt(false)
                                                historyR.push('/')
                                            })
                                        }
                                    }}
                                >
                                    Yes
                                </ButtonDelete>
                                <ButtonAccept onClick={() => setDisplayDeletePromt(false)}>No</ButtonAccept>
                            </div>
                        </div>
                    </Popup>
                </section>
            ) : null}
        </ToolBar>
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
    }
`

const ButtonDelete = styled.button`
    background-color: #ff7a7a92;
    border: none;
    height: 40px;
    cursor: pointer;
    transition: ease-in-out 0.2s;

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
    }
`

export default Tools
