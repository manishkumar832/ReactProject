import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../Firebase/FirebaseConfig";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const q = query(
          collection(db, "bookings"),
          where("email", "==", user.email)
        );

        const querySnapshot = await getDocs(q);
        const bookingsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBookings(bookingsData);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (bookings.length === 0) return <p>No bookings found.</p>;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px", padding: "20px" }}>
      <h2    style={{
    gridColumn: "1 / -1",
    fontSize: "1.8rem",
    fontWeight: "600",
    color: "#94979bff",
    textAlign: "center",
    fontFamily:"-moz-initial",
    marginBottom: "10px",
    padding: "8px 0",
    borderBottom: "2px solid #080d13ff",
    width: "fit-content",
    marginLeft: "auto",
    marginRight: "auto"
  }}>Bookings</h2>
      {bookings.map(b => (
        <div key={b.id} style={{ border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden", background: "#fff" }}>
          <img
            src={b.selectedImage}
            alt={b.title}
            style={{ width: "100%", height: "200px", objectFit: "cover" }}
          />
          <div style={{ padding: "10px" }}>
            <h3 style={{ margin: "0 0 5px" }}>{b.title}</h3>
            <p style={{ margin: "0", fontSize: "14px", color: "#555" }}>
              📅 {b.date}
            </p>
            <p style={{ margin: "5px 0", fontWeight: "bold", color: "#333" }}>
              💰 ₹{b.price}
            </p>
            <span style={{ fontSize: "13px", color: "green", fontWeight: "bold" }}>
              ✅ Booked
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyBookings;


