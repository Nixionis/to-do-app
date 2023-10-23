function createProject(newTitle) {

    let title = newTitle;
    let toDoList = [];

    return {
        get title() {
            return title;
        },

        set title(value) {
            if (typeof value !== 'string')
                value = String(value);

            title = value;
        },

        get toDos() {
            return [...toDoList];
        },

        set toDos(value) {
            if (!Array.isArray(value)) {
                console.log('Value is not array for todos in project!');
                return;
            }

            toDoList = [...value];
        },

        pushToDo(newToDo) {
            toDoList.push(newToDo);
        },

        removeToDoAt(index) {
            if (index > toDoList.length - 1 || index < 0) {
                console.log('Incorrect index for todo removal in project!');
                return;
            }

            toDoList.splice(index, 1);
        },

        toggleToDoComplete(todoIndex) {
            toDoList[todoIndex].completed = !toDoList[todoIndex].completed;
        },

        changeToDoData(index, title, description, dueDate, priority) {
            toDoList[index].title = title;
            toDoList[index].description = description;
            toDoList[index].dueDate = dueDate;
            toDoList[index].priority = priority;
        }
    }
}

export default createProject;