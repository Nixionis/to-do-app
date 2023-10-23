function createToDo(newTitle, newDescription, newDueDate, newPriority, newCompleted) {

    let title = newTitle;
    let description = newDescription;
    let dueDate = newDueDate;
    let priority = newPriority;
    let completed = newCompleted;

    return {
        get title() {
            return title;
        },

        set title(value) {
            if (typeof value !== 'string')
                value = String(value);

            title = value;
        },

        get description() {
            return description;
        },

        set description(value) {
            if (typeof value !== 'string')
                value = String(value);

            description = value;
        },

        get dueDate() {
            return dueDate;
        },

        set dueDate(value) {
            if (!value.constructor || value.constructor !== Date) {
                console.log('Incorrect data type for todo due date!');
                return;
            }

            dueDate = value;
        },

        get priority() {
            return priority;
        },

        set priority(value) {
            if (typeof value !== 'number') {
                value = Number(value);
            }

            priority = value;
        },

        get completed() {
            return completed;
        },

        set completed(value) {

            if (typeof value !== 'boolean') {
                console.log('Incorrect completed type for to do!');
                return;
            }

            completed = value;
        }
    }
}

export default createToDo;