import {Card,Button, Modal, DropdownButton, ButtonGroup, Dropdown, Form, Spinner} from 'react-bootstrap';
import { LiaDownloadSolid } from "react-icons/lia";
import { getToken } from '../utils/localstorage';
import { token,  backend } from '../utils/config';
import { useState } from "react"
import {getFromBackend, postToBackend} from "../utils/backendCalls"

function FileItem({file}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [loading, setLoading] = useState(false) 
  let [toEmail, setToEmail] = useState("")
const handledDownload = async (val) => {
  val.preventDefault()
  //get file download token
  let downloadToken = await getFromBackend("/user/file/download/token" ,getToken(token.customerTokenKey))
  if(downloadToken.status !== 200)
      alert("couldnt start download")
  else {
    //make file download url
    let downloadUrl  = `${backend.url}/download/${downloadToken.data.token}/${file.id}`
    console.log(downloadUrl)
    //create anchor tag element
    let downloadTag = document.createElement("a")
    //append link to body
    document.body.appendChild(downloadTag)
    //set href attribute
    downloadTag.href = downloadUrl
    downloadTag.setAttribute('type', 'hidden')
    downloadTag.click()
  }
}

let authToken = getToken(token.authToken) ? getToken(token.customerTokenKey) : getToken(token.adminTokenKey)
  return (
    <Card style={{height: "155px"}}>
      <Card.Header style={{height: "350px"}}  as="h6" className='overflow-hidden shadow-lg'>{file.title}</Card.Header>
      <Card.Body>
        <Card.Text style={{height:"30px", overflow:"hidden"}}>
          {file.description}
        </Card.Text>
        <DropdownButton as={ButtonGroup} title={<LiaDownloadSolid style={{width:"80px", height:"30px"}}/>} id="bg-nested-dropdown">
        <Dropdown.Item onClick={handledDownload}> Download</Dropdown.Item>
        <Dropdown.Item onClick={handleShow}>Email</Dropdown.Item>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Send Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
      <Form onSubmit={async (val) => {
        val.preventDefault()
        setLoading(true)
        let response = await postToBackend("/user/files/email", {fileId:file.id, email:toEmail}, authToken)
        if(response.status !== 200)
            alert(response.data.message)
        else
            alert("message sent")
        setLoading(false)
      }}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control value={toEmail} required onChange={(val) => setToEmail(val.target.value)} type="email" placeholder="Enter email" />
      </Form.Group>
      <div className='spiner-parent'>
       <Button disabled = {loading} variant="primary" type="submit">
        Submit
      </Button>
      {loading && <Spinner className='spiner-child' />}
      </div>
    </Form>
        </Modal.Body>
      </Modal>
      </DropdownButton>
      </Card.Body>
    </Card>
  );
}
export {FileItem}