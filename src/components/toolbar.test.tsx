import { fireEvent, render, screen } from '@testing-library/react'
import Toolbar from './toolbar'
import { useHistory } from 'react-router-dom'
import * as document from '../helpers/document'

jest.mock('react-router-dom', () => {
    return {
        useLocation: () => jest.fn(),
        useHistory: () => ({
            push: jest.fn(),
            useLocation: jest.fn(),
        }),
    }
})

const documents = [
    { _id: 'hello', title: 'Hello Ernst', context: 'hello324' },
    { _id: 'Holas', title: 'Hola Ernst', context: 'Helo324' },
]

jest.mock('../helpers/document', () => {
    return {
        getOne: (id: string) => {
            const document = documents.find((doc) => doc._id === id)
            return { isOneDocumentLoading: false, doneDocument: document }
        },
        save: () => {
            return { mutateAsync: () => Promise.resolve({}) }
        },
        deleteDocument: jest.fn(),
        getAll: () => {
            return {
                isAllDocumentsLoading: false,
                refetchAll: false,
                allDocumentsError: false,
                allDocuments: documents,
            }
        },
    }
})

describe('The user should be able to promted before deleting the file', () => {
    it('Should mount a section to a delete or not', () => {
        render(<Toolbar />)
        // Throws error because it does not exsist
        expect(() => screen.getByTestId('popup')).toThrow()

        const deleteButton = screen.getByTestId('deleteButton')

        expect(deleteButton).toBeInTheDocument()

        fireEvent.click(deleteButton)

        const popup = screen.getByTestId('popup')
        expect(popup).toBeInTheDocument()
    })

    it('Should remove the popup when clicked on no', () => {
        render(<Toolbar />)

        // Throws error because it does not exsist
        expect(() => screen.getByTestId('popup')).toThrow()
        expect(() => screen.getByTestId('close')).toThrow()

        const deleteButton = screen.getByTestId('deleteButton')

        fireEvent.click(deleteButton)

        const popup = screen.getByTestId('popup')
        expect(popup).toBeInTheDocument()

        const close = screen.getByTestId('close')
        expect(close).toBeInTheDocument()

        fireEvent.click(close)

        // Throws error because it does not exsist
        expect(() => screen.getByTestId('popup')).toThrow()
    })
})

// describe('The user should be redirected when creating a new document', () => {
//     it('Should call history().push() when clicking new document', () => {
//         render(<Toolbar />)

//         const newFile = screen.getByTestId('newDoc')

//         expect(newFile).toBeInTheDocument()

//         fireEvent.click(newFile)

//         expect(useHistory().push).toBeCalled()
//     })
// })
