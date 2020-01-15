const Booking = require('../models/Booking');

module.exports = {
    async store(req, res) {
        const { user_id } = req.headers;
        const { spot_id } = req.params;
        const { date } = req.body;

        const booking = await Booking.create({
            user: user_id,
            spot: spot_id,
            date
        });

        await booking.populate('spot').populate('user').execPopulate(); //traz todas as infos, não só os 
        
        const ownerSocket = req.connectedUsers[booking.spot.user];//dono do spot 

        if(ownerSocket) { // ve se esse usuário está com 1 conecção ativa
            req.io.to(ownerSocket).emit('booking_request', booking); // enviar 1 única msg e o to(é pra quem enviar)
        }

        return res.json(booking);
    }
};