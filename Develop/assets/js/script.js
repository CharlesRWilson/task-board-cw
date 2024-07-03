// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || []; // Ensures taskList is an array
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1; // Ensures nextId is 1

// Todo: create a function to generate a unique task id
function generateTaskId() {
    console.log("generating task id... ");
    nextId++;
    console.log(nextId);
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return nextId;
}
// Todo: create a function to create a task card
function createTaskCard(task = {}) {
    console.log("creating task card... ");
    const newTaskId = generateTaskId()
    const newTaskCard = $("<span>").addClass("card draggable border-dark mb-3 bg-light").attr("data-task-id", "task-" + newTaskId);
    console.log(newTaskCard);

    const taskBody = $("<div>").addClass("card-body").appendTo(newTaskCard);
    $("<h5>").addClass("card-title").text(task.title).appendTo(taskBody);
    $("<p>").addClass("card-text").text(task.description).appendTo(taskBody);
    $("<p>").addClass("card-text").html(`<small>${task.dueDate}</small>`).appendTo(taskBody);
    $("<button>").addClass("btn btn-danger p-2 delete-task").text("Delete").attr("data-task-id", task.id).appendTo(taskBody);

    const dueDate = dayjs(task.dueDate);
    const now = dayjs();
    if (dueDate.isBefore(now)) {
        newTaskCard.addClass('bg-danger');
    } else if (dueDate.diff(now, 'day') <= 3) {
        newTaskCard.addClass('bg-warning');
    }

    return newTaskCard
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    console.log("rendering task list to the page... ");
    $('#todo-cards, #in-progress-cards, #done-cards').empty();
    taskList.forEach(task => {
        const taskCard = createTaskCard(task);
        $(`#${task.status}-cards`).append(taskCard);
    });
    addDraggableFeature();
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(nextId));
}
// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    console.log(" ");
    event.preventDefault();
    const newTask = {
        id: generateTaskId(),
        title: $('#taskTitle').val(),
        description: $('#taskDescription').val(),
        dueDate: $('#taskDueDate').val(),
        status: 'todo'
    };
    taskList.push(newTask);
    saveTasks();
    renderTaskList();
    $('#formModal').modal('hide');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    console.log(" ");
    const taskId = $(event.target).data('task-id');
    taskList = taskList.filter(task => task.id !== taskId);
    saveTasks();
    renderTaskList();
}
// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    console.log(" ");
    const taskId = ui.helper.data('task-id');
    const newStatus = $(event.target).closest('.lane').attr('id').split('-')[0];
    const task = taskList.find(task => task.id == taskId);
    if (task) {
        task.status = newStatus;
        saveTasks();
        renderTaskList();
    }
}
function addDraggableFeature() {
    $('.draggable').draggable({
        revert: "invalid",
        stop: function(event, ui) {
            $(this).css({top: 0, left: 0});
        }
    });
    $('.lane .card-body').droppable({
        accept: ".draggable",
        drop: handleDrop
    });
}
// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    $('#taskForm').on('submit', handleAddTask);
    $(document).on('click', '.delete-task', handleDeleteTask);
});

