import React, { useState, useEffect, useContext } from "react";
import SkillModal from "./SkillModal";
import SkillList from "./SkillList";
import { getSkillsFuncionario } from "../../services/GetSkillsFuncionario";
import { getUserData } from "../../services/getUserData";
import { IdFuncionarioContext } from "../../context/IdFuncionarioContext";
import { GetAllSkills } from "../../services/GetAllSkills";
import "./Home.css"

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skills, setSkills] = useState([]);
  const { userId } = useContext(IdFuncionarioContext);

  // Função para abrir a modal
  const openModal = () => {
    setIsModalOpen(true);
  };
  // Função para fechar a modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Função para adicionar uma nova Skill à lista
  const handleAddSkill = (newSkill) => {
    const newSkillWithId = { ...newSkill, id: skills.length + 1 };
    setSkills([...skills, newSkillWithId]);
    saveSkills([...skills, newSkillWithId]); // Salva as skills no localStorage
  };

  const [funcionarioDados, setFuncionarioDados] = useState([]);
  const [skillsFuncionario, setSkillsFuncionario] = useState([]);
  const [allSkills, SetAllSkills] = useState([]);

  const fethAllSkills = async () => {
    try {
      console.log("Comecei a fazer a requisição by id");
      const allSkillsData = await GetAllSkills();
      SetAllSkills(allSkillsData);
    } catch (error) {
      console.error("Erro ao buscar todas as skills:", error);
    }
  };

  const fetchSkillsFuncionario = async () => {
    try {
      const dataSkillsFuncionario = await getSkillsFuncionario(userId);
      console.log("dataSkillsFuncionario !!!", dataSkillsFuncionario);
      setSkillsFuncionario(dataSkillsFuncionario);
    } catch (error) {
      console.log("Entrei no catch fetchSkillsFuncionario ", error);
    }
  };
  //ve se o cara ja tem as skills 
  const getSkillsNotInFuncionario = () => {
    return allSkills.filter((skill) =>
      skillsFuncionario.every((funcSkill) => funcSkill.id !== skill.id)
    );
  };


  const fetchUserData = async () => {
    try {
      console.log("Comecei a fazer a requisição by id");
      const data = await getUserData(userId);
      setFuncionarioDados(data);
    } catch (error) {
      console.error("Erro ao buscar os dados do Funcionário:", error);
    }
  };

  useEffect(() => {
    fetchSkillsFuncionario();
    fetchUserData();
  }, [userId]);
  return (
    <div>
      <h1>Home</h1>
      <button onClick={openModal}>Adicionar Skill</button>
      <input
        value={funcionarioDados?.name}
        type="text"
        name="name"
        className="textboxLeftVC"
      />

      {/* Map through the skillsFuncionario array and render its elements */}
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Level</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {skillsFuncionario.map((skill) => (
            <tr key={skill.id}>
              <td>
                <img
                  src={skill.urlImagem}
                  alt={skill.name}
                  style={{ width: "100px", height: "auto" }}
                />
              </td>
              <td>{skill.name}</td>
              <td>{skill.level}</td>
              <td>{skill.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <SkillList skills={skills} />

      <SkillModal
        open={isModalOpen}
        onClose={closeModal}
        onAddSkill={handleAddSkill}
      />
    </div>
  );
};

export default Home;
