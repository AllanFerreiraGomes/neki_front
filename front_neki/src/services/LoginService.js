import { RequestAPI } from './api';

export const loginRequest = async (login, password) => {
  try {
    
       const dataLogin ={
        "login": login,
        "password": password
      }
    const response = await RequestAPI.post('/funcionarios/validar-senha',dataLogin ); // Chame a função que faz a requisição da API corretamente

    if (response.status === 200) {
      const data = response.data;
      return data; // Retorne o objeto FuncionarioModel se as credenciais estiverem corretas
    } else if (response.status === 304) {
      return false; // Retorna false se as credenciais estiverem erradas
    } else {
      throw new Error('Erro ao fazer a solicitação de login Linha 20 loginRequest');
    }
  } catch (error) {
    console.error('Erro ao fazer a solicitação de login Linha 23 loginRequest:', error);
    throw error;
  }
};
