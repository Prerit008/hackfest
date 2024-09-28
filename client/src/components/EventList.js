// EventList.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Connect to WebSocket
    const socket = io();

    // Listen for event updates
    socket.on('eventUpdate', (data) => {
      setNotifications((prev) => [...prev, data]);
    });


    fetch('/api/events')
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(`HTTP error! status: ${response.status}, response: ${text}`);
        });
      }
      return response.json();
    })
    .then((data) => {
      setEvents(data);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching events:', error);
      setLoading(false);
    });
    
    return () => socket.disconnect();
}, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Olympic Event Schedule</h1>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <strong>{event.name}</strong> - {event.sport} - {event.venue} -{' '}
            {new Date(event.date).toDateString()} - {event.time}
            <br />
            <strong>Athletes:</strong> {event.athletes.join(', ')}
            <br />
            <strong>Status:</strong> {event.status}
          </li>
        ))}
      </ul>

        {/* Display real-time notifications */}
        <h2>Notifications</h2>
      <ul>
        {notifications.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
      
    </div>
  );
}

export default EventList;
