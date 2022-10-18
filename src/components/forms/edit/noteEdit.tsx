import React, { useCallback, useState } from 'react'
import { useFormik } from 'formik'
import cn from 'classnames'
import * as yup from 'yup'
import { IHandleSubmit, INote } from '../../../../models'
import style from './noteEdit.module.scss'
import styleForm from '../create/form.module.scss'

const validateSchema = yup.object().shape({
  name: yup.string().trim().required('field is required').min(2),
  phone: yup.number().required('field is required'),
})

interface Props {
  note: INote
  handleEdit: IHandleSubmit<INote>
  handleDelete: IHandleSubmit<INote>
}

function NoteEdit({ handleDelete, handleEdit, note }: Props): JSX.Element {
  const [editing, setEditing] = useState(false)

  const onEdit = useCallback(() => {
    setEditing(true)
  }, [])

  const formik = useFormik({
    initialValues: note,
    onSubmit: async (data) => {
      if (formik.dirty) {
        await handleEdit(data)
      }
      setEditing(false)
    },
    validationSchema: validateSchema,
  })

  const onDelete = () => {
    const handler = async () => {
      formik.setSubmitting(true)
      await handleDelete(note)
      formik.setSubmitting(false)
    }
    handler()
  }

  return (
    <form className={style.note} data-testid="note" data-testkey={note.id}>
      <div className={cn(style.formField, style.formFieldName)}>
        <input
          type="text"
          name="name"
          value={formik.values.name}
          data-testid="note-field-name"
          className={style.field}
          disabled={!editing}
          onChange={formik.handleChange}
          placeholder="Name"
          aria-label="name"
          aria-errormessage="note-error-name"
          aria-disabled={!!formik.errors?.name}
        />
        {formik.errors.name && formik.touched.name && (
          <span className={styleForm.fieldError} id="note-error-name">
            {formik.errors.name}
          </span>
        )}
      </div>
      <div className={cn(style.formField, style.formFieldPhone)}>
        <input
          type="number"
          name="phone"
          value={formik.values.phone}
          data-testid="note-field-phone"
          className={style.field}
          disabled={!editing}
          onChange={formik.handleChange}
          placeholder="Phone number"
          aria-label="phone"
          aria-errormessage="note-error-phone"
          aria-invalid={!!formik.errors?.phone}
        />
        {formik.errors.phone && formik.touched.phone && (
          <span className={styleForm.fieldError} id="note-error-phone">
            {formik.errors.phone}
          </span>
        )}
      </div>
      <div className={cn(style.formField, style.formButtons)}>
        {editing ? (
          <>
            <button
              type="button"
              data-testid="btn-save"
              className={style.btn}
              disabled={formik.isSubmitting}
              onClick={formik.submitForm}
            >
              save
            </button>
            <button
              type="button"
              data-testid="btn-reset"
              className={style.btn}
              disabled={formik.isSubmitting}
              onClick={formik.handleReset}
            >
              reset
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              data-testid="btn-edit"
              className={style.btn}
              disabled={formik.isSubmitting}
              onClick={onEdit}
            >
              edit
            </button>
            <button
              type="button"
              data-testid="btn-delete"
              className={style.btn}
              disabled={formik.isSubmitting}
              onClick={onDelete}
            >
              remove
            </button>
          </>
        )}
      </div>
    </form>
  )
}

export default NoteEdit
