import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserForm from './UserForm';

function EditUser({ match, history }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`https://jsonplaceholder.typicode.com/users/${match.params.id}`)
      .then(response => setUser(response.data))
      .catch(error => console.error('Error fetching user', error));
  }, [match.params.id]);

  const handleSave = (updatedUser) => {
    alert('User updated successfully!');
    history.push('/'); // Redirect to the user list after saving
  };

  return (
    <div>
      <h2>Edit User</h2>
      {user ? <UserForm existingUser={user} onSave={handleSave} /> : <p>Loading...</p>}
    </div>
  );
}

export default EditUser;
