import React, { useState } from 'react';
import type { Task, CalendarEvent } from '../types/Task';
import Icon from './Icon';

interface CalendarViewProps {
    tasks: Task[];
    onTaskClick: (task: Task) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onTaskClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const months = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];

    const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const getTasksForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return tasks.filter(task => {
            const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
            return taskDate === dateStr;
        });
    };

    const getPriorityColor = (priority: Task['priority']) => {
        switch (priority) {
            case 'urgent': return '#ff4757';
            case 'high': return '#ff6b6b';
            case 'medium': return '#ffa726';
            case 'low': return '#66bb6a';
            default: return '#90a4ae';
        }
    };

    const getStatusColor = (status: Task['status']) => {
        switch (status) {
            case 'completed': return '#4caf50';
            case 'in-progress': return '#2196f3';
            case 'pending': return '#ff9800';
            default: return '#9e9e9e';
        }
    };

    const getCategoryIcon = (category: Task['category']) => {
        switch (category) {
            case 'study': return 'BOOK';
            case 'work': return 'WORK';
            case 'personal': return 'USER';
            case 'project': return 'PROJECT';
            case 'exam': return 'EXAM';
            default: return 'CLIPBOARD';
        }
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            if (direction === 'prev') {
                newDate.setMonth(newDate.getMonth() - 1);
            } else {
                newDate.setMonth(newDate.getMonth() + 1);
            }
            return newDate;
        });
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isSelected = (date: Date) => {
        return selectedDate && date.toDateString() === selectedDate.toDateString();
    };

    const renderMonthView = () => {
        const days = getDaysInMonth(currentDate);

        return (
            <div className="calendar-grid">
                {daysOfWeek.map(day => (
                    <div key={day} className="calendar-header">{day}</div>
                ))}

                {days.map((day, index) => {
                    if (!day) {
                        return <div key={index} className="calendar-day empty"></div>;
                    }

                    const dayTasks = getTasksForDate(day);
                    const isCurrentDay = isToday(day);
                    const isSelectedDay = isSelected(day);

                    return (
                        <div
                            key={index}
                            className={`calendar-day ${isCurrentDay ? 'today' : ''} ${isSelectedDay ? 'selected' : ''}`}
                            onClick={() => setSelectedDate(day)}
                        >
                            <div className="day-number">{day.getDate()}</div>
                            <div className="day-tasks">
                                {dayTasks.slice(0, 3).map(task => (
                                    <div
                                        key={task.id}
                                        className="task-indicator"
                                        style={{
                                            backgroundColor: getPriorityColor(task.priority),
                                            borderLeft: `3px solid ${getStatusColor(task.status)}`
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onTaskClick(task);
                                        }}
                                        title={task.title}
                                    >
                                        {task.title.length > 15 ? task.title.substring(0, 15) + '...' : task.title}
                                    </div>
                                ))}
                                {dayTasks.length > 3 && (
                                    <div className="more-tasks">+{dayTasks.length - 3} more</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

    return (
        <div className="calendar-view">
            <div className="calendar-header">
                <div className="calendar-controls">
                    <button onClick={() => navigateMonth('prev')}>‹</button>
                    <h2>
                        {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <button onClick={() => navigateMonth('next')}>›</button>
                </div>
            </div>

            <div className="calendar-content">
                {renderMonthView()}
            </div>

            {selectedDate && (
                <div className="selected-date-info">
                    <h3>
                        {selectedDate.toLocaleDateString('vi-VN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </h3>

                    <div className="selected-date-tasks">
                        {selectedDateTasks.length === 0 ? (
                            <p>Không có task nào trong ngày này.</p>
                        ) : (
                            selectedDateTasks.map(task => (
                                <div
                                    key={task.id}
                                    className="task-item"
                                    onClick={() => onTaskClick(task)}
                                >
                                    <div className="task-item-header">
                                        <div className="task-title">
                                            <Icon name={getCategoryIcon(task.category)} size={24} />
                                            <h3>{task.title}</h3>
                                            <span
                                                className="priority-badge"
                                                style={{ backgroundColor: getPriorityColor(task.priority) }}
                                            >
                                                {task.priority.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    {task.description && (
                                        <p className="task-description">{task.description}</p>
                                    )}

                                    <div className="task-meta">
                                        <div className="task-info">
                                            <span className="due-date">
                                                <Icon name="CALENDAR" size={16} />
                                                &nbsp; {new Date(task.dueDate).toLocaleDateString('vi-VN')}
                                            </span>
                                            <span className="estimated-time">
                                                <Icon name="CLOCK" size={16} />
                                                &nbsp; {task.estimatedTime} phút
                                            </span>
                                        </div>

                                        <div className="task-status">
                                            <span
                                                className="status-badge"
                                                style={{
                                                    backgroundColor: getStatusColor(task.status),
                                                    color: 'white',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                {task.status === 'pending' ? 'Chờ thực hiện' :
                                                    task.status === 'in-progress' ? 'Đang thực hiện' :
                                                        'Hoàn thành'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarView;
