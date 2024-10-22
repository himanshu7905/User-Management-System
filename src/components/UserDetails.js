import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card } from 'react-bootstrap';

function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the user details!", error);
      });
  }, [id]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>{user.name}</Card.Title>
        <Card.Text>
          <strong>Email:</strong> {user.email}<br />
          <strong>Phone:</strong> {user.phone}<br />
          <strong>Website:</strong> {user.website}<br />
          <strong>Company:</strong> {user.company.name}<br />
          <strong>Address:</strong> {user.address.street}, {user.address.city}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default UserDetails;
