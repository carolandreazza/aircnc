import React, { useState } from 'react';
import api from '../../services/api';

export default function Login({ history }) {
    //history: p/ fazer a navegação
    
    const [email, setEmail] = useState(''); // estado. sempre q buscar o valor da variável email, vai trazer o último valor dela
    //setEmail serve pra atualizar o valor do email, lá no <input type="email"..onChange..

  async function handleSubmit(event){
    event.preventDefault();/* p/ não fazer o funcionamento padrão da tela, q nesse caso é redirecionar p/ outro lugar*/
      
    const response = await api.post('/sessions', { email });

    const { _id } = response.data;

    localStorage.setItem('user', _id);
    //localStorage: banco de dados do navegador
    history.push('/dashboard')
  }

    return (  
      //precisa estar dentro de uma tag - <> é uma tag vazia: fragmente        
      <>            
        <p>
            Ofereça <strong>spots</strong> para programadores e encontre <strong>talentos</strong> para sua empresa
        </p>
        <form onSubmit={handleSubmit}>
            <label htmlFor="email">E-MAIL *</label>
            <input type="email" id="email" placeholder="Seu melhor e-mail" value={email} onChange={event => setEmail(event.target.value)}/>
            <button className="btn" type="submit">Entrar</button>
        </form>
      </>
    );
    
}