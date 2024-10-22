import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserList from './components/UserList';
import UserDetails from './components/UserDetails';
import UserForm from './components/UserForm'; // Import UserForm component
import NavigationBar from './components/Navbar'; // Import the new Navbar component
import './App.css';
import EditUser from './components/EditUser';
function App() {
  return (
    <Router>
      <div className="App">
        {/* Add Navbar */}
        <NavigationBar />
        
        {/* Main content */}
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<UserList />} />
            <Route path="/user/:id" element={<UserDetails />} />
            <Route path="/edit-user/:id" component={EditUser} />
            <Route path="/add-user" element={<UserForm />} /> {/* New route for adding users */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
