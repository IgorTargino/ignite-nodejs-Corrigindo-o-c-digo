const express = require("express");
const cors = require("cors");

const { v4: uuid } = require("uuid");

const app = express();
app.use(express.json());
app.use(cors());

const repositories = [];

function checksRepositoryExists(request, response, next) {
  const { id } = request.params;

  const repository = repositories.find((repository) => repository.id === id);

  if (!repository) {
    return response.status(404).json({ error: "Repository not found!" });
  }

  const uuidValidate = validate(id, 4);

  if (!uuidValidate) {
    return response.status(401).json({ error: "Id not available" });
  }

  request.repository = repository;

  return next;
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repositoryAlreadyExists = repositories.some(
    (repository) => repository.title === title
  );

  if (repositoryAlreadyExists)
    return response.status(400).json({ error: "Repository already exists" });

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", checksRepositoryExists, (request, response) => {
  const { repository } = request;
  const { title, url, techs } = request.body;

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex > 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const likes = ++repositories[repositoryIndex].likes;

  return response.json("likes");
});

module.exports = app;
