import {
  cleanup,
  fireEvent,
  render,
  screen,
  act,
  waitFor,
} from '@testing-library/react'
import NoteEdit from './noteEdit'
import note from '../../../../__fixtures__/note.json'

afterEach(cleanup)

const createHandle = (t = 200, data = {}) =>
  jest.fn(async () => {
    const promise = new Promise((resolve) => {
      setTimeout(() => resolve(data), t)
    })
    return promise
  })

describe('testing note', () => {
  it('check is show values', async () => {
    const handleDelete = createHandle()
    const handleSubmit = createHandle()

    render(
      <NoteEdit
        handleDelete={handleDelete}
        handleEdit={handleSubmit}
        note={note}
      />
    )

    const fieldName = screen.getByTestId('note-field-name')
    const fieldPhone = screen.getByTestId('note-field-phone')

    expect(fieldName).toHaveValue(note.name)
    expect(fieldPhone).toHaveValue(note.phone)
  })

  it('check edit mode', async () => {
    const handleDelete = createHandle()
    const handleSubmit = createHandle()

    render(
      <NoteEdit
        handleDelete={handleDelete}
        handleEdit={handleSubmit}
        note={note}
      />
    )

    const fieldName = screen.getByTestId('note-field-name')
    const fieldPhone = screen.getByTestId('note-field-phone')

    expect(fieldName).toBeDisabled()
    expect(fieldPhone).toBeDisabled()
    expect(screen.queryByTestId('btn-reset')).toBeNull()
    expect(screen.queryByTestId('btn-save')).toBeNull()
    expect(screen.queryByTestId('btn-edit')).toBeInTheDocument()
    expect(screen.queryByTestId('btn-delete')).toBeInTheDocument()

    await act(() => {
      fireEvent.click(screen.getByTestId('btn-edit'))
    })

    expect(fieldName).not.toBeDisabled()
    expect(fieldPhone).not.toBeDisabled()
    expect(screen.queryByTestId('btn-reset')).toBeInTheDocument()
    expect(screen.queryByTestId('btn-save')).toBeInTheDocument()
    expect(screen.queryByTestId('btn-edit')).not.toBeInTheDocument()
    expect(screen.queryByTestId('btn-delete')).not.toBeInTheDocument()
  })

  it('check reset btn', async () => {
    const handleDelete = createHandle()
    const handleSubmit = createHandle()

    render(
      <NoteEdit
        handleDelete={handleDelete}
        handleEdit={handleSubmit}
        note={note}
      />
    )

    const fieldName = screen.getByTestId('note-field-name')
    const fieldPhone = screen.getByTestId('note-field-phone')
    await act(() => {
      fireEvent.click(screen.getByTestId('btn-edit'))

      fireEvent.change(fieldName, { target: { value: 'test' } })
      fireEvent.change(fieldPhone, { target: { value: null } })
    })

    expect(fieldName).not.toHaveValue(note.name)
    expect(fieldPhone).not.toHaveValue(note.phone)

    fireEvent.click(screen.getByTestId('btn-reset'))

    expect(fieldName).toHaveValue(note.name)
    expect(fieldPhone).toHaveValue(note.phone)
  })

  it('check save btn', async () => {
    const handleDelete = createHandle()
    const handleSubmit = createHandle()

    render(
      <NoteEdit
        handleDelete={handleDelete}
        handleEdit={handleSubmit}
        note={note}
      />
    )

    const fieldName = screen.getByTestId('note-field-name')
    const fieldPhone = screen.getByTestId('note-field-phone')
    const updatedNumber = 22333444
    const updatedName = 'test'

    await act(() => {
      fireEvent.click(screen.getByTestId('btn-edit'))

      fireEvent.change(fieldName, { target: { value: updatedName } })
      fireEvent.change(fieldPhone, { target: { value: null } })

      fireEvent.click(screen.getByTestId('btn-save'))
    })

    expect(fieldPhone).toHaveErrorMessage(/field is required/i)
    expect(handleSubmit).toHaveBeenCalledTimes(0)

    await act(() => {
      fireEvent.change(fieldName, { target: { value: updatedName } })
      fireEvent.change(fieldPhone, { target: { value: updatedNumber } })

      fireEvent.click(screen.getByTestId('btn-save'))
    })

    expect(screen.getByTestId('btn-reset')).toBeDisabled()
    expect(screen.getByTestId('btn-save')).toBeDisabled()
    expect(handleSubmit).toHaveBeenCalledTimes(1)

    await waitFor(() => {
      expect(fieldName).toBeDisabled()
      expect(fieldPhone).toBeDisabled()
      expect(fieldName).toHaveValue(updatedName)
      expect(fieldPhone).toHaveValue(updatedNumber)
    })
  })
  it('check delete btn', async () => {
    const handleDelete = createHandle()
    const handleSubmit = createHandle()

    render(
      <NoteEdit
        handleDelete={handleDelete}
        handleEdit={handleSubmit}
        note={note}
      />
    )

    await act(() => {
      fireEvent.click(screen.getByTestId('btn-delete'))
    })

    expect(handleDelete).toHaveBeenCalledTimes(1)
    expect(handleDelete).toHaveBeenCalledWith(note)
  })
})
