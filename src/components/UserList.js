import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form,Row,Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserForm from './UserForm'; // Import the UserForm component

function UserList() {
  const [users, setUsers] = useState([]); // Store fetched users
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false); // State to show user form
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [searchQuery, setSearchQuery] = useState(''); // State to store search input

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from the API
  const fetchUsers = () => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        setUsers(response.data); // Store users in state
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the users!", error);
      });
  };

  // Handle user edit by setting selectedUser and formData
  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone
    });
    setShowEditModal(true);
  };

  // Handle user delete by updating the state without refetching
  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      axios.delete(`https://jsonplaceholder.typicode.com/users/${userId}`)
        .then(() => {
          alert('User deleted successfully');
          setUsers(users.filter(user => user.id !== userId)); // Update the local state after deletion
        })
        .catch(error => {
          console.error('There was an error deleting the user!', error);
        });
    }
  };

  // Close the edit modal
  const handleModalClose = () => setShowEditModal(false);
  const handleFormModalClose = () => setShowFormModal(false); // Close form modal

  // Handle form submit for editing user details
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Update user data locally and on the server
    axios.put(`https://jsonplaceholder.typicode.com/users/${selectedUser.id}`, formData)
      .then(response => {
        alert('User updated successfully');
        setUsers(users.map(user => user.id === selectedUser.id ? response.data : user)); // Update the local state with edited user
        setShowEditModal(false);
      })
      .catch(error => {
        console.error('There was an error updating the user!', error);
      });
  };

  // Handle input change in the edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query state
  };

  // Handle new user creation from the UserForm
  const handleSaveUser = (newUser) => {
    setUsers([...users, newUser]); // Update user list with newly created user
    setShowFormModal(false); // Close the form modal
  };

  // Filter users based on the search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show loading indicator if the data is still being fetched
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2 className='mb-5'>User List</h2>
      
      {/* Button to open user form modal */}
      <Row className="mb-3 align-items-center">
      <Col xs={6} md={3} className="text-left">
        <Button variant="primary" onClick={() => setShowFormModal(true)}>
          Create New User
        </Button>
      </Col>

      <Col xs={6} md={9} className="text-right">
        {/* Search Input */}
        <Form.Group controlId="search" className="mb-0 d-flex align-items-center">
        <Form.Label className="sr-only" style={{ marginRight: '30px' }}>Search by Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name to search"
            value={searchQuery}
            onChange={handleSearchChange} // Update search query on input change
            className="me-2 custom-width" // Apply custom class for width
            style={{ width: '500px' }} // Alternatively, set width here
          />
        </Form.Group>
      </Col>
    </Row>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Streert</th>
            <th>City</th>
            <th>Website</th>
            <th>Actions</th>
           
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.address.street}</td>
              <td>{user.address.city}</td>
              <td>{user.company.name}</td>
              <td>
                <Link to={`/user/${user.id}`}>
                  <Button variant="info" size="sm">Details</Button>
                </Link>
                <Button
                  variant="warning"
                  size="sm"
                  className="ml-2"
                  onClick={() => handleEdit(user)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="ml-2"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Create User Modal */}
      <Modal show={showFormModal} onHide={handleFormModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserForm onSave={handleSaveUser} />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default UserList;
