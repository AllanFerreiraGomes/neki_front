import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { IdFuncionarioProvider } from "./context/IdFuncionarioContext";
import Cadastro from "./pages/cadastro/Cadastro";
import Login from "./pages/login/Login";
// import NotFound from "./pages/NotFound";
import Home from "./pages/home/Home";
import { AccessTokenProvider } from "./context/AccessTokenContext"

const path = "/login" || "";

const App = () => {
  return (
    <Router>
      <IdFuncionarioProvider>
       <AccessTokenProvider>
         <Routes>
           <Route path="/cadastro" element={<Cadastro />} />
           <Route path="/login" element={<Login />} />
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
        </Routes>
        </AccessTokenProvider>
      </IdFuncionarioProvider >
    </Router >
  );
};

export default App;
