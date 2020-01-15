//index (lista de sessões), show (listar 1 única sessão), store (criar 1 única sessão), update, destroy (delete 1 única sessão)
const User = require('../models/User');

module.exports = {
    async store(req, res){
       const { email } = req.body; //com as {} no email é como se fosse req.body.email - desestruturação

       let user = await User.findOne({ email });

       if(!user) {
        user = await User.create({ email });
       }

       return res.json(user);
    }
};