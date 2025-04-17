const Event = require("../Models/Event");
const Booking = require("../Models/Booking");
// module.exports = {
//   getAllEvents,
//   getEventById,
//   createEvent,
//   updateEvent,
//   deleteEvent,
//   getEventAnalytics,
//   updateEventStatus,
// };

// Get all approved events (public)
// exports.getAllEvents = async (req, res) => {
//   try {
//     const events = await Event.find({ status: "confirmed" });
//     res.status(200).json(events);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };
exports.getAllEvents = async (req, res) => {
  try {
    console.log("Fetching events from database...");
    const events = await Event.find({ status: "approved" }); // Fetch only approved events
    console.log("Fetched events:", events); // Log the fetched events
    res.status(200).json(events);
  } catch (err) {
    console.error("Error in getAllEvents:", err);
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
    console.log("Authenticated user:", req.user);
    const { title, description, eventDate, location,category,image, ticketPrice, totalTickets ,remainingTickets} = req.body;

    const event = new Event({
      title,
      description,
      eventDate,
      location,
      category,
      image,
      ticketPrice,
      totalTickets,
      remainingTickets: remainingTickets || totalTickets,
      organizer: req.user._id,
      status: "approved"
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error("Error in createEvent:", err); // Log the actual error

    res.status(500).json({ message: "Server error" });
  }
};


// exports.updateEvent = async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);
//     if (!event) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     // Check if the user is an organizer or admin
//     if (req.user.role !== "Organizer" && req.user.role !== "System admin") {
//       return res.status(403).json({ message: "You do not have permission to update this event" });
//     }

//     // Allowed fields for update based on the schema
//     const allowedFields = [
//       "title",
//       "description",
//       "eventDate",
//       "location",
//       "category",
//       "image",
//       "ticketPrice",
//       "totalTickets",
//       "remainingTickets",
//       "status"
//     ];

//     // Update only the allowed fields
//     for (const field of allowedFields) {
//       if (req.body[field] !== undefined) {
//         event[field] = req.body[field];
//       }
//     }

//     // Save the updated event
//     const updatedEvent = await event.save();
//     res.status(200).json(updatedEvent);
//   } catch (err) {
//     console.error("Error in updateEvent:", err); // Log the error for debugging
//     res.status(500).json({ message: "Server error" });
//   }
// };

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Debugging: Log the user's role
    console.log("User role:", req.user.role);

    // Check if the user is an organizer or admin
    if (req.user.role !== "Organizer" && req.user.role !== "System Admin") {
      return res.status(403).json({ message: "You do not have permission to update this event" });
    }

    // Allowed fields for update based on the schema
    const allowedFields = [
      "title",
      "description",
      "eventDate",
      "location",
      "category",
      "image",
      "ticketPrice",
      "totalTickets",
      "remainingTickets",
      "status"
    ];

    // Update only the allowed fields
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    }

    // Save the updated event
    const updatedEvent = await event.save();
    res.status(200).json(updatedEvent);
  } catch (err) {
    console.error("Error in updateEvent:", err); // Log the error for debugging
    res.status(500).json({ message: "Server error" });
  }

};


exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if the user is an organizer or admin
    if (req.user.role !== "Organizer" && req.user.role !== "System Admin") {
      return res.status(403).json({ message: "You do not have permission to delete this event" });
    }

    // Delete the event
    await event.deleteOne();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Error in deleteEvent:", err); // Log the error for debugging
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
