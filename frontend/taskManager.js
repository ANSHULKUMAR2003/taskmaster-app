const taskListElement = document.getElementById('taskList');
const addTaskButton = document.getElementById('addTaskButton');

// Fetch and display tasks
async function fetchTasks() {
  const response = await fetch('http://localhost:5000/api/tasks', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const data = await response.json();

  if (response.ok) {
    taskListElement.innerHTML = '';
    data.forEach((task) => {
      const li = document.createElement('li');
      li.innerHTML = `
        ${task.task} ${task.completed ? '(Completed)' : '(Pending)'}
        <button onclick="toggleTask(${task._id}, ${!task.completed})">${task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}</button>
        <button onclick="deleteTask(${task._id})">Delete</button>
      `;
      taskListElement.appendChild(li);
    });
  } else {
    alert('Error fetching tasks');
  }
}

// Add a new task
addTaskButton.addEventListener('click', async () => {
  const newTask = document.getElementById('newTask').value;

  if (!newTask) {
    alert('Please enter a task');
    return;
  }

  const response = await fetch('http://localhost:5000/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ task: newTask }),
    credentials: 'include',
  });

  const data = await response.json();

  if (response.ok) {
    alert('Task added successfully!');
    fetchTasks();
  } else {
    alert(data.error || 'Error adding task');
  }
});

// Toggle task completion status (mark as complete/incomplete)
async function toggleTask(taskId, completed) {
  const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ completed }),
    credentials: 'include',
  });

  const data = await response.json();

  if (response.ok) {
    alert('Task updated successfully!');
    fetchTasks();
  } else {
    alert(data.error || 'Error updating task');
  }
}

// Delete task
async function deleteTask(taskId) {
  const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  const data = await response.json();

  if (response.ok) {
    alert('Task deleted successfully!');
    fetchTasks();
  } else {
    alert(data.error || 'Error deleting task');
  }
}

// Call fetchTasks on page load
fetchTasks();
