import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000');

function LiveUpdates() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('eventUpdate', (data) => {
      setMessage(data.message);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <h2>Live Event Updates</h2>
      <p>{message}</p>
    </div>
  );
}

export default LiveUpdates;
