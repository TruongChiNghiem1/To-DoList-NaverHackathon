import React, { useState, useEffect } from 'react';
import type { Task } from '../types/Task';

interface TaskFormProps {
    task?: Task;
    onSave: (task: Omit<Task, 'id' | 'createdAt'>) => void;
    onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium' as Task['priority'],
        category: 'study' as Task['category'],
        dueDate: new Date().toISOString().split('T')[0],
        estimatedTime: 60,
        status: 'pending' as Task['status']
    });

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description,
                priority: task.priority,
                category: task.category,
                dueDate: task.dueDate.split('T')[0],
                estimatedTime: task.estimatedTime,
                status: task.status
            });
        }
    }, [task]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert('Vui lòng nhập tiêu đề task!');
            return;
        }

        let dueDateISO: string;
        if (formData.dueDate) {
            const dueDate = new Date(formData.dueDate + 'T23:59:59');
            if (isNaN(dueDate.getTime())) {
                alert('Ngày hạn chót không hợp lệ!');
                return;
            }
            dueDateISO = dueDate.toISOString();
        } else {
            const defaultDate = new Date();
            defaultDate.setDate(defaultDate.getDate() + 7);
            dueDateISO = defaultDate.toISOString();
        }

        onSave({
            ...formData,
            dueDate: dueDateISO,
            actualTime: task?.actualTime
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'estimatedTime' ? parseInt(value) || 0 : value
        }));
    };

    return (
        <div className="task-form-overlay">
            <div className="task-form">
                <h2>{task ? 'Chỉnh sửa Task' : 'Thêm Task mới'}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Tiêu đề *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Nhập tiêu đề task..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Mô tả</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Mô tả chi tiết về task..."
                            rows={3}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="priority">Mức độ ưu tiên</label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option value="low">Thấp</option>
                                <option value="medium">Trung bình</option>
                                <option value="high">Cao</option>
                                <option value="urgent">Khẩn cấp</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">Danh mục</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="study">Học tập</option>
                                <option value="work">Công việc</option>
                                <option value="personal">Cá nhân</option>
                                <option value="project">Dự án</option>
                                <option value="exam">Thi cử</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="dueDate">Hạn chót</label>
                            <input
                                type="date"
                                id="dueDate"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="estimatedTime">Thời gian ước tính (phút)</label>
                            <input
                                type="number"
                                id="estimatedTime"
                                name="estimatedTime"
                                value={formData.estimatedTime}
                                onChange={handleChange}
                                min="1"
                                max="1440"
                            />
                        </div>
                    </div>

                    {task && (
                        <div className="form-group">
                            <label htmlFor="status">Trạng thái</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="pending">Chờ thực hiện</option>
                                <option value="in-progress">Đang thực hiện</option>
                                <option value="completed">Hoàn thành</option>
                            </select>
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="button" onClick={onCancel} className="btn-secondary">
                            Hủy
                        </button>
                        <button type="submit" className="btn-primary">
                            {task ? 'Cập nhật' : 'Thêm Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;
