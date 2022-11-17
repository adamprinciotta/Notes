import "bootstrap/dist/css/bootstrap.min.css"
import { Container } from "react-bootstrap"
import { Navigate, Route, Routes } from "react-router-dom"
import { NewNote } from "./NewNote"

function App() {
  return (
    <Container className="my-4">
      <Routes>
        <Route path="/" element = {<h1>Home</h1>}></Route>
        <Route path="/new" element = {<NewNote/>}></Route>
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
