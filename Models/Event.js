const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    eventDate: { type: Date, required: true },
    location: { type: String, required: true },
    category: { type: String },
    image: { type: String }, // URL or file path
    ticketPrice: { type: Number, required: true, min: 0 },
    totalTickets: { type: Number, required: true, min: 0 },
    remainingTickets: { type: Number, required: true, min: 0 },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, //reference (ObjectId) to the User model
    status: { type: String, enum: ['approved', 'pending', 'declined'], default: "approved" }, //status of the event
    createdAt: { type: Date, default: Date.now } //timestamp? //createdAt automatically stores when the event was created
});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;
