import React, { useCallback, useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'
import { CustomError } from '../Error'
import { Loading } from '../Loading'
import { Form } from '../forms/create/form'
import Notes from '../notes/notes'
import './App.css'
import { IHandleSubmit, INote } from '../../../models'

type INoteCreate = {
  name: string
  phone: number | string
}

function App() {
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notes, setNotes] = useState<INote[]>([])

  const onCreateSubmit: IHandleSubmit<INoteCreate> = async (data) => {
    try {
      const response = await axios.post('http://localhost:3005/notes/', data)
      setNotes((currentNotes) => currentNotes.concat(response.data))
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message)
      }
    }
  }

  const handleEdit: IHandleSubmit<INote> = async (data) => {
    const url = `http://localhost:3005/notes/${data.id}`
    try {
      const res = await axios.put(url, data)
      setNotes((currentNotes) =>
        currentNotes.map((note) => (note.id === res.data.id ? res.data : note))
      )
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message)
      }
    }
  }

  const handleDelete: IHandleSubmit<INote> = useCallback(async (data) => {
    const url = `http://localhost:3005/notes/${data.id}`
    try {
      const { status } = await axios.delete(url)
      if (status === 200) {
        setNotes((currentNotes) =>
          currentNotes.filter((note) => note.id !== data.id)
        )
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message)
      }
    }
  }, [])

  async function fetchNotes() {
    try {
      setLoading(true)
      const response = await axios.get<INote[]>('http://localhost:3005/notes/')
      setNotes(response.data)
      setLoading(false)
    } catch (e: unknown) {
      const axiosError = e as AxiosError
      setLoading(false)
      setError(axiosError.message)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  if (isLoading) {
    return <Loading isShow={isLoading} />
  }
  if (error) {
    return <CustomError>{error}</CustomError>
  }
  return (
    <div className="App">
      <Notes
        notes={notes}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <Form onSubmit={onCreateSubmit} />
    </div>
  )
}

export default App
