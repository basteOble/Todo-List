import Projects from "./projects";
import Todo from "./todos";

function saveProjects(data) {
    localStorage.setItem('todoList', JSON.stringify(data))
}

function getAllProjects() {
    const projectsData = JSON.parse(localStorage.getItem('todoList'))
    if (!projectsData) return []
    else return projectsData.map(function(project) {
        if (project.tasks !== []) {
            project.tasks = project.tasks.map(task => Object.assign(new Todo, task))
        }
        return Object.assign(new Projects, project)
    })
}

function deleteProject(name) {
    const retrieved = getAllProjects();
    const updateList = retrieved.filter(project => project.getName() !== name)
    saveProjects(updateList);
}

function getProject(name) {
    const retrieved = getAllProjects();
    return retrieved.find(project => project.getName() === name)
}

export default {
    saveProjects,
    getAllProjects,
    deleteProject,
    getProject
}