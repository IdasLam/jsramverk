import { fireEvent, render, screen } from '@testing-library/react'
import Home from './home'
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
        save: () => ({
            mutate: jest.fn(),
        }),
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

describe('The user should be able to click on the title to change the title', () => {
    it('Should turn into input when clicked on the title', async () => {
        render(<Home />)

        // Throws error because it does not exsist
        expect(() => screen.getByTestId('input')).toThrow()

        const title = await screen.findByTestId('title')

        expect(title).toBeInTheDocument()

        fireEvent.click(title)

        const input = await screen.findByTestId('input')
        expect(input).toBeInTheDocument()
    })
})
