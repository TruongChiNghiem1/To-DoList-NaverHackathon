import { useState, useEffect } from 'react';
import './App.css';
import type { Task } from './types/Task';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import CalendarView from './components/CalendarView';
import AnalyticsView from './components/AnalyticsView';
import Icon from './components/Icon';

type View = 'list' | 'calendar' | 'analytics';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentView, setCurrentView] = useState<View>('list');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  useEffect(() => {
    const savedTasks = localStorage.getItem('student-tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('student-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const handleAddTask = () => {
    setEditingTask(undefined);
    setShowTaskForm(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === editingTask.id
            ? { ...taskData, id: editingTask.id, createdAt: editingTask.createdAt }
            : task
        )
      );
    } else {
      const newTask: Task = {
        ...taskData,
        id: generateId(),
        createdAt: new Date().toISOString()
      };
      setTasks(prevTasks => [...prevTasks, newTask]);
    }
    setShowTaskForm(false);
    setEditingTask(undefined);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa task này?')) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    }
  };

  const handleCancelTaskForm = () => {
    setShowTaskForm(false);
    setEditingTask(undefined);
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const overdue = tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate < new Date() && task.status !== 'completed';
    }).length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;

    return { total, completed, overdue, inProgress };
  };

  const stats = getTaskStats();

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>
            <Icon name="APP_LOGO" alt="APP_LOGO" className="app-icon" size={32} />
            To-Do App For Student
          </h1>
          <p>Quản lý thời gian học tập hiệu quả</p>
        </div>

        <div className="center-logos">
          <Icon name="HACKATHON" alt="Hackathon Graphic" className="hackathon-icon" size={60} />
          <Icon name="NAVER_LOGO" alt="NAVER Logo" className="logo-icon" size={200} />
        </div>

        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Tổng</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.completed}</span>
            <span className="stat-label">Hoàn thành</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.inProgress}</span>
            <span className="stat-label">Đang làm</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.overdue}</span>
            <span className="stat-label">Quá hạn</span>
          </div>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-button ${currentView === 'list' ? 'active' : ''}`}
          onClick={() => setCurrentView('list')}
        >
          <Icon name="LIST" size={16} />
          Danh sách
        </button>
        <button
          className={`nav-button ${currentView === 'calendar' ? 'active' : ''}`}
          onClick={() => setCurrentView('calendar')}
        >
          <Icon name="CALENDAR" size={16} />
          Lịch
        </button>
        <button
          className={`nav-button ${currentView === 'analytics' ? 'active' : ''}`}
          onClick={() => setCurrentView('analytics')}
        >
          <Icon name="CHART" size={16} />
          Phân tích
        </button>

        <button className="add-task-button" onClick={handleAddTask}>
          <Icon name="PLUS" size={16} />
          Thêm Task
        </button>
      </nav>

      <main className="app-main">
        {currentView === 'list' && (
          <TaskList
            tasks={tasks}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
          />
        )}

        {currentView === 'calendar' && (
          <CalendarView
            tasks={tasks}
            onTaskClick={handleEditTask}
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsView tasks={tasks} />
        )}
      </main>

      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSave={handleSaveTask}
          onCancel={handleCancelTaskForm}
        />
      )}
    </div>
  );
}

export default App;