const http = require('http');
const {Server} = require('socket.io');
const express = require('express');
const connectDB = require('./config/db');
const eventRoutes = require('./routes/eventRoutes');
const cors = require('cors');
const cron = require('node-cron');
const Event = require('./models/Event');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(express.json());
app.use(cors());

connectDB();

// Routes
app.use('/api/events', eventRoutes);

// Set up WebSocket connection

io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Broadcast notifications
  socket.on('newEventNotification', (data) => {
    io.emit('eventUpdate', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


// Schedule a task to run every minute to check for events starting in the next 30 minutes
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const thirtyMinutesLater = new Date(now.getTime() + 30 * 60 * 1000);

  try {
    // Find events that start within the next 30 minutes
    const upcomingEvents = await Event.find({
      date: {
        $gte: now, // greater than current time
        $lte: thirtyMinutesLater // less than 30 minutes from now
      }
    });

    if (upcomingEvents.length > 0) {
      upcomingEvents.forEach((event) => {
        // Emit a notification to all connected clients
        io.emit('eventUpdate', `Upcoming event: ${event.sport} at ${event.venue} starts in less than 30 minutes!`);
      });
    }
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
  }
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
