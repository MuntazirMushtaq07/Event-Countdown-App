import React, { useState, useEffect } from "react";
import "../assets/Style/Countdown.css";

function Countdown() {
  // State for input fields
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [timeLeftList, setTimeLeftList] = useState([]);


  // State to hold all events
  const [events, setEvents] = useState([]);

  // Load saved events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  useEffect(() => {
  const timer = setInterval(() => {
    const updated = events.map((event) => getTimeLeftString(event.date));
    setTimeLeftList(updated);
  }, 1000);

  return () => clearInterval(timer); // cleanup on unmount
}, [events]);


  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Don't allow empty input
    if (!eventName || !eventDate) return;

    // Create new event
    const newEvent = { name: eventName, date: eventDate };
    const updatedEvents = [...events, newEvent];

    // Update state and localStorage
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));

    // Clear input fields
    setEventName("");
    setEventDate("");
  };

  // Handle deleting an event
  const handleDelete = (indexToDelete) => {
    const updatedEvents = events.filter((_, index) => index !== indexToDelete);
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  // Converts ms difference into "Xd Xh Xm Xs" format
const getTimeLeftString = (eventDate) => {
  const now = new Date();
  const target = new Date(eventDate);
  const diff = target - now;

  if (diff <= 0) return "⏰ Time's up!";

  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / 1000 / 60) % 60;
  const hours = Math.floor(diff / 1000 / 60 / 60) % 24;
  const days = Math.floor(diff / 1000 / 60 / 60 / 24);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};


  return (
    <div className="countdown-container">
      {/* App Heading */}
      <h1 className="countdown-title">🎉 Event Countdown</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="countdown-form">
        <div className="form-group">
          <label className="form-label">Event Name</label>
          <input
            type="text"
            className="form-input"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g. My Birthday"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Event Date & Time</label>
          <input
            type="datetime-local"
            className="form-input"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </div>

        <button type="submit" className="submit-button">
          ➕ Add Event
        </button>
      </form>

      <hr className="divider" />

      {/* Event List */}
      <h3 className="event-list-title">📅 Upcoming Events</h3>
      <div className="event-list">
        {events.map((event, index) => (
          <div key={index} className="event-card">
            <p className="event-name">{event.name}</p>
            <p className="event-date">
  {new Date(event.date).toLocaleString()}
</p>
<p className="countdown-text">
  ⏳ {timeLeftList[index] || "Loading..."}
</p>

            <button
              className="delete-button"
              onClick={() => handleDelete(index)}
            >
              ❌ Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Countdown;
