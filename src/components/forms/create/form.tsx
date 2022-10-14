import React from "react";
import * as yup from 'yup';
import {Formik} from "formik";
import style from './form.module.scss';
import {IHandleSubmit} from "../../../../models";

type INoteCreate = {
    name: string,
    phone: number | string,
};

interface IProps {
    onSubmit: IHandleSubmit<INoteCreate>,
}

const initialValue: INoteCreate = {
    name: '',
    phone: '',
};

const validateSchema = yup.object().shape({
    name: yup.string().required().trim().min(2),
    phone: yup.number().required()
})

export function Form(props: IProps): JSX.Element {
    return <Formik
        initialValues={initialValue}
        onSubmit={async (data, formik) => {
            await props.onSubmit(data);
            formik.resetForm();
        }}
        validationSchema={validateSchema}
    >{({
      values,
      isSubmitting,
      errors,
      touched,
      handleSubmit,
      handleChange
    }) => (
        <form onSubmit={handleSubmit} className={style.form}>
            <div className={style.fieldWrap}>
                <input
                    type="text"
                    name='name'
                    value={values.name}
                    data-testid='form-field-name'
                    className={style.field}
                    onChange={handleChange}
                    placeholder='Name'
                />
                {
                    errors.name && touched.name &&
                        <span className={style.fieldError}>{errors.name}</span>
                }
            </div>
            <div className={style.fieldWrap}>
                <input
                    type="number"
                    name='phone'
                    value={values.phone}
                    data-testid='form-field-phone'
                    className={style.field}
                    onChange={handleChange}
                    placeholder='Phone number'
                />
                {
                    errors.phone && touched.phone &&
                        <span className={style.fieldError}>{errors.phone}</span>
                }
            </div>
            <button
                type='submit'
                data-testid='submit-form'
                className={style.btn}
                disabled={isSubmitting}
            >submit</button>
        </form>
    )}</Formik>
}
