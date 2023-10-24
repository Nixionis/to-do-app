import { format, isToday, isFuture, differenceInCalendarDays } from "date-fns";

function domController(doc,
    addProjectFunction,
    changeProjectNameFunction,
    removeProjectFunction,
    getProjectToDoFunction,
    getCurrentProjectFunction,
    addNewToDoFunction,
    toggleToDoCompleteFunction,
    removeToDoFromProjectFunction,
    changeToDoInProjectFunction,
    getAllProjectsFunction) {

    const menuBtn = doc.querySelector('.js-menu-btn');

    //aside elements
    const aside = doc.querySelector('.aside');
    const projectList = doc.querySelector('.project-list');

    const addProjectBtn = doc.querySelector('.js-add-project');

    const newProjectRow = doc.querySelector('.js-newProject-form');
    const projectCreateForm = createProjectForm(false, newProjectRow);
    newProjectRow.appendChild(projectCreateForm);

    const editProjectRow = doc.querySelector('.js-editProject-form');
    const projectEditForm = createProjectForm(true, editProjectRow);
    editProjectRow.appendChild(projectEditForm);

    const allTasksButton = doc.querySelector('.js-all-tasks');
    const todayTasksButton = doc.querySelector('.js-today-tasks');
    const nextWeekTasksButton = doc.querySelector('.js-week-tasks');
    const completedTasksButton = doc.querySelector('.js-completed-tasks');

    //ToDo elements
    const cardsContainer = doc.querySelector('.cards');
    const addToDoBtn = doc.querySelector('.add-task');
    const toDoAddForm = doc.querySelector('.js-add-todo');
    const toDoEditForm = doc.querySelector('.js-edit-todo');

    let editingProjectId = null;
    let editingToDo = null;


    function unselectTaskButtons() {
        allTasksButton.classList.remove('active');
        todayTasksButton.classList.remove('active');
        nextWeekTasksButton.classList.remove('active');
        completedTasksButton.classList.remove('active');
    }

    function unselectProject() {
        const project = doc.querySelector(`.aside__item.highlight`);
        if (project)
            project.classList.remove('highlight');
    }

    function toggleAside() {
        menuBtn.classList.toggle('pressed');
        aside.classList.toggle('hide-display');
    }

    function showHiddenProject() {
        if (editingProjectId !== null) {
            doc.querySelector(`.aside__item[data-project-id='${editingProjectId}']`).classList.remove('hide-height');
            editingProjectId = null;
        }
    }

    function showHiddenToDo() {
        if (editingToDo !== null) {
            doc.querySelector(`.card[data-project-id='${editingToDo.projectIndex}'][data-to-do-id='${editingToDo.todoIndex}']`).classList.remove('hide-display');
            editingToDo = null;
        }
    }

    function createProjectForm(edit, row) {

        const form = doc.createElement('form');
        form.classList.add('new-project');

        const inputRow = doc.createElement('div');
        inputRow.classList.add('new-project__row');
        const titleInput = doc.createElement('input');
        titleInput.classList.add('new-project__input');
        titleInput.type = 'text';
        titleInput.minlength = '1';
        titleInput.placeholder = 'Enter Project Name';
        inputRow.appendChild(titleInput);

        const btnsRow = doc.createElement('div');
        btnsRow.classList.add('new-project__row');
        const addBtn = doc.createElement('button');
        addBtn.classList.add('new-project__add');
        addBtn.type = 'submit';
        addBtn.textContent = edit ? 'Edit' : 'Add';
        btnsRow.appendChild(addBtn);
        const cancelBtn = doc.createElement('button');
        cancelBtn.classList.add('new-project__cancel');
        cancelBtn.type = 'button';
        cancelBtn.textContent = 'Cancel';
        btnsRow.appendChild(cancelBtn);

        form.appendChild(inputRow);
        form.appendChild(btnsRow);

        //Form cancel button

        cancelBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            row.classList.add('hide-height');

            if (edit) {
                showHiddenProject();
            }

        }, { capture: false });

        //Form accept button

        addBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (!titleInput.value) {
                console.log('Project title is too short!');
                return;
            }

            if (!edit) {
                addProjectFunction(titleInput.value);
            } else {
                changeProjectNameFunction(titleInput.value, editingProjectId);

            }


            titleInput.value = '';
            row.classList.add('hide-height');

        }, { capture: false })

        return form;
    }

    function showEditForm(projectId, projectTitle) {
        const editingProject = doc.querySelector(`.aside__item[data-project-id='${projectId}']`);
        editProjectRow.classList.add('hide-height');
        projectEditForm.querySelector('.new-project__input').value = projectTitle;
        projectList.insertBefore(editProjectRow, editingProject);
        setTimeout(() => { editProjectRow.classList.remove('hide-height'); }, 0);


        editingProjectId = projectId;
    }

    function cleanProjects() {
        editingProjectId = null;
        editProjectRow.classList.add('hide-height');


        const projects = doc.querySelectorAll('.aside__item[data-project-id]');

        for (let i = projects.length - 1; i >= 0; i--) {
            projects[i].remove();
        }
    }

    const drawProjects = function (projects) {
        cleanProjects();

        for (let i = 0; i < projects.length; i++) {

            const listItem = doc.createElement('li');
            listItem.classList.add('aside__item');
            listItem.classList.add('project');
            listItem.dataset.projectId = `${i}`;

            if (i === getCurrentProjectFunction()) {
                listItem.classList.add('highlight');
            }

            const projectTitle = doc.createElement('p');
            projectTitle.textContent = projects[i].title;
            listItem.appendChild(projectTitle);

            const actionsRow = doc.createElement('div');
            actionsRow.classList.add('aside__item-actions');
            const actionEdit = doc.createElement('div');
            actionEdit.classList.add('aside__item-action');
            const actionEditIcon = doc.createElement('span');
            actionEditIcon.classList.add('material-icons-round');
            actionEditIcon.textContent = 'edit';
            actionEdit.appendChild(actionEditIcon);
            actionsRow.appendChild(actionEdit);

            const actionRemove = doc.createElement('div');
            actionRemove.classList.add('aside__item-action');
            const actionRemoveIcon = doc.createElement('span');
            actionRemoveIcon.classList.add('material-icons-round');
            actionRemoveIcon.textContent = 'clear';
            actionRemove.appendChild(actionRemoveIcon);
            actionsRow.appendChild(actionRemove);

            listItem.appendChild(actionsRow);

            projectList.insertBefore(listItem, newProjectRow);

            //Action events

            //Change Name event
            actionEdit.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                listItem.classList.add('hide-height');
                showHiddenProject();
                showEditForm(i, projects[i].title);
            }, { capture: false });

            //Remove event
            actionRemove.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                listItem.classList.add('hide-height');
                showHiddenProject();

                if (i === getCurrentProjectFunction())
                    cleanToDos();

                removeProjectFunction(i);
            }, { capture: false });

            //Select event
            listItem.addEventListener('click', (e) => {
                e.stopPropagation();
                unselectTaskButtons();

                const previousProject = doc.querySelector('.project.highlight');
                if (previousProject) {
                    previousProject.classList.remove('highlight');
                }

                listItem.classList.add('highlight');

                let toDos = getProjectToDoFunction(i);

                drawToDos(toDos, i, true);
            }, { capture: false })
        }
    }

    function cleanToDos(forProject) {
        addToDoBtn.classList.add('hide-height');
        toDoAddForm.classList.add('hide-height');
        toDoEditForm.classList.add('hide-height');
        editingToDo = null;

        if (!forProject)
            return;

        const toDos = doc.querySelectorAll('.card[data-project-id]');

        for (let i = toDos.length - 1; i >= 0; i--) {
            toDos[i].remove();
        }
    }

    function drawToDos(toDos, projectId, forProject = false, selectType = 0) {

        cleanToDos(forProject);
        for (let i = 0; i < toDos.length; i++) {

            if (selectType === 1) {
                if (!isToday(toDos[i].dueDate))
                    continue;
            } else if (selectType === 2 && !isToday(toDos[i].dueDate)) {
                if (!isFuture(toDos[i].dueDate) || differenceInCalendarDays(new Date(), toDos[i].dueDate) > 7)
                    continue;
            } else if (selectType === 3) {
                if (toDos[i].completed === false)
                    continue;
            }

            const toDoNode = generateToDo(toDos[i], i, projectId);

            cardsContainer.insertBefore(toDoNode, toDoAddForm);
        }

        if (forProject) {
            addToDoBtn.classList.remove('hide-height');
        }
    }

    function generateToDo(toDo, index, projectId) {

        const cardItem = doc.createElement('div');
        cardItem.classList.add('card');
        cardItem.classList.add(toDo.priority === 0 ? 'low' : toDo.priority === 1 ? 'medium' : 'high');

        cardItem.dataset.toDoId = `${index}`;
        cardItem.dataset.projectId = `${projectId}`;

        const cardCheckbox = doc.createElement('div');
        cardCheckbox.classList.add('card__checkbox');
        const checkboxUncheck = doc.createElement('span');
        checkboxUncheck.classList.add('material-icons-round');
        checkboxUncheck.textContent = 'radio_button_unchecked';
        cardCheckbox.appendChild(checkboxUncheck);
        const checkboxCheck = doc.createElement('span');
        checkboxCheck.classList.add('material-icons-round');
        checkboxCheck.textContent = 'task_alt';
        cardCheckbox.appendChild(checkboxCheck);
        cardItem.appendChild(cardCheckbox);

        if (toDo.completed) {
            cardItem.classList.add('completed');
            checkboxUncheck.classList.add('hide-display');
            checkboxCheck.classList.remove('hide-display');
        } else {
            checkboxUncheck.classList.remove('hide-display');
            checkboxCheck.classList.add('hide-display');
        }

        const cardExpand = doc.createElement('div');
        cardExpand.classList.add('card__expand');
        const expand = doc.createElement('span');
        expand.classList.add('material-icons-round');
        expand.textContent = 'expand_more';
        cardExpand.appendChild(expand);
        const hide = doc.createElement('span');
        hide.classList.add('material-icons-round');
        hide.classList.add('hide-display');
        hide.textContent = 'expand_less';
        cardExpand.appendChild(hide);
        cardItem.appendChild(cardExpand);

        const cardTitle = doc.createElement('h3');
        cardTitle.classList.add('card__title');
        cardTitle.textContent = toDo.title;
        cardItem.appendChild(cardTitle);

        const dueDateText = format(toDo.dueDate, 'MM/dd/yyyy');
        const dueDate = doc.createElement('p');
        dueDate.classList.add('card__due-date');
        dueDate.textContent = dueDateText;
        cardItem.appendChild(dueDate);

        const actionsRow = doc.createElement('div');
        actionsRow.classList.add('card__actions');
        const actionEdit = doc.createElement('div');
        actionEdit.classList.add('card__action');
        const actionEditIcon = doc.createElement('span');
        actionEditIcon.classList.add('material-icons-round');
        actionEditIcon.textContent = 'edit';
        actionEdit.appendChild(actionEditIcon);
        actionsRow.appendChild(actionEdit);

        const actionRemove = doc.createElement('div');
        actionRemove.classList.add('card__action');
        const actionRemoveIcon = doc.createElement('span');
        actionRemoveIcon.classList.add('material-icons-round');
        actionRemoveIcon.textContent = 'clear';
        actionRemove.appendChild(actionRemoveIcon);
        actionsRow.appendChild(actionRemove);

        cardItem.appendChild(actionsRow);

        const cardDesc = doc.createElement('p');
        cardDesc.classList.add('card__desc');
        cardDesc.classList.add('hide-height');
        cardDesc.textContent = toDo.description;
        cardItem.appendChild(cardDesc);


        //Action events

        //Mark complete event

        cardCheckbox.addEventListener('click', () => {
            toggleToDoCompleteFunction(projectId, index);

            const toDo = getProjectToDoFunction(projectId);

            if (toDo[index].completed) {
                cardItem.classList.add('completed');

                checkboxUncheck.classList.add('hide-display');
                checkboxCheck.classList.remove('hide-display');

            } else {
                cardItem.classList.remove('completed');

                checkboxUncheck.classList.remove('hide-display');
                checkboxCheck.classList.add('hide-display');
            }
        });

        //Expand event

        cardExpand.addEventListener('click', () => {
            expand.classList.toggle('hide-display');
            hide.classList.toggle('hide-display');
            cardDesc.classList.toggle('hide-height');
        });

        //Edit event

        actionEdit.addEventListener('click', () => {
            showHiddenToDo();
            editingToDo = {
                projectIndex: projectId,
                todoIndex: index
            };

            cardItem.classList.add('hide-display');

            toDoEditForm.classList.add('hide-height');
            cardsContainer.insertBefore(toDoEditForm, cardItem);
            insertDataToEditToDoForm(toDo.title, toDo.priority, toDo.description, toDo.dueDate);


            setTimeout(() => {
                toDoEditForm.classList.remove('hide-height');
            }, 0);
        });

        //Remove event

        actionRemove.addEventListener('click', () => {
            removeToDoFromProjectFunction(projectId, index);
            cardItem.remove();
        });

        return cardItem;

    }

    function addTodo() {

        const titleInput = toDoAddForm.querySelector('.new-card__title-input');
        const dueDateInput = toDoAddForm.querySelector('.new-card__date-input');
        const priorityInput = toDoAddForm.querySelector('.new-card__priority');
        const descInput = toDoAddForm.querySelector('.new-card__desc-input');

        const titleText = titleInput.value;
        if (!titleText) {
            return;
        }

        let dueDate = dueDateInput.value;
        if (!dueDate) {
            return;
        }
        dueDate = new Date(dueDate);

        const priority = Number(priorityInput.value);
        const descText = descInput.value || '';

        addNewToDoFunction({ title: titleText, dueDate, priority, description: descText });

        const currentProjectId = getCurrentProjectFunction();
        let toDos = getProjectToDoFunction(currentProjectId);
        drawToDos(toDos, currentProjectId, true);

        titleInput.value = '';
        dueDateInput.value = '';
        priorityInput.value = '0';
        descInput.value = '';
    }

    function changeToDoCard(projectIndex, toDoIndex, newTitle, newDescription, newDueDate, newPriority) {
        const card = doc.querySelector(`.card[data-project-id='${projectIndex}'][data-to-do-id='${toDoIndex}']`);
        card.classList.remove('low');
        card.classList.remove('medium');
        card.classList.remove('high');

        card.classList.add(
            newPriority === 0 ? 'low' :
                newPriority === 1 ? 'medium' :
                    'high'
        );

        card.querySelector('.card__title').textContent = newTitle;
        card.querySelector('.card__desc').textContent = newDescription;
        card.querySelector('.card__due-date').textContent = format(newDueDate, 'MM/dd/yyyy');
    }

    function insertDataToEditToDoForm(title, priority, description, dueDate) {
        const titleInput = toDoEditForm.querySelector('.new-card__title-input');
        const dueDateInput = toDoEditForm.querySelector('.new-card__date-input');
        const priorityInput = toDoEditForm.querySelector('.new-card__priority');
        const descInput = toDoEditForm.querySelector('.new-card__desc-input');

        titleInput.value = title;
        dueDateInput.valueAsDate = dueDate;
        priorityInput.value = priority;
        descInput.value = description;
    }

    menuBtn.addEventListener('click', () => toggleAside());

    addProjectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        newProjectRow.classList.remove('hide-height');
    }, { capture: false });

    addToDoBtn.addEventListener('click', () => {
        //const currentProjectId = getCurrentProjectFunction();

        toDoAddForm.classList.remove('hide-height');
    });

    //Todo Add form

    toDoAddForm.querySelector('.new-card__add').addEventListener('click', (e) => {
        e.preventDefault();

        addTodo();
    });

    toDoAddForm.querySelector('.new-card__cancel').addEventListener('click', (e) => {
        e.preventDefault();

        toDoAddForm.classList.add('hide-height');
    });

    //Todo edit form

    toDoEditForm.querySelector('.new-card__edit').addEventListener('click', (e) => {
        e.preventDefault();

        const titleInput = toDoEditForm.querySelector('.new-card__title-input');
        const dueDateInput = toDoEditForm.querySelector('.new-card__date-input');
        const priorityInput = toDoEditForm.querySelector('.new-card__priority');
        const descInput = toDoEditForm.querySelector('.new-card__desc-input');

        if (!titleInput.value || !dueDateInput.value || !descInput.value)
            return;

        let dueDateValue = new Date(dueDateInput.value);

        changeToDoInProjectFunction(editingToDo.todoIndex,
            editingToDo.projectIndex,
            titleInput.value,
            descInput.value,
            dueDateValue,
            priorityInput.value);

        changeToDoCard(editingToDo.projectIndex,
            editingToDo.todoIndex,
            titleInput.value,
            descInput.value,
            dueDateValue,
            priorityInput.value);

        doc.querySelector(`.card[data-project-id='${editingToDo.projectIndex}'][data-to-do-id='${editingToDo.todoIndex}']`).classList.remove('hide-display');
        editingToDo = null;
        toDoEditForm.classList.add('hide-height');
    });

    toDoEditForm.querySelector('.new-card__cancel').addEventListener('click', (e) => {
        e.preventDefault();

        showHiddenToDo();
        toDoEditForm.classList.add('hide-height');
    });

    //Category actions

    allTasksButton.addEventListener('click', () => {

        unselectTaskButtons();
        unselectProject();

        allTasksButton.classList.add('active');

        cleanToDos(true);
        const projects = getAllProjectsFunction();

        for (let projI = 0; projI < projects.length; projI++) {
            const toDos = projects[projI].toDos;

            drawToDos(toDos, projI, false);
        }
    });

    todayTasksButton.addEventListener('click', () => {

        unselectTaskButtons();
        unselectProject();

        todayTasksButton.classList.add('active');

        cleanToDos(true);
        const projects = getAllProjectsFunction();

        for (let projI = 0; projI < projects.length; projI++) {
            const toDos = projects[projI].toDos;

            drawToDos(toDos, projI, false, 1);
        }
    });

    nextWeekTasksButton.addEventListener('click', () => {

        unselectTaskButtons();
        unselectProject();

        nextWeekTasksButton.classList.add('active');

        cleanToDos(true);
        const projects = getAllProjectsFunction();

        for (let projI = 0; projI < projects.length; projI++) {
            const toDos = projects[projI].toDos;

            drawToDos(toDos, projI, false, 2);
        }
    });

    completedTasksButton.addEventListener('click', () => {

        unselectTaskButtons();
        unselectProject();
        completedTasksButton.classList.add('active');

        cleanToDos(true);
        const projects = getAllProjectsFunction();

        for (let projI = 0; projI < projects.length; projI++) {
            const toDos = projects[projI].toDos;

            drawToDos(toDos, projI, false, 3);
        }
    });

    const clickAllTasks = function () {
        allTasksButton.click();
    }

    return { drawProjects, clickAllTasks };
};

export default domController;