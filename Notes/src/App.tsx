import "bootstrap/dist/css/bootstrap.min.css"
import { useMemo } from "react"
import { Container } from "react-bootstrap"
import { Navigate, Route, Routes } from "react-router-dom"
import { NewNote } from "./NewNote"
import { useLocalStorage } from "./useLocalStorage"
import {v4 as uuidV4} from "uuid"
import { NoteList } from "./NoteList"

export type Note = {
  id: string
} & NoteData

export type NoteData = {
  title: string
  markdown: string
  tags: Tag[]
}

export type Tag = {
  id: string
  label: string
}

export type RawNote = {
  id: string
} & RawNoteData

export type RawNoteData = {
  title: string
  markdown: string
  tagIds: string[]
}

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", [])
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", [])

  const notesWithTags = useMemo(() => {
    return notes.map(note=>{
      return { ...note, tags: tags.filter(tag => note.tagIds.includes(tag.id))}
    })
  }, [notes, tags])

  function onCreateNote({tags, ...data}: NoteData){
    setNotes(prevNotes =>{
      return [...prevNotes, {...data, id: uuidV4(), tagIds: tags.map(tag => tag.id)}]
    })
  }

  function addTag(tag: Tag){
    setTags(prev => [...prev, tag])
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route path="/" element = {<NoteList availableTags={tags} notes={notesWithTags} />}></Route>
        <Route path="/new" element = {<NewNote onSubmit={onCreateNote} onAddTag={addTag} availableTags={tags}/>}></Route>
        {/* URL followed by /{insert anything here}, will run the first path assuming the value after the / is the ID */}
        <Route path="/:id">
          <Route index element={<h1>Show</h1>}></Route>
          {/* Doing /{ID}/edit will run this */}
          <Route path="edit" element={<h1>Edit</h1>}></Route>
        </Route>
        {/* Any wrong path routes back to the home page */}
        <Route path="*" element = {<h1><Navigate to="/"></Navigate></h1>}></Route>
      </Routes>
    </Container>
  )
}

export default App
