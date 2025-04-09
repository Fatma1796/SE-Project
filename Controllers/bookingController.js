
const Booking = require("../Models/Booking");
const Event = require("../Models/Event");

// Book tickets for an event
const bookTickets = async (req, res) => {
  try {
    const { eventId, ticketsBooked } = req.body;
    const userId = req.user.id;

    if (!eventId || !ticketsBooked) {
      return res.status(400).json({ message: "Event ID and ticketsBooked are required" });
    }

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check ticket availability
    if (event.availableTickets < ticketsBooked) {
      return res.status(400).json({ message: "Not enough tickets available" });
    }

    // Calculate total price
    const totalPrice = ticketsBooked * event.price;

    // Create booking
    const booking = await Booking.create({
      userId,
      eventId,
      ticketsBooked,
      totalPrice,
    });

    // Update event's available tickets
    event.availableTickets -= ticketsBooked;
    await event.save();

    res.status(201).json({ message: "Booking successful", booking });
  } catch (error) {
    res.status(500).json({ message: error.message || "An error occurred while booking tickets" });
  }
};

// Get booking details by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("eventId");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message || "An error occurred while fetching the booking" });
  }
};