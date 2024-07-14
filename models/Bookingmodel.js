const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingVenueSchema = new Schema({
    venueId: {
        type: Schema.Types.ObjectId,
        ref: 'Venue',
        required: true
    },
    venueName: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    totalDays: {
        type: Number,
        required: true
    },
    transactionId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['booked', 'cancelled'],
        default: 'booked'
    }
});

const BookingVenue = mongoose.model('BookingVenue', bookingVenueSchema);

module.exports = BookingVenue;
