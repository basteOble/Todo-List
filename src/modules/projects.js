function Projects(name) {
    this.name = name;
    this.tasks = [];
}

Projects.prototype.setName = function(name) {
    this.name = name;
}

Projects.prototype.addTodo = function(task) {
    this.tasks.push(task);
}

Projects.prototype.getName = function() {
    return this.name;
}

Projects.prototype.getAllTodos = function() {
    return this.tasks;
}

module.exports = Projects
