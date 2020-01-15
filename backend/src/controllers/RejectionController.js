const Booking = require('../models/Booking');

module.exports = {
    async store(req, res) {
        const { booking_id } = req.params;

        const booking = await (await Booking.findById(booking_id).populate('spot'));

        booking.approved = false;

        await booking.save();

        
        const bookingUserSocket = req.connectedUsers[booking.user];//dono do spot 

        if(bookingUserSocket) { // ve se esse usuário está com 1 conecção ativa
            req.io.to(bookingUserSocket).emit('booking_response', booking); // enviar 1 única msg e o to(é pra quem enviar)
        }

        return res.json(booking);
    }
};