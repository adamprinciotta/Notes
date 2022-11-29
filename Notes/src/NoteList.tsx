import { useMemo, useState } from "react";
import { Badge, Button, Card, Col, Form, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select"
import { Tag } from "./App";
import styles from "./NoteList.module.css"

type NoteListProps = {
    availableTags: Tag[]
    notes: SimplifiedNote[]
}

type SimplifiedNote = {
    id: string
    title: string
    tags: Tag[]
}


export function NoteList({availableTags, notes}:NoteListProps){

    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const [title, setTitle] = useState("")
    const filteredNotes = useMemo(()=>{
        return notes.filter(note =>{
            //If the title is empty or the note title matches the search title
            return(title === "" || note.title.toLowerCase().includes(title.toLowerCase())) 
            && 
            //if there are no tags or if the note contains the tag we are searching for
            (selectedTags.length === 0 || selectedTags.every(tag => note.tags.some(noteTag => noteTag.id === tag.id)))
        })
    },[title, selectedTags, notes])

    return <>
    <Row className="align-items-center mb-4">
        <Col>
        <h1>Notes</h1>
        </Col>
        <Col xs="auto">
            <Stack gap={2} direction="horizontal">
                <Link to="/new">
                    <Button variant="primary">Create</Button>
                </Link>
                <Button variant="outline-secondary">Edit Tags</Button>
            </Stack>
        </Col>
    </Row>
    <Form>
        <Row className="mb-4">
            <Col>
                <Form.Group controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" value={title} onChange={e => setTitle(e.target.value)}/>
                </Form.Group>
            </Col>
            <Col>
                <Form.Group controlId = "Tags">
                                <Form.Label>Tags</Form.Label>
                                <ReactSelect
                                    //Displays the value of selected tags in the selector
                                    value={selectedTags.map(tag => {
                                        return{ label: tag.label, value: tag.id }
                                        })}
                                    //Displays the possible tags
                                    options={availableTags.map(tag => {
                                        return{label:tag.label, value: tag.id}
                                    })}
                                    //Converting from value that CreatableReactSelect expects to the values that we are storing
                                    onChange={tags=>{
                                        setSelectedTags(tags.map(tags=>{
                                            return {label: tags.label, id: tags.value}
                                        }))
                                    }}
                                    isMulti/>
                            </Form.Group>
                            </Col>
        </Row>
    </Form>
    <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
        {filteredNotes.map(note => (
            <Col key={note.id}>
                <NoteCard id = {note.id} title={note.title} tags={note.tags}/>
            </Col>
        ))}
    </Row>
    </>
}

function NoteCard({id, title, tags}: SimplifiedNote){
    return <>
        <Card as={Link} to={`/${id}`} className={`h-100 text-reset text-decoration-none ${styles.card}`}>
            <Card.Body>
                <Stack gap={2} className="align-items-center justify-content-center h-100">
                    <span className="fs-5">{title}</span>    
                    {tags.length > 0 && (
                        <Stack gap={1} direction="horizontal" className="justify-content-center flex-wrap">
                        {tags.map(tag => (
                                <Badge className="text-truncates" key={tag.id}>{tag.label}</Badge>
                            ))}
                        </Stack>
                    )}
                </Stack>
            </Card.Body>
        </Card>
    </>
}