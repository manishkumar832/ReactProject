import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Modal, Form } from 'react-bootstrap';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../Firebase/FirebaseConfig';
import { getAuth } from 'firebase/auth';
import { CgProfile } from "react-icons/cg";
import './Navbar.css';

const Navbar = ({ role, setRole }) => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [previousPath, setPreviousPath] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeView, setActiveView] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    capacity: '',
    price: '',
    fileUrl: [''],
  });

  // Load role from localStorage on mount
  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) setRole(storedRole);
  }, [setRole]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('role');
    setRole(null);
    setUserInfo(null);        
    setActiveView(null);       
    navigate('/');
  };

  // Upload modal handlers
  const handleShow = () => {
    setActiveView("upload");
    setPreviousPath(location.pathname);
    navigate('/upload');
    setUserInfo(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setFormData({
      title: '',
      description: '',
      city: '',
      capacity: '',
      price: '',
      fileUrl: [''], 
    });
    setActiveView(null);
  };

  // Form handlers
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileUrlChange = (value, index) => {
    const newFileUrls = [...formData.fileUrl];
    newFileUrls[index] = value;
    setFormData({ ...formData, fileUrl: newFileUrls });
  };

  const addFileUrlField = () => setFormData({ ...formData, fileUrl: [...formData.fileUrl, ''] });
  const removeFileUrlField = (index) => setFormData({ ...formData, fileUrl: formData.fileUrl.filter((_, i) => i !== index) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth(); 
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.error('No user is logged in.');
        return;
      }

      await addDoc(collection(db, 'uploads'), {
        ...formData,
        ownerId: currentUser.uid,  
        createdAt: serverTimestamp()
      });

      console.log('Data submitted to Firestore');
      handleClose();
    } catch (error) {
      console.error('Error uploading data:', error);
    }
  };

  const handleProfileClick = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserInfo({
        displayName: user.email.split("@")[0] || "Anonymous",
        email: user.email,
        uid: user.uid,
        role: role || "Not defined",
      });
      setActiveView(prev => (prev === "userInfo" ? null : "userInfo")); 
    }
  };

  return (
    <>
      <div className='navbar'>
        <Link to="/" onClick={() => setActiveView(null)} className="logo">
          <img src="/projectLogo.png" alt="Logo" width={150} style={{ cursor: 'pointer' }} />
        </Link>

        <div className="nav-links">
          
         {!role || role === "null" || role === "" ? (
  <Link to="/signup" className="nav-btn signup-btn">Signup</Link>
) : null}

    
          {role === 'owner' && (
            <>
              <span onClick={handleShow} className='Upload'>Upload</span>
              <Link to="/myevents" onClick={() => setActiveView(null)}>My Events</Link>
              <Link to="/bookings" onClick={() => setActiveView(null)}>Bookings</Link>
              <span id="profilelogo" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
                <CgProfile />
              </span>
              <span onClick={handleLogout} className='Logbtn'>Logout</span>
            </>
          )}

    
          {role === 'tenant' && (
            <>
              <Link to="/Events" onClick={() => setActiveView(null)}>Events</Link>
              <Link to="/mybookings" onClick={() => setActiveView(null)}>My Bookings</Link>
              <span id="profilelogo" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
                <CgProfile />
              </span>
              <span onClick={handleLogout} className='Logbtn'>Logout</span>
            </>
          )}
        </div>
      </div>

     
      <Modal show={showModal} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {['title','description','city','capacity','price'].map((field, idx) => (
              <Form.Group className="mb-3" key={idx}>
                <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                <Form.Control
                  type={field === 'capacity' || field === 'price' ? 'number' : field === 'description' ? 'textarea' : 'text'}
                  placeholder={`Enter ${field}`}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  as={field === 'description' ? 'textarea' : undefined}
                  rows={field === 'description' ? 3 : undefined}
                />
              </Form.Group>
            ))}

            <Form.Group className="mb-3">
              <Form.Label>Upload Image URLs</Form.Label>
              {formData.fileUrl.map((url, index) => (
                <div key={index} className="d-flex mb-2">
                  <Form.Control
                    type="url"
                    placeholder={`Enter image URL ${index + 1}`}
                    value={url}
                    onChange={(e) => handleFileUrlChange(e.target.value, index)}
                    required
                  />
                  {formData.fileUrl.length > 1 && (
                    <Button
                      variant="danger"
                      size="sm"
                      className="ms-2"
                      onClick={() => removeFileUrlField(index)}
                    >
                      &times;
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="secondary" size="sm" onClick={addFileUrlField} className="mt-2">
                + Add Another URL
              </Button>
            </Form.Group>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>Close</Button>
              <Button variant="primary" type="submit">Submit</Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      {activeView === "userInfo" && userInfo && (
        <div className="user-info-box">
          <p><strong>Name:</strong> {userInfo.displayName}</p>
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>UID:</strong> {userInfo.uid}</p>
          <p><strong>Role:</strong> {userInfo.role}</p>
        </div>
      )}
    </>
  );
};

export default Navbar;
