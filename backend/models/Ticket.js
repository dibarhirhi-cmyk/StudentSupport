const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    studentName: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: 'General' },
    formalEmail: { type: String, default: '' },
    status: { type: String, default: 'Pending' },
    adminNotes: { type: String, default: '' }, 
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', ticketSchema);