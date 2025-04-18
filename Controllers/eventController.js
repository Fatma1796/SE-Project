const Event = require("../Models/Event");
const Booking = require("../Models/Booking");
const User = require("../Models/User");





exports.getAllEvents = async (req, res) => {
  try {
    console.log("Fetching events from database...");
    const events = await Event.find({ status: "pending" }); // Fetch only approved events
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

exports.createEvent = async (req, res) => {
  try {
    console.log("Authenticated user:", req.user);  // Log authenticated user to check the _id

    if (!req.user || !req.user._id) {
      return res.status(400).json({ message: "User authentication failed or missing user ID" });
    }

    const { title, description, eventDate, location, category, image, ticketPrice, totalTickets, remainingTickets } = req.body;

    if (!title || !description || !eventDate || !location || !category || !ticketPrice || !totalTickets) {
      return res.status(400).json({ message: "Missing required fields" });
    }

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
      organizer: req.user._id,  // Attach the organizer from the authenticated user
      status: "pending"
    });

    await event.save();
    res.status(201).json(event);

  } catch (err) {
    console.error("Error in createEvent:", err.message);
    console.error("Stack trace:", err.stack);

    res.status(500).json({ message: "Server error", error: err.message });
  }
};




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


// // Organizer: Analytics
// exports.getEventAnalytics = async (req, res) => {
//   try {
//     const events = await Event.find({ organizer: req.user._id });

//     const analytics = events.map((event) => {
//       const booked = event.tickets - event.availableTickets;
//       const percent = event.tickets === 0 ? 0 : ((booked / event.tickets) * 100).toFixed(2);
//       return {
//         eventId: event._id,
//         title: event.title,
//         percentageBooked: `${percent}%`
//       };
//     });

//     res.status(200).json(analytics);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }



exports.getOrganizerEventAnalyticsForUser = async (req, res) => {
  console.log("Inside getOrganizerEventAnalyticsForUser"); // This should print when the route is hit
  try {
    const organizerId = req.user.id;  // The logged-in organizer's ID
    console.log("Organizer ID:", organizerId);  // Check the organizer ID

    // Find the last logged-in Standard User by checking the `lastLogin` field
    const lastLoggedInUser = await User.findOne({ role: 'Standard User' }).sort({ lastLogin: -1 });
    console.log("Last Logged In User:", lastLoggedInUser); // Log the last logged-in user

    if (!lastLoggedInUser) {
      return res.status(404).json({ message: "No standard users found" });
    }

    const userId = lastLoggedInUser._id; // Get the last logged-in user's ID
    console.log("Last Logged In User ID:", userId); // Log the userId being used

    // Get all bookings for the specified Standard User
    const bookings = await Booking.find({ user: userId }).populate("event");
    console.log("Bookings:", bookings); // Log the bookings found for the user

    // Filter bookings to only those events created by the current organizer
    const organizerEvents = bookings.filter(booking => booking.event.organizer.toString() === organizerId.toString());
    console.log("Organizer Events:", organizerEvents); // Log the filtered organizer events

    if (organizerEvents.length === 0) {
      return res.status(404).json({ message: "No events found for this user created by the organizer" });
    }

    // Prepare analytics for each event
    const analytics = organizerEvents.map(booking => {
      const event = booking.event;
      const totalTickets = event.totalTickets;
      const remainingTickets = event.remainingTickets;
      const ticketsBooked = totalTickets - remainingTickets;
      const bookedPercentage = (ticketsBooked / totalTickets) * 100;

      return {
        eventId: event._id,
        title: event.title,
        totalTickets,
        ticketsBooked,
        bookedPercentage: Number(bookedPercentage.toFixed(2)),
        status: event.status
      };
    });

    console.log("Analytics:", analytics); // Log the analytics data

    res.status(200).json({ analytics });
  } catch (error) {
    console.error("Error in getOrganizerEventAnalyticsForUser:", error.message);
    res.status(500).json({ message: "Failed to get event analytics for the user" });
  }
};



  // module.exports = {
  //   getOrganizerEventAnalyticsForUser,
  // };
