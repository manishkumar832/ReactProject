// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { Button, Modal, Form } from 'react-bootstrap';
// import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// import { db } from '../Firebase/FirebaseConfig';
// import { getAuth } from 'firebase/auth';
// import { CgProfile } from "react-icons/cg";
// import './Navbar.css';

// const Navbar = ({ role, setRole }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [activeView, setActiveView] = useState(null); // "upload" | "userInfo" | null
//   const [showModal, setShowModal] = useState(false);
//   const [userInfo, setUserInfo] = useState(null);
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     city: '',
//     capacity: '',
//     price: '',
//     fileUrl: [''],
//   });

//   useEffect(() => {
//     const storedRole = localStorage.getItem('role');
//     if (storedRole) setRole(storedRole);
//   }, [setRole]);

//   // Close everything
//   const closeAllViews = () => {
//     setActiveView(null);
//     setShowModal(false);
//     setUserInfo(null);
//     setFormData({
//       title: '',
//       description: '',
//       city: '',
//       capacity: '',
//       price: '',
//       fileUrl: [''],
//     });
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('role');
//     setRole(null);
//     closeAllViews();
//     navigate('/');
//   };

//   // Upload modal handlers
//   const handleShowUpload = () => {
//     closeAllViews();
//     setActiveView('upload');
//     setShowModal(true);
//   };

//   const handleCloseUpload = () => {
//     setShowModal(false);
//     setActiveView(null);
//     setFormData({
//       title: '',
//       description: '',
//       city: '',
//       capacity: '',
//       price: '',
//       fileUrl: [''],
//     });
//   };

//   const handleChange = (e) => {
//     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleFileUrlChange = (value, index) => {
//     const newFileUrls = [...formData.fileUrl];
//     newFileUrls[index] = value;
//     setFormData({ ...formData, fileUrl: newFileUrls });
//   };

//   const addFileUrlField = () => setFormData({ ...formData, fileUrl: [...formData.fileUrl, ''] });
//   const removeFileUrlField = (index) => setFormData({ ...formData, fileUrl: formData.fileUrl.filter((_, i) => i !== index) });

//   const handleSubmitUpload = async (e) => {
//     e.preventDefault();
//     try {
//       const auth = getAuth();
//       const currentUser = auth.currentUser;
//       if (!currentUser) {
//         console.error('No user is logged in.');
//         return;
//       }

//       await addDoc(collection(db, 'uploads'), {
//         ...formData,
//         ownerId: currentUser.uid,
//         createdAt: serverTimestamp()
//       });

//       handleCloseUpload();
//     } catch (error) {
//       console.error('Error uploading data:', error);
//     }
//   };

//   // Profile click handler
//   const handleProfileClick = () => {
//   const auth = getAuth();
//   const user = auth.currentUser;

//   if (user) {
//     const newUserInfo = {
//       displayName: user.email ? user.email.split("@")[0] : "Anonymous",
//       email: user.email,
//       uid: user.uid,
//       role: role || "Not defined",
//     };

//     setUserInfo(newUserInfo);
//     setActiveView("userInfo");   // Navbar internal state
//     setShowModal(false);         // close upload
//     setShowProfileOnly(true);    // <-- tell App to hide other pages
//   } else {
//     setUserInfo(null);
//     setActiveView(null);
//     setShowProfileOnly(false);
//   }
// };

//   // Navigate links and close other views
//   const navigateAndClose = (to) => {
//     closeAllViews();
//     navigate(to);
//   };

//   return (
//     <>
//       {/* Navbar */}
//       <div className="navbar">
//         <Link to="/" onClick={closeAllViews} className="logo">
//           <img src="/projectLogo.png" alt="Logo" width={150} style={{ cursor: 'pointer' }} />
//         </Link>

//         <div className="nav-links">
//           {!role || role === "null" || role === "" ? (
//             <Link to="/signup" className="nav-btn signup-btn" onClick={() => navigateAndClose('/signup')}>Signup</Link>
//           ) : null}

//           {role === 'owner' && (
//             <>
//               <span onClick={handleShowUpload} className='Upload'>Upload</span>
//               <Link to="/myevents" onClick={() => navigateAndClose('/myevents')}>My Events</Link>
//               <Link to="/bookings" onClick={() => navigateAndClose('/bookings')}>Bookings</Link>
//               <span id="profilelogo" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
//                 <CgProfile />
//               </span>
//               <span onClick={handleLogout} className='Logbtn'>Logout</span>
//             </>
//           )}

//           {role === 'tenant' && (
//             <>
//               <Link to="/Events" onClick={() => navigateAndClose('/Events')}>Events</Link>
//               <Link to="/mybookings" onClick={() => navigateAndClose('/mybookings')}>My Bookings</Link>
//               <span id="profilelogo" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
//                 <CgProfile />
//               </span>
//               <span onClick={handleLogout} className='Logbtn'>Logout</span>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Upload Modal */}
//       {activeView === 'upload' && (
//         <Modal show={true} onHide={handleCloseUpload} backdrop="static" keyboard={false}>
//           <Modal.Header closeButton>
//             <Modal.Title>Upload Form</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <Form onSubmit={handleSubmitUpload}>
//               {['title','description','city','capacity','price'].map((field, idx) => (
//                 <Form.Group className="mb-3" key={idx}>
//                   <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
//                   <Form.Control
//                     type={field === 'capacity' || field === 'price' ? 'number' : 'text'}
//                     placeholder={`Enter ${field}`}
//                     name={field}
//                     value={formData[field]}
//                     onChange={handleChange}
//                     required
//                     as={field === 'description' ? 'textarea' : undefined}
//                     rows={field === 'description' ? 3 : undefined}
//                   />
//                 </Form.Group>
//               ))}

//               <Form.Group className="mb-3">
//                 <Form.Label>Upload Image URLs</Form.Label>
//                 {formData.fileUrl.map((url, index) => (
//                   <div key={index} className="d-flex mb-2">
//                     <Form.Control
//                       type="url"
//                       placeholder={`Enter image URL ${index + 1}`}
//                       value={url}
//                       onChange={(e) => handleFileUrlChange(e.target.value, index)}
//                       required
//                     />
//                     {formData.fileUrl.length > 1 && (
//                       <Button
//                         variant="danger"
//                         size="sm"
//                         className="ms-2"
//                         onClick={() => removeFileUrlField(index)}
//                       >
//                         &times;
//                       </Button>
//                     )}
//                   </div>
//                 ))}
//                 <Button variant="secondary" size="sm" onClick={addFileUrlField} className="mt-2">
//                   + Add Another URL
//                 </Button>
//               </Form.Group>

//               <Modal.Footer>
//                 <Button variant="secondary" onClick={handleCloseUpload}>Close</Button>
//                 <Button variant="primary" type="submit">Submit</Button>
//               </Modal.Footer>
//             </Form>
//           </Modal.Body>
//         </Modal>
//       )}

//       {/* Profile Card */}
//       {activeView === 'userInfo' && userInfo && (
//         <div className="user-info-box" role="dialog" aria-label="User Info">
//           <p><strong>Name:</strong> {userInfo.displayName}</p>
//           <p><strong>Email:</strong> {userInfo.email}</p>
//           <p><strong>UID:</strong> {userInfo.uid}</p>
//           <p><strong>Role:</strong> {userInfo.role}</p>
//         </div>
//       )}
//     </>
//   );
// };

// export default Navbar;














import React, { useState, useEffect, useRef } from 'react';
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
  const profileRef = useRef(null);

  const [activeView, setActiveView] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    capacity: '',
    price: '',
    fileUrl: [''],
  });

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) setRole(storedRole);
  }, [setRole]);

  // Close everything
  const closeAllViews = () => {
    setActiveView(null);
    setShowModal(false);
    setUserInfo(null);
    setFormData({
      title: '',
      description: '',
      city: '',
      capacity: '',
      price: '',
      fileUrl: [''],
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    setRole(null);
    closeAllViews();
    navigate('/');
  };

  // Upload modal handlers
  const handleShowUpload = () => {
    closeAllViews();
    setActiveView('upload');
    setShowModal(true);
  };

  const handleCloseUpload = () => {
    setShowModal(false);
    setActiveView(null);
    setFormData({
      title: '',
      description: '',
      city: '',
      capacity: '',
      price: '',
      fileUrl: [''],
    });
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileUrlChange = (value, index) => {
    const newFileUrls = [...formData.fileUrl];
    newFileUrls[index] = value;
    setFormData({ ...formData, fileUrl: newFileUrls });
  };

  const addFileUrlField = () => setFormData({ ...formData, fileUrl: [...formData.fileUrl, ''] });
  const removeFileUrlField = (index) => setFormData({ ...formData, fileUrl: formData.fileUrl.filter((_, i) => i !== index) });

  const handleSubmitUpload = async (e) => {
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

      handleCloseUpload();
    } catch (error) {
      console.error('Error uploading data:', error);
    }
  };

  // Profile click handler - SIMPLIFIED
  const handleProfileClick = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const newUserInfo = {
        displayName: user.displayName || (user.email ? user.email.split("@")[0] : "Anonymous"),
        email: user.email,
        uid: user.uid.substring(0, 8) + "...",
        role: role || "Not defined",
      };

      // Toggle profile view
      if (activeView === "userInfo") {
        setActiveView(null);
        setUserInfo(null);
      } else {
        setUserInfo(newUserInfo);
        setActiveView("userInfo");
        setShowModal(false);
      }
    }
  };

  // Click outside to close profile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        // Check if click is on profile icon
        const profileIcon = document.getElementById('profilelogo');
        if (profileIcon && !profileIcon.contains(event.target)) {
          setActiveView(null);
          setUserInfo(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Navigate links and close other views
  const navigateAndClose = (to) => {
    closeAllViews();
    navigate(to);
  };

  return (
    <>
      {/* Navbar */}
      <div className="navbar" ref={profileRef}>
        <Link to="/" onClick={closeAllViews} className="logo">
          <img src="/projectLogo.png" alt="Logo" width={150} style={{ cursor: 'pointer' }} />
        </Link>

        <div className="nav-links">
          {!role || role === "null" || role === "" ? (
            <Link to="/signup" className="nav-btn signup-btn" onClick={() => navigateAndClose('/signup')}>Signup</Link>
          ) : null}

          {role === 'owner' && (
            <>
              <span onClick={handleShowUpload} className='Upload'>Upload</span>
              <Link to="/myevents" onClick={() => navigateAndClose('/myevents')}>My Events</Link>
              <Link to="/bookings" onClick={() => navigateAndClose('/bookings')}>Bookings</Link>
              <span id="profilelogo" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
                <CgProfile />
              </span>
              <span onClick={handleLogout} className='Logbtn'>Logout</span>
            </>
          )}

          {role === 'tenant' && (
            <>
              <Link to="/Events" onClick={() => navigateAndClose('/Events')}>Events</Link>
              <Link to="/mybookings" onClick={() => navigateAndClose('/mybookings')}>My Bookings</Link>
              <span id="profilelogo" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
                <CgProfile />
              </span>
              <span onClick={handleLogout} className='Logbtn'>Logout</span>
            </>
          )}
        </div>

        {/* Profile Card - MOVED INSIDE NAVBAR */}
        {activeView === 'userInfo' && userInfo && (
          <div className="user-info-box" role="dialog" aria-label="User Info">
            <div className="profile-header">
              <h4>Profile Information</h4>
              <button 
                onClick={() => setActiveView(null)}
                className="close-profile-btn"
              >
                ×
              </button>
            </div>
            <div className="profile-content">
              <p><strong>Name:</strong> {userInfo.displayName}</p>
              <p><strong>Email:</strong> {userInfo.email}</p>
              <p><strong>User ID:</strong> {userInfo.uid}</p>
              <p><strong>Role:</strong> {userInfo.role}</p>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {activeView === 'upload' && (
        <Modal show={true} onHide={handleCloseUpload} backdrop="static" keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>Upload Form</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmitUpload}>
              {['title','description','city','capacity','price'].map((field, idx) => (
                <Form.Group className="mb-3" key={idx}>
                  <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                  <Form.Control
                    type={field === 'capacity' || field === 'price' ? 'number' : 'text'}
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
                <Button variant="secondary" onClick={handleCloseUpload}>Close</Button>
                <Button variant="primary" type="submit">Submit</Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default Navbar;