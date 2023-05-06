import { format } from "date-fns";
import AppLogic from "./appLogic";

// Hamburger menu display event listener
(function() {
    const menuButton = document.querySelector('.fa-bars');
    const sidebar = document.querySelector('aside');
    menuButton.addEventListener('click', function() {
        sidebar.classList.toggle('hide')
    })
})();

// Add project and tasks display event listener
function addProject() {
    const addButton = document.querySelector('.addProject');
    const cancelButton = document.querySelector('.cancelProject');
    const input = document.querySelector('.inputProject');
    const form = document.querySelector('.addProjectForm');
    displayForm(addButton, form, input, cancelButton);
}

function addTask() {
    const addButton = document.querySelector('.addTask');
    const cancelButton = document.querySelector('.cancelTask');
    const input = document.querySelector('.inputTask');
    const form = document.querySelector('.addtaskForm');
    displayForm(addButton, form, input, cancelButton); 
}

function displayForm(addButton, form, input, cancelButton) {
    addButton.addEventListener('click', function() {
        addButton.classList.add('hide');
        input.style.display = 'flex';
    })

    form.addEventListener('submit', function() {
        addButton.classList.remove('hide');
        input.style.display = 'none';
    })

    cancelButton.addEventListener('click', function() {
        addButton.classList.remove('hide');
        input.style.display = 'none';
    }) 
};

// Display all projects
function loadTitles(data) {
    const projectLists = document.querySelector('.projectLists')
    projectLists.innerHTML = ''
    data.forEach(project => {
        if (project.getName() === 'Home') return
        projectLists.innerHTML += `
        <div>
            <button class="title" data="${project.getName()}">${project.getName()}</button>
            <button class="deleteProject" data="${project.getName()}"><i class="fa-solid fa-trash"></i></button>
        </div>
    `  
    })
    AppLogic.loadProjectTodos();
    addProject();
}


// Delete project from project list
function deleteProjectDisplay(title) {
    title.parentNode.remove();
    clearTodosDisplay(title.getAttribute('data'))
}

function deleteTask(deleteButton) {
    const todos = deleteButton.closest('.todos')
    if (todos.children.length === 1) {
        todos.innerHTML = `
            <div>
                <p>No Todos</p>
            </div>
        `
    }
    deleteButton.closest('.todo').remove();
}

function sortedTasks(projects, dueFor) {
    const todosArea = document.querySelector('.tasks')
    todosArea.innerHTML = '';
    if (!projects.length) {
        todosArea.innerHTML = dueFor === 'today' ? '<h1>No tasks for today</h1>' : '<h1>No tasks for this week';
    }
    projects.forEach(project => {
        createTodos(project, todosArea)
    })
}

function createProjectTodos(project) {
    const todosArea = document.querySelector('.tasks');
    todosArea.innerHTML = ''
    createTodos(project, todosArea);
    createTodoForm(project.getName())
    addTask();
    AppLogic.deleteTask();
    AppLogic.submitTodos();
}


function createTodos(project, todosArea) {
    todosArea.innerHTML += `<h1>Project: ${project.getName()}</h1>`
    const todos = document.createElement('div')
    todos.classList.add('todos')
    if (!project.tasks.length) {
        todos.innerHTML += `
            <div>
                <p>No Todos</p>
            </div>
        `
    }
    else {
        project.getAllTodos().forEach(task => {
            todos.innerHTML += `
                <div class="todo">
                    <div>
                        <button class="deleteTask" data-task-info="${task.getTaskName()}:${project.getName()}"></button>
                        <p>Task: ${task.getTaskName()}</p>
                    </div>
                    <div>
                        <p>Duedate: ${task.getDuedate()}</p>
                        <p>Priority: ${task.getPriority()}</p>
                    </div>
                </div>
            `
        })
    }
    todosArea.append(todos)
}

// Create form to submit new todo to a project
function createTodoForm(projectTitle) {
    const todos = document.querySelector('.tasks');
    todos.innerHTML += `
        <div class="inputItems inputTask">
            <form class="inputTodos addtaskForm" data='${projectTitle}' action="" method="Post">
                <label for="task">Task:</label>
                <input type="text" name="task" id="task" placeholder="Task" required>
                <label for="duedate">Duedate:</label>
                <input type="date" name="duedate" id="duedate" min = ${format(new Date(), 'yyyy-MM-dd')} value = ${format(new Date(), 'yyyy-MM-dd')} placeholder="Duedate" required>
                <label for="priority">Priority:</label>
                <div>
                    <div>
                        <label for="high">High priority</label>
                        <input type="radio" name="priority" value="HIGH">
                    </div>
                    <div>
                        <label for="medium">Mid priority</label>
                        <input type="radio" name="priority" value="MEDIUM">
                    </div>
                    <div>
                        <label for="low">Low priority</label>
                        <input type="radio" name="priority" value="LOW" checked>
                    </div>
                </div>
                <div>
                    <button>Submit</button>
                    <button type='button' class="cancelTask">Cancel</button>
                </div>
            </form>
        </div>
        <button class="addTask">
            <i class="fa-solid fa-plus"></i>
            Add Tasks
        </button>
    `
}

function clearTodosDisplay(projectName) {
    const todosDisplayArea = document.querySelector('.tasks');
    const form = document.querySelector('.addtaskForm')
    if (form.getAttribute('data') === projectName) {
        todosDisplayArea.innerHTML = ''
    }
}

export default {
    loadTitles,
    deleteProjectDisplay,
    createProjectTodos,
    deleteTask,
    createTodos,
    clearTodosDisplay,
    sortedTasks
}

