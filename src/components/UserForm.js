import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

function UserForm({ existingUser = null, onSave }) {
  const [user, setUser] = useState(existingUser || {
    name: '',
    email: '',
    phone: '',
    address: { street: '', city: '' },
    company: { name: '' },
    website: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested properties
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1]; // Get the address field (street or city)
      setUser((prevUser) => ({
        ...prevUser,
        address: {
          ...prevUser.address,
          [addressField]: value
        }
      }));
    } else if (name === 'company.name') {
      setUser((prevUser) => ({
        ...prevUser,
        company: {
          ...prevUser.company,
          name: value
        }
      }));
    } else {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (existingUser) {
      // Update existing user
      axios.put(`https://jsonplaceholder.typicode.com/users/${existingUser.id}`, user)
        .then(response => onSave(response.data))
        .catch(error => console.error('Error updating user', error));
    } else {
      // Create new user
      axios.post('https://jsonplaceholder.typicode.com/users', user)
        .then(response => onSave(response.data))
        .catch(error => console.error('Error creating user', error));
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" name="name" value={user.name} onChange={handleChange} required />
      </Form.Group>

      <Form.Group controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" name="email" value={user.email} onChange={handleChange} required />
      </Form.Group>

      <Form.Group controlId="phone">
        <Form.Label>Phone</Form.Label>
        <Form.Control type="tel" name="phone" value={user.phone} onChange={handleChange} required />
      </Form.Group>

      <Form.Group controlId="addressStreet">
        <Form.Label>Street</Form.Label>
        <Form.Control 
          type="text" 
          name="address.street" // Keep name attribute for addressing
          value={user.address.street} 
          onChange={handleChange} 
          required 
        />
      </Form.Group>

      <Form.Group controlId="addressCity">
        <Form.Label>City</Form.Label>
        <Form.Control 
          type="text" 
          name="address.city" // Keep name attribute for addressing
          value={user.address.city} 
          onChange={handleChange} 
          required 
        />
      </Form.Group>

      <Form.Group controlId="companyName">
        <Form.Label>Company</Form.Label>
        <Form.Control 
          type="text" 
          name="company.name" // Keep name attribute for addressing
          value={user.company.name} 
          onChange={handleChange} 
        />
      </Form.Group>

      <Form.Group controlId="website">
        <Form.Label>Website</Form.Label>
        <Form.Control type="url" name="website" value={user.website} onChange={handleChange} />
      </Form.Group>

      <Button variant="primary" type="submit">
        {existingUser ? 'Update User' : 'Create User'}
      </Button>
    </Form>
  );
}

export default UserForm;

