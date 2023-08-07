import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { IdFuncionarioProvider } from "./context/IdFuncionarioContext";
import Cadastro from "./pages/cadastro/Cadastro";
import Login from "./pages/login/Login";
// import NotFound from "./pages/NotFound";
import Home from "./pages/home/Home";

const App = () => {
  return (
    <Router>
      <IdFuncionarioProvider>
        <Routes>
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
        </IdFuncionarioProvider>
    </Router>
  );
};

export default App;
