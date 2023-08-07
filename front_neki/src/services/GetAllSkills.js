import { RequestAPI } from './api'

export const GetAllSkills = async () => {
    try {
        const response = await RequestAPI.get(`/skill`);
        console.log(response)
        return response.data;
    } catch (e) {
        console.log(e.response)
        return e.response
    }
}