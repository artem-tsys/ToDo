import React, {useCallback, useState} from "react";
import {useFormik} from "formik";
import cn from "classnames";
import * as yup from "yup";
import {IHandleSubmit, INote} from "../../../../models";
import style from './noteEdit.module.scss';

const validateSchema = yup.object().shape({
    name: yup.string().trim().required(),
    phone: yup.number().required()
})

interface Props {
    note: INote,
    handleEdit: IHandleSubmit<INote>,
    handleDelete: IHandleSubmit<INote>
}

function NoteEdit(props: Props): JSX.Element {
    const [editing, setEditing] = useState(false);

    const handleEdit = useCallback(() => {
        setEditing(true)
    }, []);

    const formik = useFormik({
        initialValues: props.note,
        onSubmit: async (values) => {
            if(formik.dirty) {
                await props.handleEdit(values);
            }
            setEditing(false)
        },
        validationSchema: validateSchema
    })

    const handleDelete = () => {
        const onDelete = async () => {
            formik.setSubmitting(true);
            await props.handleDelete(props.note);
            formik.setSubmitting(false);
        }
        onDelete();
    }

    return <form className={style.note} >
        <div className={cn(style.formField, style.formFieldName)}>
            <input
                type="text"
                name='name'
                value={formik.values.name}
                data-testid='form-field-name'
                className={style.field}
                disabled={!editing}
                onChange={formik.handleChange}
                placeholder='Name'
            />
            {formik.errors.name && formik.touched.name}
        </div>
        <div className={cn(style.formField, style.formFieldPhone)}>
            <input
                type="number"
                name='phone'
                value={formik.values.phone}
                data-testid='form-field-phone'
                className={style.field}
                disabled={!editing}
                onChange={formik.handleChange}
                placeholder='Phone number'
            />
            {formik.errors.phone && formik.touched.phone && formik.errors.phone}
        </div>
        <div className={cn(style.formField, style.formButtons)}>
            <button
                type='button'
                data-testid='submit-form'
                className={style.btn}
                disabled={formik.isSubmitting}
                onClick={editing ? formik.submitForm : handleEdit}
            >{ editing ? 'save' : 'edit' }</button>
            <button
                type='button'
                data-testid='clear-form'
                className={style.btn}
                disabled={formik.isSubmitting}
                onClick={editing ? formik.handleReset : handleDelete}
            >{ editing ? 'reset' : 'remove' }</button>
        </div>
    </form>
}

export default NoteEdit;
