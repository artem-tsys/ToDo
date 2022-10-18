import cn from 'classnames'
import NoteEdit from '../forms/edit/noteEdit'
import { IHandleSubmit, INote } from '../../../models'
import style from './notes.module.scss'
import styleForm from '../forms/edit/noteEdit.module.scss'

interface Props {
  notes: INote[]
  handleEdit: IHandleSubmit<INote>
  handleDelete: IHandleSubmit<INote>
}

function Notes(props: Props): JSX.Element {
  const list = props.notes.map((note: INote) => (
    <NoteEdit
      note={note}
      key={note.id}
      handleEdit={props.handleEdit}
      handleDelete={props.handleDelete}
    />
  ))
  return (
    <div className={style.table} data-testid="notes">
      <div className={cn(style.tableHead, styleForm.note)}>
        <div className={cn(styleForm.formField, styleForm.formFieldName)}>
          Name
        </div>
        <div className={cn(styleForm.formField, styleForm.formFieldPhone)}>
          Phone
        </div>
        <div className={cn(styleForm.formField, styleForm.formButtons)}>
          Action
        </div>
      </div>
      {list}
    </div>
  )
}

export default Notes
