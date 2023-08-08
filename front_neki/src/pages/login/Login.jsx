import React, { useState, useEffect,useContext  } from 'react';
import { Link } from "react-router-dom";
import { TextField, Button, FormControlLabel, Checkbox, IconButton, InputAdornment, Container, Typography, Paper } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './login.css'; // Importe o arquivo CSS para estilização
import { loginRequest } from '../../services/LoginService';
import Cadastro from "../cadastro/Cadastro";
import { useNavigate  } from "react-router-dom";
import Home from '../home/Home';
import { IdFuncionarioContext } from '../../context/IdFuncionarioContext';

const Login = () => {
  const navigate = useNavigate();
  const {  userId,setUserId } = useContext(IdFuncionarioContext);


  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
    rememberPassword: false,
    showPassword: false,
  });

  const [loginError, setLoginError] = useState(false); // Estado para controlar a exibição da mensagem de erro

  // Recupera a senha do localStorage ao carregar o componente
  useEffect(() => {
    const savedPassword = localStorage.getItem('savedPassword');
    if (savedPassword) {
      setLoginData((prevData) => ({ ...prevData, password: savedPassword }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRememberPasswordChange = (e) => {
    const { checked } = e.target;
    setLoginData((prevData) => ({ ...prevData, rememberPassword: checked }));

    // Se "Gravar Senha" estiver marcado, salve a senha no localStorage
    if (checked) {
      localStorage.setItem('savedPassword', loginData.password);
    } else {
      // sinao remova a senha do localStorage
      localStorage.removeItem('savedPassword');
    }
  };

  const handleShowPasswordToggle = () => {
    setLoginData((prevData) => ({ ...prevData, showPassword: !prevData.showPassword }));
  
  }
    const handleLogin = async () => {
      console.log('Username:', loginData.username);
      console.log('Password:', loginData.password);
      console.log('Remember Password:', loginData.rememberPassword);
      try {
        const response = await loginRequest(loginData.username, loginData.password);
  
        if (response) {
          console.log('Login bem-sucedido!');
          console.log("!!!!!!! id " ,response.id )
          setUserId(response.id);
          navigate('/Home');
          console.log("userId DEPOIS DO CONTEXT" , userId)
        } else {
          console.log('Erro ao fazer a solicitação de login:', response.status);
        }
      } catch (error) {
        console.error('Erro ao fazer a solicitação de login:', error);
      }
    };

const handleSignUp = () => {
  console.log("fUNÇÃO SIGNUP");
  <Link to="/Cadastro">Cadastro</Link>;
  console.log("PASSEI DO LINK");
};

return (
  <Container maxWidth="xs" className="login-container">
      <Paper elevation={3} sx={{ padding: 2 }} style={{ backgroundColor: '#333' }} className="custom-paper">
      <Typography variant="h5" align="center">
        Login
      </Typography>
      <form> 
        <TextField
          label="Login"
          name="username"
          fullWidth
          value={loginData.username}
          onChange={handleInputChange}
          margin="normal"
          className="custom-login-input" 
        />
        <TextField
          label="Senha"
          name="password"
          fullWidth
          type={loginData.showPassword ? 'text' : 'password'}
          value={loginData.password}
          onChange={handleInputChange}
          margin="normal"
          className="custom-login-input" 
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleShowPasswordToggle} edge="end">
                  {loginData.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={loginData.rememberPassword}
              onChange={handleRememberPasswordChange}
              color="primary"
            />
          }
          label="Gravar Senha"
        />
        <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
          Entrar
        </Button>
        <Link to="/cadastro" style={{ textDecoration: "none" }}>
          <Button variant="outlined" color="primary" fullWidth>
            Cadastro
          </Button>
        </Link>
        {loginError && <Typography color="error">Usuário ou senha incorreto(s)</Typography>}
      </form>
    </Paper>
  </Container>
);
};

export default Login;