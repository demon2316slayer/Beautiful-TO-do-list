//Storing the elements in variables through their ids
const input = document.getElementById("task-Input");
const btn = document.getElementById("addTask");
const list = document.getElementById("taskTest");
const prioritySelect = document.getElementById("priority");
const dateInput = document.getElementById("task-date");

// Load tasks from localStorage when the page loads
window.onload = function() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => {
        addTaskToList(task.text, task.priority, task.date, task.completed);
    });
};

// Save tasks to localStorage
function saveTasks() {
    const tasks = [];
    list.querySelectorAll('li').forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const text = item.querySelector('.task-text').textContent;
        const priority = item.dataset.priority;
        const date = item.dataset.date;
        tasks.push({
            text: text,
            priority: priority,
            date: date,
            completed: checkbox.checked
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add task on button click
btn.addEventListener('click', function () {
    const taskList = input.value;
    const priority = prioritySelect.value;
    const date = dateInput.value;

    if (taskList.trim() === "") {
        alert("Please enter a task");
        return;
    }

    addTaskToList(taskList, priority, date, false); // Add task to UI
    saveTasks(); // Save tasks to localStorage

    // Clear input fields
    input.value = "";
    dateInput.value = "";
});

// Function to add task to the list (UI)
function addTaskToList(taskText, priority, date, completed) {
    const listItem = document.createElement('li');
    listItem.dataset.priority = priority;
    listItem.dataset.date = date;

    const checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.checked = completed;

    if (completed) {
        listItem.style.textDecoration = "line-through";
    }

    checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
            listItem.style.textDecoration = "line-through";
        } else {
            listItem.style.textDecoration = "none";
        }
        saveTasks(); // Save tasks to localStorage when task is marked/unmarked
    });

    const taskTextElement = document.createElement('span');
    taskTextElement.classList.add('task-text');
    taskTextElement.textContent = `${taskText} (${priority} priority) (Due: ${date})`;

    // Apply priority color
    if (priority === "high") {
        listItem.style.color = "red";
    } else if (priority === "med") {
        listItem.style.color = "orange";
    } else {
        listItem.style.color = "green";
    }

    // Create Remove button
    const removeBtn = document.createElement('button');
    removeBtn.textContent = "Remove";
    removeBtn.style.marginLeft = "10px";
    removeBtn.style.color = "red";
    removeBtn.addEventListener('click', function () {
        list.removeChild(listItem); // Remove from UI
        saveTasks(); // Update localStorage after removing
    });

    // Create Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = "Edit";
    editBtn.style.marginLeft = "10px";
    editBtn.style.color = "blue";
    editBtn.addEventListener('click', function () {
        const newTask = prompt("Edit your task:", taskText);
        const newPriority = prompt("Edit priority (high, med, low):", priority);
        const newDate = prompt("Enter a new due date:", date);

        if (newTask && newPriority && newDate) {
            taskTextElement.textContent = `${newTask} (${newPriority} priority) (Due: ${newDate})`;
            listItem.dataset.priority = newPriority;
            listItem.dataset.date = newDate;

            // Apply priority color based on new priority
            if (newPriority === "high") {
                listItem.style.color = "red";
            } else if (newPriority === "med") {
                listItem.style.color = "orange";
            } else {
                listItem.style.color = "green";
            }

            saveTasks(); // Save the updated tasks to localStorage
        }
    });

    // Append the checkbox, task text, edit, and remove buttons
    listItem.appendChild(checkbox);
    listItem.appendChild(taskTextElement);
    listItem.appendChild(editBtn);
    listItem.appendChild(removeBtn);

    // Append the task to the list
    list.appendChild(listItem);
}
