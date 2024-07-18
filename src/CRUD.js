import React, { useState, useEffect, Fragment } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const CRUD = () => {

    // const empdata = [
    //     {
    //         id: 1,
    //         name: "Raj",
    //         age: 29,
    //         isActive: 1
    //     },
    //     {
    //         id: 2,
    //         name: "Ram",
    //         age: 19,
    //         isActive: 1
    //     },
    //     {
    //         id: 3,
    //         name: "Ravi",
    //         age: 37,
    //         isActive: 0
    //     }
    // ]

    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [isActive, setIsActive] = useState(0);

    const [editId, setEditId] = useState('');
    const [editName, setEditName] = useState('');
    const [editAge, setEditAge] = useState('');
    const [editIsActive, setEditIsActive] = useState(0);
    useEffect(() => {
        getData();
    }, [])

    const getData = () => {
        axios.get('https://localhost:7157/api/Employee')
            .then((result) => {
                setData(result.data)
            })
            .catch((error) => {
                console.log("getData error:", error);
            })
    }


    const handleEdit = (id) => {
        handleShow();
        axios.get(`https://localhost:7157/api/Employee/${id}`)
            .then((result) => {
                setEditName(result.data.name);
                setEditAge(result.data.age);
                setEditIsActive(result.data.isActive);
                setEditId(id);
            })
            .catch((error) => {
                    console.log(error)
            })
    }
    const handleDelete = (id) => {
        if (window.confirm("Are you sure to delete this employee?")) {
            axios.delete(`https://localhost:7157/api/Employee/${id}`)
                .then((result) => {
                    if (result.status === 200) {
                        toast.success('Employee has been deleted');
                        getData();
                    }
                })
                .catch((error) => {
                    toast.error(error);
                })
        }

    }
    const handleUpdate = () => {
        const url = `https://localhost:7157/api/Employee/${editId}`
        const data = {
            "id": editId,
            "name": editName,
            "age": editAge,
            "isActive": editIsActive
        }
        axios.put(url, data)
            .then((result) => {
                handleClose();
                getData();
                clear();
                toast.success('Employee has been updated');
            })
            .catch((error) => {
                console.log(error);
                toast.error(error);
            })
    }

    const handleSave = () => {
        const url = 'https://localhost:7157/api/Employee';
        const data = {
            "name": name,
            "age": age,
            "isActive": isActive
        }

        axios.post(url, data)
            .then((result) => {
                getData();
                clear();
                toast.success('Employee has been added');
            })
            .catch((error) => {
                console.log(error);
                toast.error(error);
            })

    }
    const handleActiveChange = (e) => {
        if (e.target.checked) { setIsActive(1); }
        else { setIsActive(0) }
    }
    const handleEditActiveChange = (e) => {
        if (e.target.checked) { setEditIsActive(1); }
        else { setEditIsActive(0) }
    }
    const clear = () => {
        setName('');
        setAge('');
        setIsActive(0);

        setEditName('');
        setEditAge('');
        setEditIsActive(0);
        setEditId('');
    }

    return (
        <Fragment>
            <ToastContainer />
            <Container>
                <Row>
                    <Col>
                        <input type="text" className="form-control" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />
                    </Col>
                    <Col>
                        <input type="text" className="form-control" placeholder="Enter Age" value={age} onChange={(e) => setAge(e.target.value)} />
                    </Col>
                    <Col>
                        <input type="checkbox" checked={isActive === 1 ? true : false} onChange={(e) => handleActiveChange(e)} value={isActive} />
                        <label>IsActive</label>
                    </Col>
                    <Col>
                        <button className="btn btn-primary" onClick={() => handleSave()}>Submit</button>
                    </Col>
                </Row>
            </Container>
            <br></br>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>isActive</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data && data.length > 0 ?
                            data.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.age}</td>
                                        <td>{item.isActive}</td>
                                        <td colSpan={2}>
                                            <button className="btn btn-primary" onClick={() => handleEdit(item.id)}>Edit</button> &nbsp;
                                            <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                                        </td>
                                    </tr>
                                )
                            })
                            :
                            'Loading...'
                    }

                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modify/Update Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col>
                                <input type="text" className="form-control" placeholder="Enter Name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                            </Col>
                            <Col>
                                <input type="text" className="form-control" placeholder="Enter Age" value={editAge} onChange={(e) => setEditAge(e.target.value)} />
                            </Col>
                            <Col>
                                <input type="checkbox"
                                    checked={editIsActive === 1 ? true : false}
                                    onChange={(e) => handleEditActiveChange(e)} value={editIsActive} />
                                <label>IsActive</label>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>

    )
}

export default CRUD;