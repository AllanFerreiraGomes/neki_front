import React, { useEffect, useContext } from "react";
import { useNavigate, Route } from "react-router-dom";
import { IdFuncionarioContext } from "../context/IdFuncionarioContext"; 

const PrivateRoute = ({ element: Element, ...rest }) => {
  const idFuncionarioContext = useContext(IdFuncionarioContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!idFuncionarioContext.userId) {
      navigate("/login"); // Redirecionar para a página de login
    }
  }, [idFuncionarioContext.userId, navigate]);

  return <Route {...rest} element={idFuncionarioContext.userId ? <Element /> : null} />;
};

export default PrivateRoute;
