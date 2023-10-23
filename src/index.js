import newToDo from './scripts/models/todo';
import newProject from './scripts/models/project';
import domController from './scripts/domController';

//const todo = newToDo('TEST', 1, 1, 1, 1, 1);

const taskController = (function () {

    const projects = [];
    const domControl = domController(document,
        addNewProject,
        changeProjectname,
        removeProject,
        getProjectTodo,
        getCurrentProject,
        addNewToDo,
        markToDoForProject,
        removeToDoFromProject,
        changeToDoInProject,
        getAllProjects);

    let currentProjectId = null;

    domControl.drawProjects(projects);

    function addNewProject(projectTitle) {

        const createdProject = newProject(projectTitle);
        projects.push(createdProject);

        domControl.drawProjects(projects);
    }

    function changeProjectname(newName, index) {
        projects[index].title = newName;
        domControl.drawProjects(projects);
    }

    function removeProject(index) {

        if (currentProjectId === index) {
            currentProjectId = null;
        }

        projects.splice(index, 1);
        domControl.drawProjects(projects);
    }

    function getProjectTodo(index) {
        currentProjectId = index;
        return projects[index].toDos;
    }

    function getCurrentProject() {
        return currentProjectId;
    }

    function addNewToDo(todo) {
        const createdToDo = newToDo(todo.title, todo.description, todo.dueDate, todo.priority, false);
        projects[currentProjectId].pushToDo(createdToDo);
    }

    function markToDoForProject(projectIndex, toDoIndex) {
        projects[projectIndex].toggleToDoComplete(toDoIndex);
    }

    function removeToDoFromProject(projectIndex, toDoIndex) {
        projects[projectIndex].removeToDoAt(toDoIndex);
    }

    function changeToDoInProject(toDoIndex, projectIndex, title, description, dueDate, priority) {
        projects[projectIndex].changeToDoData(toDoIndex, title, description, dueDate, priority);
    }

    function getAllProjects() {
        return [...projects];
    }

    return;
})();
