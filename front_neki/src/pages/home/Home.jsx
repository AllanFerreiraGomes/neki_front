import React, { useState, useEffect, useContext } from "react";
import { getSkillsFuncionario } from "../../services/GetSkillsFuncionario";
import { getUserData } from "../../services/getUserData";
import { IdFuncionarioContext } from "../../context/IdFuncionarioContext";
import { GetAllSkills } from "../../services/GetAllSkills";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from 'react-icons/fi';
import { RequestAPI } from "../../services/api";
import { AccessTokenContext } from '../../context/AccessTokenContext'
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skillsFuncionario, setSkillsFuncionario] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [skillsToAdd, setSkillsToAdd] = useState([]);
  const [funcionarioDados, setFuncionarioDados] = useState(null);
  const { userId } = useContext(IdFuncionarioContext);
  const [SelectedSkillLevel, setSelectedSkillLevel] = useState();
  const { accessToken, setAccessToken } = useContext(AccessTokenContext);

  let tokem = accessToken;
  console.log("tokem", tokem)

  const fetchAllSkills = async () => {
    try {
      console.log("fetchAllSkills !!!!!!!")
      const allSkillsData = await GetAllSkills(tokem);
      setAllSkills(allSkillsData);
    } catch (error) {
      console.error("Error fetching all skills:", error);
    }
  };

  const fetchSkillsFuncionario = async () => {
    try {
      console.log("Entrei  fetchSkillsFuncionario()")
      const dataSkillsFuncionario = await getSkillsFuncionario(userId, tokem);
      setSkillsFuncionario(dataSkillsFuncionario);
    } catch (error) {
      console.log("Error fetching skills for Funcionário", error);
    }
  };

  const fetchUserData = async () => {
    try {
      console.log("bearerToken", tokem)
      const data = await getUserData(userId, tokem);
      setFuncionarioDados(data);
    } catch (error) {
      console.error("Error fetching Funcionário data:", error);
    }
  };

  useEffect(() => {
    fetchSkillsFuncionario();
    fetchUserData();
    fetchAllSkills();
  }, [userId]);

  const getSkillsNotInFuncionario = () => {
    return allSkills.filter(
      (skill) => !skillsFuncionario.some((funcSkill) => funcSkill.id === skill.id)
    );
  };

  const getSkillsInFuncionario = () => {
    return skillsFuncionario;
  };

  const handleAddSkill = async (skillId) => {
    const dataPost = {
      funcionarioId: userId,
      skillIds: [skillId],
      level: SelectedSkillLevel,
    };

    try {
      await axios.post(
        `http://localhost:8080/api/funcionarios/${userId}/skills/associar-skills`,
        dataPost,
        {
          headers: {
            Authorization: `Bearer ${tokem}`,
          },
        }
      );
      console.log("Skill adicionada com sucesso!");

      fetchSkillsFuncionario();

      setSkillsFuncionario((prevSkills) => [
        ...prevSkills,
        { id: skillId, level: SelectedSkillLevel },
      ]);
      useEffect()
      setSkillsFuncionario((prevSkills) => [...prevSkills, { id: skillId, level: SelectedSkillLevel }]);
      setAllSkills((prevSkills) => prevSkills.filter((skill) => skill.id !== skillId));
    } catch (error) {
      console.error("Erro ao adicionar a skill:", error);
    }
  };

  const removeSkillFromFuncionario = async (skillId) => {
    const dataDelete = 
    {
      skillId: skillId,
    };

    try {
      await axios.delete(
        `http://localhost:8080/api/funcionarios/${userId}/skills/excluir`,
        {
          data: dataDelete,
          headers: {
            Authorization: `Bearer ${tokem}`,
          },
        }
      );

      console.log("Skill removida com sucesso!");

      fetchAllSkills();
      setSkillsFuncionario((prevSkills) =>
        prevSkills.filter((skill) => skill.id !== skillId)
      );
    } catch (error) {
      console.error("Erro ao remover a skill:", error);
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };


  return (
    <div>
      <h1>Home</h1>
      <button className="logout-button" onClick={handleLogout}>
        <FiLogOut />
        Logout
      </button>
      <input
        value={funcionarioDados?.name}
        type="text"
        name="name"
        className="textboxLeftVC"
      />
      <h2>Habilidades:</h2>
      <div className="containerCard">
        {skillsFuncionario.map((skill) => (
          <div className="cardHabilidades">
            <div key={skill.id} className="skill-item">
              <div className="infoBox">
                <img
                  src={skill.urlImagem}
                  alt={skill.name}
                  className="skill-image"
                />
                <div className="skill-details">
                  <p>Name: {skill.name}</p>
                  <p>Level: {skill.level}</p>
                </div>
                <div className="containerButtonRemover">

                  <button
                    className="removeSkill"
                    onClick={() => removeSkillFromFuncionario(skill.id)}
                  >
                    <span role="img" aria-label="Remove Skill">
                      🗑️
                    </span>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

      </div>
      <div>
        <h2>Habilidades Que Não Possui:</h2>
        <div className="ContainerNaoPossui">
        {getSkillsNotInFuncionario().map((skill) => (
          <div key={skill.id} className="skills-item">
           
            <img
              src={skill.urlImagem}
              alt={skill.name}
              className="skillHabilidadesNaoPossui"
            />
            <div className="skill-detacils">
              <p>Name: {skill.name}</p>
              <p>Level: {skill.level}</p>
              <p>Description: {skill.description}</p>
            </div>

            <input
              className="level-input"
              type="number"
              onChange={(e) => setSelectedSkillLevel(e.target.value)}
            />
            <button
              className="add-skill-button"
              onClick={() => handleAddSkill(skill.id)}>
              Add Skill
            </button>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default Home;
