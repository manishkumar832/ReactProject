import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../Firebase/FirebaseConfig'; // adjust path if needed
import "./owner.css"
import { getAuth } from 'firebase/auth';
import { Carousel } from 'react-bootstrap';
import {Spinner} from 'react-bootstrap'


const OwnerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchEvents = async () => {
    try {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    console.error("No user is logged in");
    return;
  }

  const q = query(collection(db, 'uploads'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);

  const eventData = querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(event => event.ownerId === currentUser.uid);

  setEvents(eventData);
  setLoading(false); // ✅ this was missing
} catch (error) {
  console.error('Error fetching events:', error);
  setLoading(false); // also handle loading in error case
}
  }

  fetchEvents();
}, []);

if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <Spinner animation="border" variant="primary" />
        </div>
      );
    }

  return (
    <div className="dashboard-container">
  

      {/* You can put other dashboard info here */}

      <div className="event-cards">
        {events.map((event) => (
          <div className="event-card" key={event.id}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            {event.fileUrl && (
  Array.isArray(event.fileUrl) ? (
    event.fileUrl.length === 1 ? (
      <img
        src={event.fileUrl[0]}
        alt={event.title}
        style={{ width: "100%", height: "auto", objectFit: "cover" }}
      />
    ) : (
      <Carousel>
        {event.fileUrl.map((url, index) => (
          <Carousel.Item key={index}>
            <img
              src={url}
              alt={`Slide ${index + 1}`}
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    )
  ) : (
    <img
      src={event.fileUrl}
      alt={event.title}
      style={{ width: "100%", height: "auto", objectFit: "cover" }}
    />
  )
)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerDashboard;

