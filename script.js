// Initialize SortableJS for each column
document.querySelectorAll('.tasks').forEach((tasksContainer) => {
    new Sortable(tasksContainer, {
      group: 'shared', // Allows dragging between columns
      animation: 150,
      onEnd: function (evt) {
        console.log('Task moved:', evt.item.textContent);
      },
    });
  });
  
  let completedTasks = 0;
  
  // Function to add a new task
  function addTask(columnId) {
    const taskTitle = prompt("Enter task title:");
    if (!taskTitle) return;
  
    const taskDescription = prompt("Enter task description:");
    const taskDeadline = prompt("Enter task deadline (YYYY-MM-DD):");
  
    // Static Priority Suggestion
    const priority = suggestPriority(taskDescription);
  
    const taskElement = document.createElement('div');
    taskElement.className = 'task task-enter';
    taskElement.dataset.title = taskTitle;
    taskElement.dataset.description = taskDescription;
    taskElement.dataset.deadline = taskDeadline;
    taskElement.dataset.priority = priority;
  
    const today = new Date().toISOString().split('T')[0]; // Get today's date
  
    if (taskDeadline < today) {
      taskElement.style.backgroundColor = '#ffebee'; // Overdue
    } else if (taskDeadline === today) {
      taskElement.style.backgroundColor = '#fff3e0'; // Due today
    } else {
      taskElement.style.backgroundColor = '#e8f5e9'; // Future
    }
  
    taskElement.innerHTML = `
      <strong>${taskTitle}</strong><br>
      ${taskDescription}<br>
      Deadline: ${taskDeadline}<br>
      Priority: ${priority}<br>
      <button onclick="completeTask(this.parentElement)">Complete</button>
    `;
  
    taskElement.addEventListener('click', () => openModal(taskElement));
  
    document.querySelector(`#${columnId} .tasks`).appendChild(taskElement);
  }
  
  // Static Priority Suggestion
  function suggestPriority(description) {
    if (!description) return "Medium";
  
    const highPriorityKeywords = ["urgent", "important", "deadline"];
    const lowPriorityKeywords = ["optional", "later", "low"];
  
    const lowerCaseDescription = description.toLowerCase();
  
    if (highPriorityKeywords.some(keyword => lowerCaseDescription.includes(keyword))) {
      return "High";
    } else if (lowPriorityKeywords.some(keyword => lowerCaseDescription.includes(keyword))) {
      return "Low";
    } else {
      return "Medium";
    }
  }
  
  // Function to complete a task
  function completeTask(taskElement) {
    // Move the task to the "Done" column
    const doneColumn = document.querySelector('#done .tasks');
    doneColumn.appendChild(taskElement);
  
    // Add a "completed" class for styling
    taskElement.classList.add('completed-task');
  
    // Update progress bar and badges
    completedTasks++;
    updateProgress();
    checkBadges(completedTasks);
  
    // Confetti effect
    const confettiSettings = { target: 'confetti-canvas' };
    const confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();
    setTimeout(() => confetti.clear(), 3000);
  }
  
  // Update Progress Bar
  function updateProgress() {
    const progressBar = document.getElementById('progress-bar');
    const completedTasksCount = document.getElementById('completed-tasks-count');
    completedTasksCount.textContent = completedTasks;
    progressBar.style.width = `${Math.min(completedTasks * 10, 100)}%`;
  }
  
  // Gamification: Check for badges
  const badges = {
    "5-tasks": "🌟 Productivity Pro",
    "10-tasks": "🏆 Task Master",
  };
  
  function checkBadges(completedTasks) {
    if (completedTasks >= 5) {
      alert(`Congrats! You earned the badge: ${badges["5-tasks"]}`);
    }
    if (completedTasks >= 10) {
      alert(`Congrats! You earned the badge: ${badges["10-tasks"]}`);
    }
  }
  
  // Open Task Modal
  function openModal(taskElement) {
    const modal = document.getElementById('task-modal');
    const modalTitleInput = document.getElementById('modal-title-input');
    const modalDescriptionInput = document.getElementById('modal-description-input');
    const modalDeadlineInput = document.getElementById('modal-deadline-input');
    const modalPriorityInput = document.getElementById('modal-priority-input');
  
    // Populate modal fields with current task data
    modalTitleInput.value = taskElement.dataset.title;
    modalDescriptionInput.value = taskElement.dataset.description;
    modalDeadlineInput.value = taskElement.dataset.deadline;
    modalPriorityInput.value = taskElement.dataset.priority;
  
    modal.style.display = 'block';
  
    // Save Changes Button
    const saveTaskButton = document.getElementById('save-task');
    saveTaskButton.onclick = () => {
      // Update task data
      taskElement.dataset.title = modalTitleInput.value;
      taskElement.dataset.description = modalDescriptionInput.value;
      taskElement.dataset.deadline = modalDeadlineInput.value;
      taskElement.dataset.priority = modalPriorityInput.value;
  
      // Update task HTML
      taskElement.innerHTML = `
        <strong>${modalTitleInput.value}</strong><br>
        ${modalDescriptionInput.value}<br>
        Deadline: ${modalDeadlineInput.value}<br>
        Priority: ${modalPriorityInput.value}<br>
        <button onclick="completeTask(this.parentElement)">Complete</button>
      `;
  
      // Close modal
      modal.style.display = 'none';
    };
  
    // Close Modal on Clicking Outside or Close Button
    const closeBtn = document.querySelector('.close');
    closeBtn.onclick = () => {
      modal.style.display = 'none';
    };
  
    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    };
  }
  
  // Dark Mode Toggle
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });






  import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Bar } from "react-chartjs-2";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { CalendarDays, AlertCircle, Clock } from "lucide-react";

const Dashboard = () => {
  const [date, setDate] = useState(new Date());

  const tasks = [
    { id: 1, title: "Complete project report", due: "2025-02-20", priority: "High" },
    { id: 2, title: "Fix website bugs", due: "2025-02-22", priority: "Medium" },
    { id: 3, title: "Prepare for presentation", due: "2025-02-19", priority: "High" },
    { id: 4, title: "Update documentation", due: "2025-02-25", priority: "Low" }
  ];

  const highPriorityTasks = tasks.filter(task => task.priority === "High");
  const upcomingDeadlines = tasks.sort((a, b) => new Date(a.due) - new Date(b.due));

  const taskData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        label: "Task Priority",
        data: [
          tasks.filter(task => task.priority === "High").length,
          tasks.filter(task => task.priority === "Medium").length,
          tasks.filter(task => task.priority === "Low").length
        ],
        backgroundColor: ["#ff3d00", "#ffb300", "#4caf50"]
      }
    ]
  };

  return (
    <div className="p-6 space-y-6">
      <motion.h1 className="text-2xl font-bold" animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
        Dashboard
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold mb-2 flex items-center"><AlertCircle className="mr-2 text-red-500" /> High Priority Tasks</h2>
            <ul className="list-disc pl-5">
              {highPriorityTasks.map(task => (
                <li key={task.id} className="text-red-600">{task.title}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold mb-2 flex items-center"><Clock className="mr-2 text-blue-500" /> Upcoming Deadlines</h2>
            <ul className="list-disc pl-5">
              {upcomingDeadlines.map(task => (
                <li key={task.id}>{task.title} - {format(new Date(task.due), "MMM d, yyyy")}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold mb-2 flex items-center"><CalendarDays className="mr-2 text-green-500" /> Calendar View</h2>
            <Calendar onChange={setDate} value={date} className="border rounded-lg w-full" />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold mb-2">Task Distribution</h2>
          <Bar data={taskData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;


  
