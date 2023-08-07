import {RequestAPI} from './api'

export const getSkillsFuncionario = async (userId) => {
    try {
        const response = await RequestAPI.get(`/funcionarios/${userId}/skills/listar`);
        console.log(response)
        return response.data; // Retorna os dados obtidos da API (um array de objetos com as informações das skills)
    } catch (e) {
        console.log(e.response)
        return e.response
    }
}