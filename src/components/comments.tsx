import React, { useEffect, useState } from 'react'
import { Comment } from '../hooks/useSocket'
import styled from 'styled-components'

type Comments = {
    comments: Comment[]
    content: string
}

const Comments: React.FunctionComponent<Comments> = ({ comments, content }) => {
    console.log(comments, content)
    const [allComments, setAllComments] = useState<Comment[]>()

    useEffect(() => {
        const filteredComments = comments.filter((comment) => content.includes(comment._id))
        filteredComments.sort((a, b) => {
            return a.y - b.y
        })
        console.log(filteredComments, 'fikltered')
        setAllComments(filteredComments)
    }, [comments])

    return (
        <CommentsContainer>
            <p>Comments:</p>
            <div>
                {allComments?.map((comment) => {
                    return (
                        <CommentContainer key={comment._id}>
                            <div>
                                <p>
                                    {comment.user} commented on: '{comment.selected}'
                                </p>
                                <p>{new Date(comment.date).toLocaleDateString('uk')}</p>
                                <p>{comment.comment}</p>
                            </div>
                        </CommentContainer>
                    )
                })}
            </div>
        </CommentsContainer>
    )
}

const CommentsContainer = styled.div`
    overflow-y: scroll;
    height: 50vh;
    padding-left: 20px;

    > div {
        display: grid;
        row-gap: 10px;
    }

    p::first-child {
        margin: unset;
        margin-bottom: 10px;
    }
`

const CommentContainer = styled.div`
    background-image: linear-gradient(to bottom right, #c9ffda, #ea92e3);
    padding: 10px;

    div {
        background-color: white;
        padding: 20px;

        p {
            color: gray;
            font-size: smaller;
        }

        p:last-child {
            color: unset;
        }
    }
`

export default Comments
