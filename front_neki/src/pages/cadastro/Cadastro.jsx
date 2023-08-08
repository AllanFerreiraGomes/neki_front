import React, { useState } from 'react';
import { useNavigate  } from "react-router-dom";
import { TextField, Button, IconButton, InputAdornment, Container, Typography, Paper, Snackbar } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { registerUser } from '../../services/RegisterService';
import Login  from '../login/Login';
import './Cadastro.css'; 

const Cadastro = () => {
  const navigate = useNavigate();


  const [registerData, setRegisterData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
  });

  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleShowPasswordToggle = () => {
    setRegisterData((prevData) => ({ ...prevData, showPassword: !prevData.showPassword }));
  };

  const handleShowConfirmPasswordToggle = () => {
    setRegisterData((prevData) => ({ ...prevData, showConfirmPassword: !prevData.showConfirmPassword }));
  };

  const handleSnackbarClose = () => {
    setShowErrorMessage(false);
  };
  const handleRegister = async () => {
    if (registerData.password === registerData.confirmPassword) {
      setPasswordsMatch(true);

      try {
        const response = await registerUser(registerData.name, registerData.username, registerData.password);

        if (response) {
          // A função registerUser agora retorna null para status 304 (HttpStatus.NOT_MODIFIED)
          setRegistrationSuccess(true);
          setShowErrorMessage(false);
          console.log('Cadastro realizado com sucesso!');
          navigate('/login');

        } else {
          setShowErrorMessage(true);
          console.log('Erro ao fazer a solicitação de cadastro TELA CADASTRO 52:', response.status);
        }
      } catch (error) {
        setShowErrorMessage(true);
        console.error('Erro ao fazer a solicitação de cadastro: TELA CADASTRO 56:', error);
      }
    } else {
      setPasswordsMatch(false);
    }
  };

  return (
    <Container maxWidth="xs" className="register-wrapper">
      <Paper elevation={3} sx={{ padding: 2 }} className="register-container"  style={{ backgroundColor: '#333' }} >
        <Typography variant="h5" align="center">
          Cadastrar-se
        </Typography>
        <form>
          <TextField
            label="Nome"
            name="name"
            fullWidth
            value={registerData.name}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Login"
            name="username"
            fullWidth
            value={registerData.username}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Senha"
            name="password"
            fullWidth
            type={registerData.showPassword ? 'text' : 'password'}
            value={registerData.password}
            onChange={handleInputChange}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPasswordToggle} edge="end">
                    {registerData.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirmar Senha"
            name="confirmPassword"
            fullWidth
            type={registerData.showConfirmPassword ? 'text' : 'password'}
            value={registerData.confirmPassword}
            onChange={handleInputChange}
            margin="normal"
            error={!passwordsMatch}
            helperText={!passwordsMatch && 'As senhas não coincidem'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowConfirmPasswordToggle} edge="end">
                    {registerData.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" color="primary" fullWidth onClick={handleRegister}>
            Salvar
          </Button>
          <Snackbar open={showErrorMessage} autoHideDuration={5000} onClose={handleSnackbarClose}>
            <Typography color="error">Login Inválido, Digite Outro</Typography>
          </Snackbar>
          {registrationSuccess && (
            <Typography color="success">Cadastro realizado com sucesso!</Typography>
          )}
        </form>
      </Paper>
    </Container>
  );
};

export default Cadastro;