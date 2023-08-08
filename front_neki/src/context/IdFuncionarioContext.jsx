import { createContext, useState } from 'react';

export const IdFuncionarioContext = createContext();

export const IdFuncionarioProvider = ({ children }) => {
  const [userId, setUserId] = useState({});
  const [getAccessToken, setAccessToken] = useState(null); // Adicione o estado para o accessToken

  
  const setLoggedInUserId = (id) => {
    setUserId(id);
  };

  const setAuthToken = (token) => {
    setAccessToken(token);
  };

  return (
    <IdFuncionarioContext.Provider value={{ userId, setUserId , getAccessToken, setAuthToken}}>
      {children}
    </IdFuncionarioContext.Provider>
  );
};
