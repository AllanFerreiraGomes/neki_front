import React, { useState, useEffect, useContext } from "react";
import SkillModal from "./SkillModal";
import { getSkillsFuncionario } from "../../services/GetSkillsFuncionario";
import { getUserData } from "../../services/getUserData";
import { IdFuncionarioContext } from "../../context/IdFuncionarioContext";
import { GetAllSkills } from "../../services/GetAllSkills";
import "./Home.css";
import { useNavigate } from "react-router-dom";


const Home = () => {
  const navigate = useNavigate();


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skillsFuncionario, setSkillsFuncionario] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [skillsToAdd, setSkillsToAdd] = useState([]);
  const [funcionarioDados, setFuncionarioDados] = useState(null);
  const { userId } = useContext(IdFuncionarioContext);
  const [SelectedSkillLevel, setSelectedSkillLevel] = useState();


  const fetchAllSkills = async () => {
    try {
      const allSkillsData = await GetAllSkills();
      setAllSkills(allSkillsData);
    } catch (error) {
      console.error("Error fetching all skills:", error);
    }
  };

  const fetchSkillsFuncionario = async () => {
    try {
      const dataSkillsFuncionario = await getSkillsFuncionario(userId);
      setSkillsFuncionario(dataSkillsFuncionario);
    } catch (error) {
      console.log("Error fetching skills for Funcionário", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const data = await getUserData(userId);
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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSkillsToAdd([]);
  };

  const handleAddSkill = async (skillId) => {
    const dataPost = {
      funcionarioId: userId,
      skillIds: [skillId], // Sending only one skill id at a time
      level: SelectedSkillLevel,
    };
    console.log("LEVEL ", SelectedSkillLevel)
    try {
      await fetch(
        `http://localhost:8080/api/funcionarios/${userId}/skills/associar-skills`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataPost),
        }
      );
      console.log("Skill adicionada com sucesso!");
  
      setSkillsFuncionario((prevSkills) => [...prevSkills, { id: skillId, level: SelectedSkillLevel }]);
  
      setAllSkills((prevSkills) => prevSkills.filter((skill) => skill.id !== skillId));
    } catch (error) {
      console.error("Erro ao adicionar a skill:", error);
    }
  };

  const removeSkillFromFuncionario = async (skillId) => {
    const dataDelete = {
      skillId: skillId,
    };

    try {
      await fetch(
        `http://localhost:8080/api/funcionarios/${userId}/skills/excluir`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataDelete),
        }
      );
      console.log("Skill removida com sucesso!");
      // After successful deletion, update the skillsFuncionario state to remove the skill
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
      <button onClick={handleLogout}>Logout</button>
      <input
        value={funcionarioDados?.name}
        type="text"
        name="name"
        className="textboxLeftVC"
      />

      {getSkillsInFuncionario().map((skill) => (
        <div key={skill.id}>
          <img
            src={skill.urlImagem}
            alt={skill.name}
            style={{ width: "25%", height: "auto" }}
          />
          <p>Name: {skill.name}</p>
          <p>Level: {skill.level}</p>
          <p>Description: {skill.description}</p>
          <button onClick={() => removeSkillFromFuncionario(skill.id)}>
            <span role="img" aria-label="Remove Skill">
              🗑️
            </span>
          </button>

        </div>
      ))}

      <div>
        <h2>Skills the Funcionário doesn't have:</h2>
        {getSkillsNotInFuncionario().map((skill) => (
          <div key={skill.id}>
            <img
              src={skill.urlImagem}
              alt={skill.name}
              style={{ width: "25%", height: "auto" }}
            />
            <p>Name: {skill.name}</p>
            <p>Level: {skill.level}</p>
            <p>Description: {skill.description}</p>
            <input
              type="number"
              onChange={(e) => setSelectedSkillLevel(e.target.value)}
            />
            <button onClick={() => handleAddSkill(skill.id)}>
              Add Skill
            </button>
          </div>
        ))}
      </div>

      <SkillModal
        open={isModalOpen}
        onClose={closeModal}
        onAddSkill={handleAddSkill} // Pass the reference to the function without calling it
      />
    </div>
  );
};

export default Home;
