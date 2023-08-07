import { RequestAPI } from './api';

const registerUser = async (name, login, password) => {
  try {
    const userData = {
      id: "7000",
      name: name,
      login: login,
      password: password,
    };

    const response = await RequestAPI.post('/funcionarios', userData);

    if (response.status === 200) {
      const data = response.data;
      return data;
    } else if (response.status === 304) {
      return null; // Retorna nulo caso o status seja 304 (HttpStatus.NOT_MODIFIED)
    } else {
      throw new Error('Erro ao fazer a solicitação de cadastro Linha 20 registerUser');
    }
  } catch (error) {
    console.error('Erro ao fazer a solicitação de cadastro  Linha 23 registerUser:', error);
    throw error;
  }
};

export { registerUser };
