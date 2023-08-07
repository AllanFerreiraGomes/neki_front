import axios from "axios";
import { RequestAPI } from "./api";

export const getUserData = async (userId) => {
  try {
    const response = await RequestAPI.get(`/funcionarios/${userId}`);
    
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Erro ao obter dados do funcionário por id');
    }
  } catch (error) {
    console.error("Erro ao obter o funcionário por id", error);
    throw error;
  }
};
