import React, { useEffect, useState, useMemo } from 'react';
// useMemo = memorizao valor de uma variável até q ela mude
import { Link } from 'react-router-dom';
import socketio from 'socket.io-client';
import api from '../../services/api';

import './styles.css';

export default function Dashboard(){
   // return <h1>TESTE</h1>
    const [spots, setSpots] = useState([]);
    const [requests, setRequests] = useState([]);

    const user_id = localStorage.getItem('user');
    const socket = useMemo(() => socketio('http://localhost:3333', {
        query: { user_id },
    }), [user_id]); // useMemo faz com q a connecção com o usuário (socketio('http://localhost:3333') só seja refeita caso 
    // o [user_id] tenha mudado

    useEffect(() => { // p/ se conectar com o backend e enviar msg em tempo real       
        socket.on('booking_request', data => {
            setRequests([...requests, data]);// ...requests = todos os dados e põe + 1 no fim
        })

        // const socket = socketio('http://localhost:3333', {
        //     query: { user_id },
        // }); -- com isso aqui dentro, ele conecta toda vez de novo
        // socket.on('nameMessage', data => {
        //     console.log(data);
        // }) // sempre q receber uma msg com o nome 'nameMessage' ele emite o log        
    },[requests, socket]);// a outra parte está no backend ln 18
    // o [] só está preenchido pq cada x que os valores mudarem, vai enviar a msg com o socket.on

    useEffect(() => {
        async function loadSpots(){
            const user_id = localStorage.getItem('user');
            const response = await api.get('/dashboard', {
                headers: { user_id },
            });

            setSpots(response.data);
        }

        loadSpots();
    }, []); // array de dependências. no [] vão variáveis q quando sofrerem alteração, o q tem nos {} é executado 
    //[filter] - quando o valor do filtro muda o {} executa
    // quando o [] está vazio é pq vai executar apenas 1x. como uma busca inicial 

    async function handleAccept(id) {
        await api.post(`/bookings/${id}/approvals`); // aprova a requisição

        setRequests(requests.filter(request => request._id !== id)); //filtra todas, removendo a q acabou de aprovar
    }

    async function handleReject(id) {
        await api.post(`/bookings/${id}/rejections`); 

        setRequests(requests.filter(request => request._id !== id)); 
    }

    return (
        <>
            <ul className="notifications">
                {requests.map(request => (
                    <li key={request._id}>
                        <p>
                            <strong>{request.user.email}</strong> está solicitando uma reserva em <strong>{request.spot.company}</strong> para a data: <strong>{request.date}</strong>
                        </p>
                        <button className="accept" onClick={() => handleAccept(request._id)}>ACEITAR</button>
                        <button className="reject" onClick={() => handleReject(request._id)}>REJEITAR</button>
                    </li>
                ))}
            </ul>
            <ul className="spot-list">
                {spots.map(spot => (
                    <li key={spot._id}>
                        <header style={{ backgroundImage: `url(${spot.thumbnail_url})` }}/>
                        <strong>{spot.company}</strong>
                        <span>{spot.price ? `R$${spot.price}/dia` : 'GRATUITO'}</span>
                    </li> 
                ))}
            </ul>

            <Link to="/New">
                <button className="btn">Cadastrar novo spot</button>
            </Link>
        </>
    )
    
}