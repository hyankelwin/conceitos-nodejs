const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push(repository)

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repositorio não encontrado!' })
  }

  const newRepository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes
  }

  repositories[repoIndex] = newRepository;

  return response.json(newRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repositorio não encontrado!' })
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send({ message: "Deletado com sucesso!" })

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repo => repo.id === id);

  if (!repository) {
    return response.status(400).send({ message: "Repository not found" })
  }
  repository.likes += 1

  return response.json(repository)
});

module.exports = app;
