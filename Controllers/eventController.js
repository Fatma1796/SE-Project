const Event = require("../Models/Event");
const Booking = require("../Models/Booking");

// Get all approved events (public)
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get event by ID (public)
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Organizer: Create event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, tickets, price } = req.body;

    const event = new Event({
      title,
      description,
      date,
      location,
      tickets,
      availableTickets: tickets,
      price,
      organizer: req.user._id,
      status: "pending"
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Organizer: Update event (tickets, date, location)
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizer.toString() !== req.user._id) {
      return res.status(403).json({ message: "You can only update your own events" });
    }

    const allowedFields = ["tickets", "date", "location"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "tickets") {
          const diff = req.body.tickets - event.tickets;
          event.availableTickets += diff;
        }
        event[field] = req.body[field];
      }
    });

    await event.save();
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Organizer: Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizer.toString() !== req.user._id) {
      return res.status(403).json({ message: "You can only delete your own events" });
    }

    await event.deleteOne();
    res.status(200).json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Approve or reject event
exports.updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "pending", "declined"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.status = status;
    await event.save();
    res.status(200).json({ message: `Event marked as ${status}` });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Organizer: Analytics
exports.getEventAnalytics = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id });

    const analytics = events.map((event) => {
      const booked = event.tickets - event.availableTickets;
      const percent = event.tickets === 0 ? 0 : ((booked / event.tickets) * 100).toFixed(2);
      return {
        eventId: event._id,
        title: event.title,
        percentageBooked: `${percent}%`
      };
    });

    res.status(200).json(analytics);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
