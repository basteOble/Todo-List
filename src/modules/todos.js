function Todo(task, priority, duedate) {
    this.task = task;
    this.duedate = duedate;
    this.priority = priority;
}

Todo.prototype.getTaskName = function() {
    return this.task 
}

Todo.prototype.getDuedate = function() {
    return this.duedate
}

Todo.prototype.getPriority = function() {
    return this.priority
}

module.exports = Todo;