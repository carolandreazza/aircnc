const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// dependências para msg em tempo real
const socketio = require('socket.io');
const http = require('http');


const routes = require('./routes');

const app = express();
const server = http.Server(app);// p/ msg em tempo real
const io = socketio(server);// p/ msg em tempo real

const connectedUsers = {}; 


mongoose.connect('mongodb+srv://carol:1234@omnistack-9ff2p.mongodb.net/aircnc?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})


//io para anotar todos os usuários logados na aplicação
io.on('connection', socket => {
    //console.log(socket.handshake.query); 
    //console.log('Usuário conectado', socket.id); // cada conexão tem 1 socket.id

     const { user_id } = socket.handshake.query;

     connectedUsers[user_id] = socket.id;

//     socket.emit('nameMessage', 'Hello')
 });// a outra parte está no frontend ln 12

 // deixar o user_id vis[ivel p/ toda aplicação - o use add uma funcionalidade em toda a rota
 app.use((req, res, next) => { //o next é uma função q permite continuar o fluxo, já q aqui não devolve 1 resposta. aí depois continua nas rotas a baixo
    req.io = io; //envia ou recebe msg no front e mobile
    req.connectedUsers = connectedUsers; // usuários conectados na aplicação

    return next();
 })

//GET, POST, PUT, DELETE
//req.query = acessar query params (p/ filtros)
//req.params = acessar route params (p/ edição e delete)
//req.body = acessar corpo da reqisição (p/ criação e edição)

app.use(cors()); //dentro iria o endereço que pode asessar. p/ endereços indesejados não acessarem o backend/api
// cors({ origin: 'http://...'})
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);


server.listen(3333); 
//seria app ao invés de server, mas alterado p/ msg em tempo real
