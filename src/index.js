import newToDo from './scripts/models/todo';
import newProject from './scripts/models/project';
import domController from './scripts/domController';
import { format, parse } from 'date-fns';

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

    function storageAvailable(type) {
        let storage;
        try {
            storage = window[type];
            const x = "__storage_test__";
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            return (
                e instanceof DOMException &&
                // everything except Firefox
                (e.code === 22 ||
                    // Firefox
                    e.code === 1014 ||
                    // test name field too, because code might not be present
                    // everything except Firefox
                    e.name === "QuotaExceededError" ||
                    // Firefox
                    e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
                // acknowledge QuotaExceededError only if there's something already stored
                storage &&
                storage.length !== 0
            );
        }
    }

    function loadStorageData() {
        if (!storageAvailable("localStorage")) {
            console.log('Local storage currently unavailable');
        }

        let loadProjects = localStorage.getItem("todoAppProjects");
        if (!loadProjects)
            return;

        loadProjects = JSON.parse(loadProjects).projects;

        for (let i = 0; i < loadProjects.length; i++) {

            const loadedProject = newProject(loadProjects[i].title);

            for (let j = 0; j < loadProjects[i].tasks.length; j++) {
                const loadedTask = newToDo(
                    loadProjects[i].tasks[j].title,
                    loadProjects[i].tasks[j].description,
                    parse(loadProjects[i].tasks[j].dueDate, 'MM/dd/yyyy', new Date()),
                    loadProjects[i].tasks[j].priority,
                    loadProjects[i].tasks[j].completed
                )

                loadedProject.pushToDo(loadedTask);
            }

            projects.push(loadedProject);
        }
    }

    function saveStorageData() {
        if (!storageAvailable("localStorage")) {
            console.log('Local storage currently unavailable');
        }

        if (projects.length === 0) {
            localStorage.setItem("todoAppProjects", '');
            return;
        }

        const saveObject = {
            projects: [],
        }

        for (let i = 0; i < projects.length; i++) {

            saveObject.projects.push({
                title: projects[i].title,
                tasks: []
            });

            for (let j = 0; j < projects[i].toDos.length; j++) {
                saveObject.projects[i].tasks.push({
                    title: projects[i].toDos[j].title,
                    description: projects[i].toDos[j].description,
                    dueDate: format(projects[i].toDos[j].dueDate, 'MM/dd/yyyy'),
                    priority: projects[i].toDos[j].priority,
                    completed: projects[i].toDos[j].completed,
                });
            }
        }

        localStorage.setItem("todoAppProjects", JSON.stringify(saveObject));
    }

    loadStorageData();

    domControl.drawProjects(projects);
    domControl.clickAllTasks();

    function addNewProject(projectTitle) {

        const createdProject = newProject(projectTitle);
        projects.push(createdProject);

        domControl.drawProjects(projects);
        saveStorageData();
    }

    function changeProjectname(newName, index) {
        projects[index].title = newName;
        domControl.drawProjects(projects);
        saveStorageData();
    }

    function removeProject(index) {

        if (currentProjectId === index) {
            currentProjectId = null;
        }

        projects.splice(index, 1);
        domControl.drawProjects(projects);
        saveStorageData();
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
        saveStorageData();
    }

    function markToDoForProject(projectIndex, toDoIndex) {
        projects[projectIndex].toggleToDoComplete(toDoIndex);
        saveStorageData();
    }

    function removeToDoFromProject(projectIndex, toDoIndex) {
        projects[projectIndex].removeToDoAt(toDoIndex);
        saveStorageData();
    }

    function changeToDoInProject(toDoIndex, projectIndex, title, description, dueDate, priority) {
        projects[projectIndex].changeToDoData(toDoIndex, title, description, dueDate, priority);
        saveStorageData();
    }

    function getAllProjects() {
        return [...projects];
    }

    return;
})();
