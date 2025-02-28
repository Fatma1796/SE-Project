const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
<<<<<<< HEAD
    {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
      }   
    }
)
=======
{
    numberOfTickets: {
        type: Number,
        required: true,
        min: 1, 
      },
      totalPrice: {
        type: Number, 
        required: true,
        min: 0,
      },
      status: {
        type: String, 
        enum: ["pending", "confirmed", "canceled"],
        default: "pending", 
      },
},
      {
        timestamps: true, 
        }

    
);

module.exports = mongoose.model("Booking", bookingSchema);
>>>>>>> c1d5607f92ad011b4ea152833ed4afa57795eaf1
