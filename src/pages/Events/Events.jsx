import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../Firebase/FirebaseConfig';
import './Events.css';
import { Spinner, Carousel, Modal, Button, Form } from 'react-bootstrap';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [confirmedDetails, setConfirmedDetails] = useState(null);

  const printRef = useRef();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollection = collection(db, 'uploads');
        const querySnapshot = await getDocs(eventsCollection);
        const eventList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(eventList);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleBookNow = () => {
    setCarouselIndex(0);
    setFormData({ name: '', email: '', phone: '', date: '' });
    setShowModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.date) {
      alert("Please fill all details.");
      return;
    }

    const selectedImage = Array.isArray(selectedEvent.fileUrl)
      ? selectedEvent.fileUrl[carouselIndex]
      : selectedEvent.fileUrl;

    const details = {
      ...formData,
      title: selectedEvent.title,
      location: selectedEvent.city,
      price: selectedEvent.price,
      selectedImage,
      slideIndex: carouselIndex + 1,
      eventId: selectedEvent.id,
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, "bookings"), details);
      console.log("Booking stored successfully");
    } catch (error) {
      console.error("Error storing booking: ", error);
      alert("Failed to store booking. Try again.");
      return;
    }

    setConfirmedDetails(details);
    setShowModal(false);
    setFormData({ name: '', email: '', phone: '', date: '' });
    setCarouselIndex(0);
  };

  const handleCarouselSelect = (selectedIndex) => {
    setCarouselIndex(selectedIndex);
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePrint = () => {
    const content = printRef.current;
    const pri = window.open('', '', 'height=600,width=800');
    pri.document.write('<html><head><title>Booking Confirmation</title>');
    pri.document.write('<style>body{font-family:sans-serif;padding:20px;} img{max-width:100%;}</style>');
    pri.document.write('</head><body>');
    pri.document.write(content.innerHTML);
    pri.document.write('</body></html>');
    pri.document.close();
    pri.focus();
    pri.print();
    pri.close();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="events-container">
      {!confirmedDetails && <h2>Available Events</h2>}

      {confirmedDetails && (
        <div ref={printRef} className="confirmed-card shadow-sm p-4 mb-4 bg-white rounded border mx-auto">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0 text-primary">Booking Confirmed</h5>
            <button
              onClick={() => {
                setConfirmedDetails(null);
                setSelectedEvent(null);
              }}
              className="btn btn-sm btn-outline-danger"
            >
              ×
            </button>
          </div>
          <div className="mb-3">
            <p><strong>Name:</strong> {confirmedDetails.name}</p>
            <p><strong>Email:</strong> {confirmedDetails.email}</p>
            <p><strong>Phone:</strong> {confirmedDetails.phone}</p>
            <p><strong>Date:</strong> {confirmedDetails.date}</p>
            <p><strong>Event:</strong> {confirmedDetails.title}</p>
            <p><strong>Location:</strong> {confirmedDetails.location}</p>
            <p><strong>Price:</strong> ₹{confirmedDetails.price}</p>
          </div>
          <div className="text-end">
            <Button variant="outline-primary" onClick={handlePrint}>Print Confirmation</Button>
          </div>
        </div>
      )}

      {!selectedEvent && !confirmedDetails && (
        <ul className="events-list">
          {events.map(event => (
            <li key={event.id} className="event-item" onClick={() => setSelectedEvent(event)}>
              <h3>{event.title}</h3>
              <p><strong>Location:</strong> {event.city}</p>
              {event.fileUrl && (
                <img
                  src={Array.isArray(event.fileUrl) ? event.fileUrl[0] : event.fileUrl}
                  alt={event.title}
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                />
              )}
            </li>
          ))}
        </ul>
      )}

      {selectedEvent && !confirmedDetails && (
        <div className="event-details">
          <button className="back-button" onClick={() => setSelectedEvent(null)}>← Back</button>
          <h3>{selectedEvent.title}</h3>
          <p><strong>Location:</strong> {selectedEvent.city}</p>
          <p><strong>Description:</strong> {selectedEvent.description}</p>
          <p><strong>Capacity:</strong> {selectedEvent.capacity}</p>
          <p><strong>Price:</strong> ₹{selectedEvent.price}</p>

          {selectedEvent.fileUrl && (
            Array.isArray(selectedEvent.fileUrl) ? (
              <Carousel>
                {selectedEvent.fileUrl.map((url, index) => (
                  <Carousel.Item key={index}>
                    <img className="d-block w-100" src={url} alt={`Slide ${index + 1}`} />
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              <img className="d-block w-100" src={selectedEvent.fileUrl} alt={selectedEvent.title} />
            )
          )}

          <button className="book-btn" onClick={handleBookNow}>Book Now</button>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Confirm Booking - {selectedEvent?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="mt-3">
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} required />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Date of Booking</Form.Label>
              <Form.Control type="date" name="date" value={formData.date} onChange={handleInputChange} required />
            </Form.Group>

            <hr />
            <p><strong>Event Title:</strong> {selectedEvent?.title}</p>
            <p><strong>Location:</strong> {selectedEvent?.city}</p>
            <p><strong>Price:</strong> ₹{selectedEvent?.price}</p>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleConfirmBooking}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Events;





