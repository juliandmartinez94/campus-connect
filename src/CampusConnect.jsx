import React, { useState } from 'react';
import { FolderOpen, Bell, Users, Plus, Upload, Download, Send } from 'lucide-react';

// Sample data
const initialData = {
  user: {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@university.edu",
    studentId: "STU123456"
  },
  classes: [
    {
      id: 1,
      name: "Software Engineering",
      code: "CS 4320",
      projects: [
        {
          id: 1,
          name: "CampusConnect Development",
          description: "Build a collaborative platform for group projects",
          members: ["Alex Johnson", "Sarah Kim", "Mike Chen", "Emma Davis"],
          createdBy: "Alex Johnson"
        }
      ]
    },
    {
      id: 2,
      name: "Database Systems",
      code: "CS 3380",
      projects: [
        {
          id: 2,
          name: "Library Management System",
          description: "Design and implement a database for library operations",
          members: ["Alex Johnson", "Tom Wilson", "Lisa Park"],
          createdBy: "Tom Wilson"
        }
      ]
    }
  ],
  tasks: [
    { id: 1, projectId: 1, title: "Finish research draft", assignedTo: "Sarah Kim", dueDate: "2025-12-05", status: "in-progress", description: "Research competitive platforms" },
    { id: 2, projectId: 1, title: "Create wireframes", assignedTo: "Alex Johnson", dueDate: "2025-12-02", status: "completed", description: "Design main interface mockups" },
    { id: 3, projectId: 1, title: "Setup development environment", assignedTo: "Mike Chen", dueDate: "2025-12-01", status: "overdue", description: "Configure Node.js and React" },
    { id: 4, projectId: 2, title: "Database schema design", assignedTo: "Tom Wilson", dueDate: "2025-12-10", status: "pending", description: "Create ER diagram" }
  ],
  messages: [
    { id: 1, projectId: 1, author: "Sarah Kim", content: "Hey team! I've started on the research. Found some interesting platforms to analyze.", timestamp: "2025-11-28 09:30", threadId: null },
    { id: 2, projectId: 1, author: "Alex Johnson", content: "Great! Can you share what you've found so far?", timestamp: "2025-11-28 09:45", threadId: 1 },
    { id: 3, projectId: 1, author: "Mike Chen", content: "I'm having trouble with the dev environment setup. Anyone free to help?", timestamp: "2025-11-28 10:15", threadId: null },
    { id: 4, projectId: 1, author: "Emma Davis", content: "I can help! Let's jump on a quick call.", timestamp: "2025-11-28 10:20", threadId: 3 }
  ],
  files: [
    { id: 1, projectId: 1, name: "Project_Requirements.pdf", uploadedBy: "Alex Johnson", size: "2.3 MB", uploadDate: "2025-11-25", version: 1 },
    { id: 2, projectId: 1, name: "Wireframes_v2.fig", uploadedBy: "Sarah Kim", size: "5.1 MB", uploadDate: "2025-11-27", version: 2 },
    { id: 3, projectId: 2, name: "ER_Diagram_Draft.pdf", uploadedBy: "Tom Wilson", size: "1.8 MB", uploadDate: "2025-11-26", version: 1 }
  ],
  events: [
    { id: 1, projectId: 1, title: "Team Standup", startDate: "2025-12-01", startTime: "14:00", endTime: "14:30", location: "Zoom", createdBy: "Alex Johnson" },
    { id: 2, projectId: 1, title: "Design Review", startDate: "2025-12-03", startTime: "15:00", endTime: "16:00", location: "Library Room 204", createdBy: "Sarah Kim" },
    { id: 3, projectId: 2, title: "Database Workshop", startDate: "2025-12-08", startTime: "13:00", endTime: "15:00", location: "CS Building Lab 3", createdBy: "Tom Wilson" }
  ],
  notifications: [
    { id: 1, type: "task", message: "New task assigned: Create wireframes", read: false, timestamp: "2025-11-28 08:00" },
    { id: 2, type: "message", message: "Mike Chen posted in CampusConnect Development", read: false, timestamp: "2025-11-28 10:15" },
    { id: 3, type: "file", message: "Sarah Kim uploaded Wireframes_v2.fig", read: true, timestamp: "2025-11-27 16:30" }
  ]
};

export default function CampusConnect() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'project'
  const [projectTab, setProjectTab] = useState('tasks');       // 'tasks' | 'chat' | 'files' | 'calendar'
  const [selectedProject, setSelectedProject] = useState(null);
  const [data, setData] = useState(initialData);
  const [newMessage, setNewMessage] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({ title: '', assignedTo: '', dueDate: '', description: '' });
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setProjectTab('tasks'); // default tab when opening a project
    setCurrentView('project');
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedProject) {
      const newMsg = {
        id: data.messages.length + 1,
        projectId: selectedProject.id,
        author: data.user.name,
        content: newMessage,
        timestamp: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }),
        threadId: null
      };
      setData({ ...data, messages: [...data.messages, newMsg] });
      setNewMessage('');
    }
  };

  const handleCreateTask = () => {
    if (newTaskForm.title && selectedProject) {
      const newTask = {
        id: data.tasks.length + 1,
        projectId: selectedProject.id,
        title: newTaskForm.title,
        assignedTo: newTaskForm.assignedTo,
        dueDate: newTaskForm.dueDate,
        status: 'pending',
        description: newTaskForm.description
      };
      setData({ ...data, tasks: [...data.tasks, newTask] });
      setNewTaskForm({ title: '', assignedTo: '', dueDate: '', description: '' });
      setShowNewTaskForm(false);
    }
  };

  const markNotificationRead = (id) => {
    setData({
      ...data,
      notifications: data.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    });
  };

  const unreadCount = data.notifications.filter(n => !n.read).length;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-600 mb-2">CampusConnect</h1>
            <p className="text-gray-600">Collaborate Better. Achieve More.</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">University Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="student@university.edu"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              Sign In
            </button>
            <a href="#" className="block text-center text-indigo-600 text-sm mt-4 hover:underline">
              Forgot Password?
            </a>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-bold">CampusConnect</h1>
            <button
              onClick={() => { setCurrentView('dashboard'); setSelectedProject(null); }}
              className={`px-3 py-1 rounded ${currentView === 'dashboard' ? 'bg-indigo-700' : 'hover:bg-indigo-500'}`}
            >
              Dashboard
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-indigo-500 rounded-full relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl text-gray-800 z-50">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {data.notifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${!notif.read ? 'bg-blue-50' : ''}`}
                      >
                        <p className="text-sm">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.timestamp}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{data.user.name}</p>
              <p className="text-xs text-indigo-200">{data.user.email}</p>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* DASHBOARD VIEW */}
        {currentView === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Classes and Projects */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">My Classes</h2>
              {data.classes.map(cls => (
                <div key={cls.id} className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-semibold text-indigo-600 mb-4">
                    {cls.name} ({cls.code})
                  </h3>
                  {cls.projects.length > 0 ? (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-gray-600">Group Projects:</p>
                      {cls.projects.map(project => (
                        <div
                          key={project.id}
                          onClick={() => handleProjectClick(project)}
                          className="border border-gray-200 rounded-lg p-4 hover:border-indigo-400 hover:shadow-md cursor-pointer transition"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-800">{project.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                            </div>
                            <Users size={20} className="text-gray-400 mt-1" />
                          </div>
                          <div className="flex items-center mt-3 text-xs text-gray-500">
                            <Users size={14} className="mr-1" />
                            {project.members.length} members
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No group projects yet</p>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Tasks Due Soon</h3>
                <div className="space-y-3">
                  {data.tasks.slice(0, 3).map(task => (
                    <div key={task.id} className={`p-3 rounded-lg border ${getStatusColor(task.status)}`}>
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs mt-1">Due: {task.dueDate}</p>
                      <p className="text-xs">Assigned: {task.assignedTo}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Upcoming Events</h3>
                <div className="space-y-3">
                  {data.events.slice(0, 2).map(event => (
                    <div key={event.id} className="p-3 border border-gray-200 rounded-lg">
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {event.startDate} at {event.startTime}
                      </p>
                      <p className="text-xs text-gray-500">{event.location}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROJECT VIEW */}
        {currentView === 'project' && selectedProject && (
          <div>
            <button
              onClick={() => { setCurrentView('dashboard'); setSelectedProject(null); }}
              className="mb-4 text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              ← Back to Dashboard
            </button>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{selectedProject.name}</h2>
              <p className="text-gray-600 mt-2">{selectedProject.description}</p>
              <div className="flex items-center mt-4 text-sm text-gray-500">
                <Users size={16} className="mr-2" />
                <span>Team: {selectedProject.members.join(', ')}</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  {['tasks', 'chat', 'files', 'calendar'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setProjectTab(tab)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                        projectTab === tab
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tasks View */}
            {projectTab === 'tasks' && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Tasks</h3>
                  <button
                    onClick={() => setShowNewTaskForm(!showNewTaskForm)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
                  >
                    <Plus size={16} className="mr-2" /> New Task
                  </button>
                </div>

                {showNewTaskForm && (
                  <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h4 className="font-semibold mb-3">Create New Task</h4>
                    <input
                      type="text"
                      placeholder="Task title"
                      value={newTaskForm.title}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded mb-3"
                    />
                    <input
                      type="text"
                      placeholder="Assigned to"
                      value={newTaskForm.assignedTo}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, assignedTo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded mb-3"
                    />
                    <input
                      type="date"
                      value={newTaskForm.dueDate}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded mb-3"
                    />
                    <textarea
                      placeholder="Description"
                      value={newTaskForm.description}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded mb-3"
                      rows="2"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCreateTask}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                      >
                        Create
                      </button>
                      <button
                        onClick={() => setShowNewTaskForm(false)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {data.tasks
                    .filter(t => t.projectId === selectedProject.id)
                    .map(task => (
                      <div key={task.id} className={`p-4 rounded-lg border-2 ${getStatusColor(task.status)}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{task.title}</h4>
                            <p className="text-sm mt-1">{task.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm">
                              <span>Assigned: {task.assignedTo}</span>
                              <span>Due: {task.dueDate}</span>
                            </div>
                          </div>
                          <span className="text-xs font-semibold uppercase px-2 py-1 rounded">
                            {task.status}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Chat View */}
            {projectTab === 'chat' && (
              <div className="bg-white rounded-lg shadow">
                <div className="h-96 overflow-y-auto p-6 space-y-4">
                  {data.messages
                    .filter(m => m.projectId === selectedProject.id)
                    .map(msg => (
                      <div key={msg.id} className={msg.threadId ? 'ml-8' : ''}>
                        <div className="flex items-start space-x-3">
                          <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                            {msg.author.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-sm">{msg.author}</span>
                              <span className="text-xs text-gray-500">{msg.timestamp}</span>
                            </div>
                            <p className="mt-1 text-gray-800">{msg.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Files View */}
            {projectTab === 'files' && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Files</h3>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center">
                    <Upload size={16} className="mr-2" /> Upload File
                  </button>
                </div>
                <div className="space-y-3">
                  {data.files
                    .filter(f => f.projectId === selectedProject.id)
                    .map(file => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          <FolderOpen className="text-indigo-600" size={24} />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              Uploaded by {file.uploadedBy} on {file.uploadDate} • {file.size} • v{file.version}
                            </p>
                          </div>
                        </div>
                        <button className="text-indigo-600 hover:text-indigo-800">
                          <Download size={20} />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Calendar View */}
            {projectTab === 'calendar' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-6">Shared Calendar</h3>
                <div className="space-y-4">
                  {data.events
                    .filter(e => e.projectId === selectedProject.id)
                    .map(event => (
                      <div key={event.id} className="p-4 border-l-4 border-indigo-600 bg-indigo-50 rounded">
                        <h4 className="font-semibold text-gray-800">{event.title}</h4>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <p>📅 {event.startDate}</p>
                          <p>🕒 {event.startTime} - {event.endTime}</p>
                          <p>📍 {event.location}</p>
                          <p className="text-xs text-gray-500 mt-2">Created by {event.createdBy}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}