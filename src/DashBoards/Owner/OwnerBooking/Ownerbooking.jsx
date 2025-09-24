import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../Firebase/FirebaseConfig";
import "./Owner.css"

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log("No owner logged in");
        setLoading(false);
        return;
      }

      try {
        // Step 1: Get events owned by the logged-in owner
        const uploadsRef = collection(db, "uploads");
        const uploadsQuery = query(uploadsRef, where("ownerId", "==", user.uid));
        const uploadsSnap = await getDocs(uploadsQuery);

        const ownerEventIds = uploadsSnap.docs.map((doc) => doc.id);

        if (ownerEventIds.length === 0) {
          console.log("No events found for this owner");
          setBookings([]);
          setLoading(false);
          return;
        }

        // Step 2: Get bookings for these events
        const bookingsRef = collection(db, "bookings");
        const bookingsSnap = await getDocs(bookingsRef);

        // Filter bookings that belong to the owner's events
        const ownerBookings = bookingsSnap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((b) => ownerEventIds.includes(b.eventId));

        setBookings(ownerBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading bookings...</p>;

  return (
  <div className="booking">
    <h2>Bookings for My Events</h2>
    {bookings.length === 0 ? (
      <p>No bookings found.</p>
    ) : (
      <div className="bookings-container">
        {bookings.map((b) => (
          <div className="booking-card" key={b.id}>
            {b.selectedImage && (
              <img src={b.selectedImage} alt={b.title} />
            )}
            <div className="booking-card-content">
              <h3>{b.title}</h3>
              <p><strong>Tenant Name:</strong> {b.name}</p>
              <p><strong>Email:</strong> {b.email}</p>
              <p><strong>Phone:</strong> {b.phone}</p>
              <p><strong>Location:</strong> {b.location}</p>
              <p><strong>Date:</strong> {b.date}</p>
              <p><strong>Price:</strong> {b.price}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
};

export default OwnerBookings;




