import { FormEvent, useRef, useState } from "react"
import { Form, Stack, Row, Col, Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import CreatableReactSelect from "react-select/creatable"
import {NoteData, Tag} from "./App"
import {v4 as uuidV4} from "uuid"

type NoteFormProps = {
    onSubmit: (data: NoteData) => void
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
} & Partial<NoteData>

export function NoteForm({onSubmit, onAddTag, availableTags, title = "", markdown = "", tags = []}: NoteFormProps){
    const titleRef = useRef<HTMLInputElement>(null)
    const markdownRef = useRef<HTMLTextAreaElement>(null)
    const [selectedTags, setSelectedTags] = useState<Tag[]>(tags)
    const navigate = useNavigate()

    function handleSubmit(e: FormEvent){
        e.preventDefault()

        onSubmit({
            //current! means that it will never be null
            //we know it will never be null because we make them required
            title: titleRef.current!.value,
            markdown: markdownRef.current!.value,
            tags: selectedTags
        })

        //After submitting, send us back a page
        navigate("..")
    }
    return(
        <>
            <Form onSubmit={handleSubmit}>
                <Stack gap={4}>
                    <Row>
                        <Col>
                            <Form.Group controlId = "title">
                                <Form.Label>Title</Form.Label>
                                <Form.Control ref={titleRef} required defaultValue={title}/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId = "Tags">
                                <Form.Label>Tags</Form.Label>
                                <CreatableReactSelect
                                    onCreateOption={label => {
                                        const newTag = { id: uuidV4(), label }
                                        onAddTag(newTag)
                                        setSelectedTags(prev => [...prev, newTag])
                                    }} 
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
                    <Col>
                        <Form.Group controlId = "markdown">
                            <Form.Label>Body</Form.Label>
                            {/* sets textarea for the body of the notes */}
                            <Form.Control defaultValue = {markdown} required as="textarea" ref = {markdownRef} rows={15}/>
                        </Form.Group>
                    </Col>
                    <Stack direction="horizontal" gap={2} className="justify-content-end">
                        {/* Since it is a submit button, it will launch the onSubmit function */}
                        <Button type="submit" variant="primary">Save</Button>
                        {/* On cancel bring back a page */}
                        <Link to="..">
                            <Button type="button" variant="outline-secondary">Cancel</Button>
                        </Link>
                    </Stack>
                </Stack>
            </Form>
        </>
    )
}



