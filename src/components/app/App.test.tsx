import {
  cleanup,
  fireEvent,
  render,
  screen,
  act,
  waitFor,
  within,
} from '@testing-library/react'
import axios from 'axios'
import App from './App'
import note from '../../../__fixtures__/note.json'
import { notes as mockNotes } from '../../../__fixtures__/notes.json'

afterEach(cleanup)
beforeEach(() => {
  jest.resetAllMocks()
})

const editedNote = {
  name: 'was edited',
  phone: 555,
}
const urlPostNote = 'http://localhost:3005/notes/'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('test app', () => {
  it('show notes', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockNotes })
    render(<App />)

    const notes = await screen.findAllByTestId('note')
    expect(notes.length).toBe(2)
    expect(notes).not.toBeNull()
    expect(axios.get).toBeCalledTimes(1)
  })

  it('empty notes', async () => {
    mockedAxios.get.mockResolvedValue({ data: [] })
    await act(() => {
      render(<App />)
    })

    await waitFor(() => {
      const notes = screen.queryAllByTestId('note')
      expect(notes.length).not.toBe(2)
      expect(notes).toHaveLength(0)
      expect(axios.get).not.toBeCalledTimes(0)
    })
  })

  it('create note', async () => {
    mockedAxios.get.mockResolvedValue({ data: [] })
    mockedAxios.post.mockResolvedValue({ data: note })
    render(<App />)

    await waitFor(() => {
      expect(screen.queryByTestId('note')).not.toBeInTheDocument()
    })

    const btnSubmit = await screen.findByTestId('submit-form')
    const fieldName = screen.getByTestId('form-field-name')
    const fieldPhone = screen.getByTestId('form-field-phone')

    fireEvent.change(fieldName, { target: { value: note.name } })
    fireEvent.change(fieldPhone, { target: { value: note.phone } })

    await act(() => {
      fireEvent.click(btnSubmit)
    })

    const notes = await screen.findAllByTestId('note')
    expect(notes.length).toBe(1)
    expect(axios.post).toBeCalledTimes(1)
    expect(axios.post).not.toBeCalledWith(urlPostNote, note)
    expect(axios.post).toBeCalledWith(urlPostNote, {
      name: note.name,
      phone: note.phone,
    })
  })

  it('delete note', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockNotes })
    mockedAxios.delete.mockResolvedValue({ status: 200 })
    render(<App />)

    await waitFor(() => {
      expect(screen.queryByTestId('note')).not.toBeInTheDocument()
    })
    const notes = await screen.findAllByTestId('note')
    expect(notes.length).toBe(2)
    expect(axios.post).toBeCalledTimes(0)
    expect(axios.delete).toBeCalledTimes(0)

    const btnDelete = await screen.findAllByTestId('btn-delete')

    await act(() => {
      fireEvent.click(btnDelete[0])
    })

    expect(axios.delete).toBeCalledTimes(1)
    await waitFor(() => {
      const updatedNotes = screen.getAllByTestId('note')
      expect(updatedNotes.length).toBe(1)
    })
  })

  it('edit note', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockNotes })
    mockedAxios.put.mockResolvedValue({ data: note })
    render(<App />)

    const notes = await screen.findAllByTestId('note')
    const noteElement = notes[0]
    const btnEdit = within(noteElement).getByTestId('btn-edit')
    const fieldName = within(noteElement).getByTestId('note-field-name')
    const fieldPhone = within(noteElement).getByTestId('note-field-phone')

    fireEvent.click(btnEdit)
    fireEvent.change(fieldName, { target: { value: editedNote.name } })
    fireEvent.change(fieldPhone, { target: { value: editedNote.phone } })
    await act(() => {
      fireEvent.click(within(noteElement).getByTestId('btn-save'))
    })

    expect(axios.put).toBeCalledTimes(1)

    const editingNote = mockNotes[0]
    expect(axios.put).toBeCalledWith(`${urlPostNote}${editingNote.id}`, {
      ...editingNote,
      ...editedNote,
    })

    expect(btnEdit).toBeInTheDocument()
    expect(btnEdit).not.toBeDisabled()
    expect(
      within(noteElement).queryByTestId('btn-save')
    ).not.toBeInTheDocument()
    expect(fieldName).toHaveValue(editedNote.name)
    expect(fieldPhone).toHaveValue(editedNote.phone)
  })
})
