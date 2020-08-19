const express = require('express')
const { uuid, isUuid } = require('uuidv4')

const { json, request, response } = require('express')

const app = express()
app.use(express.json())

const projects = []

function logRequest(request, response, next) {
  const { method, url } = request

  const logLabel = `[${method.toUpperCase()}] ${url}`

  return next(); //Next para que o pŕoximo middleware seja chamado nesse caso app.post
}

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid project ID.' })
  }

  return next() //Next para que o pŕoximo middleware seja chamado nesse caso app.post
}

app.use(logRequest);
app.use('/projects/:id', validateProjectId,)

app.post('/projects', (request, response) => {
  const { name, stack } = request.body
  const project = { id: uuid(), name, stack }
  
  projects.push(project)

  return response.json(project)
})

app.get('/projects', (request, response) => {
  const { title } =request.query;

  const result = title
    ? projects.filter(project => project.title.includes(title))
    : projects

  return response.json(results)
})

app.put('/projects/:id', (request, response) => {
  const { id } = request.params
  const { name, stack } = request.body

  const projectIndex = projects.findIndex(project => project.id === id)

  if (projectIndex < 0) {
    return response.status(400).json({error: 'Project not found!!!'})
  }

  const project = {
    id,
    name, 
    stack
  }

  projects[projectIndex] = project

  return response.json(project)

})

app.delete('/projects/:id', (request, response ) => {
  const { id } = request.params

  const projectIndex = projects.findIndex(project => project.id === id)

  if (projectIndex < 0) {
    return response.status(400).json({error: 'Project not found!!!'})
  }

  projects.splice(projectIndex, 1);

  return response.status(204).send()

})

app.listen(3333, () => {
  console.log('🚀️ Back-end started poooorra!!!')
})

/**
 * Métodos HTTP:
 * 
 * GET: Buscar informações do back-end
 * POST: Criar uma informação no back-end
 * PUT/PATCH: Alterar uma informação no back-end
 * DELETE: Deletar uma informação no back-end
 */

 /**
  * Tipos de Parametros
  * 
  * Query Params: Filtros e paginação
  * Route Params: Identificar recursos (Atualizar/Deletar)
  * Request Body: Conteúdo na hora criar ou editar um recurso (JSON)
  */

  /**
   * Middleware
   * 
   * Interceptador de requisições que interrompe totalmente a requisição ou altera dados da requisição
   * Utilizamos quando queremos que algum trecho de código seja disparado de forma automatica em uma ou mais rotas da aplicação
   * 
   */