import DisplayController from './displayController'
import Storage from './storage';
import Projects from './projects'
import storage from './storage';
import { isThisWeek, isToday, parseISO } from 'date-fns';

function submitProject() {
    const projectForm = document.querySelector('.inputProjects');
    projectForm.addEventListener('submit', function(event) {
        event.preventDefault()
        const data = new FormData(this);
        const dataObject = Object.fromEntries(data.entries());
        const projects = Storage.getAllProjects();
        const updatedProjectlist = [];

        if (dataObject.projectName === '') {
            alert('Project name can\'t be empty');
            return
        } else if (projects.some(project => project.getName() === dataObject.projectName)) {
            alert('Project already exist!')
            this.reset();
            return
        }

        const project = new Projects(dataObject.projectName)
        
        if (!projects) {
            updatedProjectlist.push(project)
        } else {
            updatedProjectlist.push(...projects, project)
        }

        Storage.saveProjects(updatedProjectlist);
        DisplayController.loadTitles(Storage.getAllProjects());
        DisplayController.createProjectTodos(Storage.getProject(dataObject.projectName))
        deleteProject();
    })
}

function submitTodos() {
    const newTodoForm = document.querySelector('.inputTodos');
    newTodoForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const newTodo = Object.fromEntries(new FormData(this))

        for (let key in newTodo) {
            if (newTodo[key] === '' || newTodo[key] === null || newTodo[key] === undefined) {
                alert('Please fill out the fields')
                return
            }
        }

        const project = Storage.getProject(this.getAttribute('data'));
        
        if (project.tasks.some(task => task.getTaskName() === newTodo.task)) {
            alert('Task must be different')
            return
        }

        const projects = Storage.getAllProjects()
        const projectToEdit = projects.find(project => project.getName() === this.getAttribute('data'))
        projectToEdit.addTodo(newTodo);
        Storage.saveProjects(projects);
        DisplayController.createProjectTodos(Storage.getProject(this.getAttribute('data')));
    })  
}

function deleteProject() {
    const deleteProjectButtons = document.querySelectorAll('.deleteProject');
    deleteProjectButtons.forEach(function(deleteProjectButton) {
        deleteProjectButton.addEventListener('click', function() {
            Storage.deleteProject(this.getAttribute('data'))
            DisplayController.deleteProjectDisplay(this)
        })
    })
}

function deleteTask() {
    const deleteTaskButtons = document.querySelectorAll('.deleteTask');
    deleteTaskButtons.forEach(deleteTaskButton => {
        deleteTaskButton.addEventListener('click', function() {
            const [taskName, projectName] = this.getAttribute('data-task-info').split(':');
            const projectList = Storage.getAllProjects();
            const project = projectList.find(project => project.getName() === projectName);
            project.tasks = project.tasks.filter(task => task.getTaskName() !== taskName);
            Storage.saveProjects(projectList);
            DisplayController.deleteTask(this);
        })
    })
}

function loadProjectTodos() {
    const projects = document.querySelectorAll('.title');
    projects.forEach(function(project) {
        project.addEventListener('click', function() {
            const retrieveProject = Storage.getProject(project.getAttribute('data'))
            DisplayController.createProjectTodos(retrieveProject);
        })
    })
}

function loadPage() {
    if (!Storage.getProject('Home')) {
        const home = new Projects('Home')
        const projects = Storage.getAllProjects();
        projects.push(home)
        Storage.saveProjects(projects)
    }
    homeTasks();
    homeButton();
    todayWeekTasks();
    DisplayController.loadTitles(Storage.getAllProjects());
    submitProject();
    deleteProject();
}

function homeButton() {
    const homeButton = document.querySelector('.home');
    homeButton.addEventListener('click', function() {
        homeTasks();
    })
}

function homeTasks() {
    DisplayController.createProjectTodos(Storage.getProject('Home'));
    deleteTask();
}

function todayWeekTasks() {
    const todayWeekTasks = document.querySelectorAll('.todayWeekTasks')
    todayWeekTasks.forEach(todayWeekTask => {
        todayWeekTask.addEventListener('click', function() {
            const projects = storage.getAllProjects();
            const dueFor = this.getAttribute('data')
            const taskDue = projects.reduce((acc,curr) => {
                const filteredTasks = curr.getAllTodos().filter(task => {
                    const dueDate = parseISO(task.getDuedate())
                    if (dueFor === 'today') {
                        return isToday(dueDate)
                    } else if (dueFor === 'week') {
                        return isThisWeek(dueDate)
                    }
                });
    
                if (filteredTasks.length) {
                    acc.push(Object.assign(new Projects,{ name: curr.getName(), tasks: filteredTasks }));
                }
    
                return acc;
            },[])
            DisplayController.sortedTasks(taskDue, dueFor) 
            deleteTask();
        })
    })
}

export default { 
    submitProject,
    deleteProject,
    loadProjectTodos,
    submitTodos,
    deleteTask,
    loadPage
}