import {
  cleanup,
  fireEvent,
  render,
  screen,
  act,
  waitFor,
} from '@testing-library/react'
import { Form } from './form'
import note from '../../../../__fixtures__/note.json'

afterEach(cleanup)

const createHandle = (t = 200) =>
  jest.fn(async () => {
    const promise = new Promise((resolve) => {
      setTimeout(resolve, t)
    })
    return promise
  })

describe('testing form', () => {
  it('show error messages', async () => {
    const handleDelete = createHandle()
    await act(() => {
      render(<Form onSubmit={handleDelete} />)
    })
    expect(screen.queryByText(/field is required/i)).toBeNull()
    await act(() => {
      fireEvent.click(screen.getByTestId('submit-form'))
    })
    const fieldName = screen.getByTestId('form-field-name')
    const fieldPhone = screen.getByTestId('form-field-phone')

    expect(fieldName).toHaveErrorMessage(/field is required/i)
    expect(fieldPhone).toHaveErrorMessage(/field is required/i)
    expect(handleDelete).toHaveBeenCalledTimes(0)
  })

  it('success send form', async () => {
    const handleSubmit = createHandle(500)
    await act(() => {
      render(<Form onSubmit={handleSubmit} />)
    })
    const fieldName = screen.getByTestId(/form-field-name/i)
    const fieldPhone = screen.getByTestId(/form-field-phone/i)
    const btnSubmit = screen.getByTestId('submit-form')

    fireEvent.change(fieldName, { target: { value: note.name } })
    fireEvent.change(fieldPhone, { target: { value: note.phone } })

    expect(btnSubmit).not.toBeDisabled()

    await act(() => {
      fireEvent.click(screen.getByTestId(/submit-form/i))
    })
    expect(fieldName).not.toHaveErrorMessage(/field is required/i)
    expect(fieldPhone).not.toHaveErrorMessage(/field is required/i)
    expect(handleSubmit).toHaveBeenCalledTimes(1)

    expect(btnSubmit).toBeDisabled()
  })

  it('clear form after submit', async () => {
    const handleDelete = createHandle(500)
    await act(() => {
      render(<Form onSubmit={handleDelete} />)
    })
    const fieldName = screen.getByTestId(/form-field-name/i)
    const fieldPhone = screen.getByTestId(/form-field-phone/i)

    fireEvent.change(fieldName, { target: { value: note.name } })
    fireEvent.change(fieldPhone, { target: { value: note.phone } })

    await act(() => {
      fireEvent.click(screen.getByTestId('submit-form'))
    })

    await waitFor(() => {
      expect(handleDelete).toHaveBeenCalledTimes(1)
      expect(fieldPhone).toHaveValue(null)
      expect(fieldName).toHaveValue('')
    })
  })
})
