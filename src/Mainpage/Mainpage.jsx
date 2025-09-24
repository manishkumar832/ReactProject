import React, { useState, useEffect } from "react";
import "./Mainpage.css";
import { FaInstagram, FaTwitter, FaFacebookF } from "react-icons/fa";

function Mainpage() {
  const heroImages = [
    "https://wallpapers.com/images/hd/corporate-event-2048-x-1004-wallpaper-s5lftvht2yeiri7u.jpg",
    "https://static.punjabkesari.in/multimedia/15_15_122274940mandap-decor-2.jpg",
    "https://bnbtplstorageaccount.blob.core.windows.net/theaterpics/platinum1.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mainpage">
      {/* HERO SECTION */}
      <section
        className="hero"
        style={{ backgroundImage: `url(${heroImages[currentImage]})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>VenueVerse</h1>
          <p>Where Elegance Meets Celebration</p>
          <button className="explore-btn">Explore Venues</button>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories">
        <div className="category-card">
          <img src="/marriage.jpeg" alt="Weddings" />
          <h3>Weddings</h3>
        </div>
        <div className="category-card">
          <img src="/birthday theater.jpg" alt="Birthdays" />
          <h3>Birthdays</h3>
        </div>
        <div className="category-card">
          <img src="https://eoiaddisababa.gov.in/wp-content/uploads/2023/11/pharma-conference-b2b-meeting-20-nov-2023-2-3.jpg" alt="Corporate" />
          <h3>Corporate</h3>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about">
        <h2>About VenueVerse</h2>
        <p>
          VenueVerse is your gateway to the most luxurious event venues across
          the city. From fairy-tale weddings to professional corporate events,
          we make your moments unforgettable.
        </p>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <h2>What Our Clients Say</h2>
        <div className="testimonial-cards">
          <div className="testimonial">
            <p>
              “VenueVerse turned my wedding into a dream come true. The
              attention to detail was unmatched.”
            </p>
            <span>- Priya Sharma</span>
          </div>
          <div className="testimonial">
            <p>
              “From booking to decor, everything was smooth and perfect for my
              birthday.”
            </p>
            <span>- Rohit Mehta</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} VenueVerse. All rights reserved.</p>
          <div className="social-icons">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Mainpage;


