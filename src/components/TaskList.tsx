import React, { useState, useEffect } from 'react';
import type { Task } from '../types/Task';
import Icon from './Icon';

interface TaskListProps {
    tasks: Task[];
    onUpdateTask: (task: Task) => void;
    onDeleteTask: (id: string) => void;
    onEditTask: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdateTask, onDeleteTask, onEditTask }) => {
    const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
    const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt'>('dueDate');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredTasks = tasks
        .filter(task => {
            const matchesFilter = filter === 'all' || task.status === filter;
            const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'dueDate':
                    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                case 'priority':
                    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                case 'createdAt':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                default:
                    return 0;
            }
        });

    const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTasks = filteredTasks.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [filter, searchTerm, sortBy]);

    const getPriorityColor = (priority: Task['priority']) => {
        switch (priority) {
            case 'urgent': return '#ff4757';
            case 'high': return '#ff6b6b';
            case 'medium': return '#ffa726';
            case 'low': return '#66bb6a';
            default: return '#90a4ae';
        }
    };

    const getPrioritText = (priority: Task['priority']) => {
        switch (priority) {
            case 'urgent': return 'Khẩn cấp';
            case 'high': return 'Cao';
            case 'medium': return 'Trung bình';
            case 'low': return 'Thấp';
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

    const isOverdue = (dueDate: string) => {
        return new Date(dueDate) < new Date() && !tasks.find(t => t.id === tasks.find(task => task.dueDate === dueDate)?.id)?.status.includes('completed');
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = date.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return `Quá hạn ${Math.abs(diffDays)} ngày`;
        if (diffDays === 0) return 'Hôm nay';
        if (diffDays === 1) return 'Ngày mai';
        if (diffDays <= 7) return `${diffDays} ngày nữa`;
        return date.toLocaleDateString('vi-VN');
    };

    const handleStatusChange = (task: Task, newStatus: Task['status']) => {
        const updatedTask = {
            ...task,
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
            actualTime: newStatus === 'completed' ? task.estimatedTime : task.actualTime
        };
        onUpdateTask(updatedTask);
    };

    return (
        <div className="task-list">
            <div className="task-list-header">
                <h2>Danh sách Task ({filteredTasks.length})</h2>
                {totalPages > 1 && (
                    <div className="pagination-info">
                        Trang {currentPage} / {totalPages} ({startIndex + 1}-{Math.min(endIndex, filteredTasks.length)} / {filteredTasks.length})
                    </div>
                )}

                <div className="task-controls">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Tìm kiếm task..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filter-controls">
                        <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
                            <option value="all">Tất cả</option>
                            <option value="pending">Chờ thực hiện</option>
                            <option value="in-progress">Đang thực hiện</option>
                            <option value="completed">Hoàn thành</option>
                        </select>

                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                            <option value="dueDate">Sắp xếp theo hạn chót</option>
                            <option value="priority">Sắp xếp theo độ ưu tiên</option>
                            <option value="createdAt">Sắp xếp theo ngày tạo</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="task-items">
                {filteredTasks.length === 0 ? (
                    <div className="empty-state">
                        <p>Không có task nào phù hợp với bộ lọc hiện tại.</p>
                    </div>
                ) : (
                    currentTasks.map(task => (
                        <div
                            key={task.id}
                            className={`task-item ${isOverdue(task.dueDate) ? 'overdue' : ''}`}
                        >
                            <div className="task-item-header">
                                <div className="task-title">
                                    <Icon name={getCategoryIcon(task.category)} size={24} />
                                    <h3>{task.title}</h3>
                                    <span
                                        className="priority-badge"
                                        style={{ backgroundColor: getPriorityColor(task.priority) }}
                                    >
                                        {getPrioritText(task.priority)}
                                    </span>
                                </div>

                                <div className="task-actions">
                                    <button
                                        onClick={() => onEditTask(task)}
                                        className="btn-edit"
                                        title="Chỉnh sửa"
                                    >
                                        <Icon name="EDIT" size={24} />
                                    </button>
                                    <button
                                        onClick={() => onDeleteTask(task.id)}
                                        className="btn-delete"
                                        title="Xóa"
                                    >
                                        <Icon name="DELETE" size={24} />
                                    </button>
                                </div>
                            </div>

                            {task.description && (
                                <p className="task-description">{task.description}</p>
                            )}

                            <div className="task-meta">
                                <div className="task-info">
                                    <span className="due-date">
                                        <Icon name="CALENDAR" size={16} />
                                        &nbsp; {formatDate(task.dueDate)}
                                    </span>
                                    <span className="estimated-time">
                                        <Icon name="CLOCK" size={16} />
                                        &nbsp; {task.estimatedTime} phút
                                    </span>
                                </div>

                                <div className="task-status">
                                    <select
                                        value={task.status}
                                        onChange={(e) => handleStatusChange(task, e.target.value as Task['status'])}
                                        style={{
                                            backgroundColor: getStatusColor(task.status),
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '4px 8px'
                                        }}
                                    >
                                        <option value="pending">Chờ thực hiện</option>
                                        <option value="in-progress">Đang thực hiện</option>
                                        <option value="completed">Hoàn thành</option>
                                    </select>
                                </div>
                            </div>

                            {task.procrastinationScore && (
                                <div className="procrastination-indicator">
                                    <span>Độ trì hoãn: {task.procrastinationScore}%</span>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${task.procrastinationScore}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="pagination-controls">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="pagination-btn"
                    >
                        <Icon name="CALENDAR" size={16} />
                        Trước
                    </button>

                    <div className="pagination-numbers">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="pagination-btn"
                    >
                        Sau
                        <Icon name="CALENDAR" size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskList;
