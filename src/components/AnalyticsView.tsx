import React, { useState, useEffect } from 'react';
import type { Task, TaskStats } from '../types/Task';
import Icon from "./Icon.tsx";

interface AnalyticsViewProps {
    tasks: Task[];
}
const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tasks }) => {
    const [stats, setStats] = useState<TaskStats>({
        totalTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
        averageCompletionTime: 0,
        procrastinationTrend: 0,
        productivityScore: 0
    });

    useEffect(() => {
        calculateStats();
    }, [tasks]);

    const calculateStats = () => {
        const now = new Date();
        const filteredTasks = tasks;
        const totalTasks = filteredTasks.length;
        const completedTasks = filteredTasks.filter(task => task.status === 'completed').length;
        const overdueTasks = filteredTasks.filter(task => {
            const dueDate = new Date(task.dueDate);
            return dueDate < now && task.status !== 'completed';
        }).length;
        const completedWithTime = filteredTasks.filter(task =>
            task.status === 'completed' && task.actualTime
        );
        const averageCompletionTime = completedWithTime.length > 0
            ? completedWithTime.reduce((sum, task) => sum + (task.actualTime || 0), 0) / completedWithTime.length
            : 0;

        const recentTasks = filteredTasks.filter(task => {
            const createdDate = new Date(task.createdAt);
            const daysSinceCreated = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
            return daysSinceCreated <= 7;
        });

        const procrastinationTrend = recentTasks.length > 0
            ? recentTasks.reduce((sum, task) => {
                const dueDate = new Date(task.dueDate);
                const createdDate = new Date(task.createdAt);
                const timeDiff = (dueDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
                return sum + (timeDiff < 1 ? 1 : 0);
            }, 0) / recentTasks.length
            : 0;

        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        const onTimeRate = totalTasks > 0 ? ((totalTasks - overdueTasks) / totalTasks) * 100 : 0;
        const productivityScore = (completionRate + onTimeRate) / 2;

        setStats({
            totalTasks,
            completedTasks,
            overdueTasks,
            averageCompletionTime: Math.round(averageCompletionTime),
            procrastinationTrend,
            productivityScore: Math.round(productivityScore)
        });
    };
    const getWeeklyProductivity = () => {
        const weeks = [];
        const now = new Date();

        for (let i = 6; i >= 0; i--) {
            const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
            const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);

            const weekTasks = tasks.filter(task => {
                const createdDate = new Date(task.createdAt);
                return createdDate >= weekStart && createdDate < weekEnd;
            });

            const completedTasks = weekTasks.filter(task => task.status === 'completed').length;
            const productivity = weekTasks.length > 0 ? (completedTasks / weekTasks.length) * 100 : 0;

            weeks.push({
                week: weekStart.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }),
                productivity: Math.round(productivity),
                tasks: weekTasks.length,
                completed: completedTasks
            });
        }

        return weeks;
    };

    const weeklyProductivity = getWeeklyProductivity();

    return (
        <div className="analytics-view">
            <div className="analytics-header">
                <h2>Phân tích năng suất</h2>
            </div>

            <div className="analytics-content">
                <div className="stats-overview">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <Icon name="TOTAL" size={55} />
                        </div>
                        <div className="stat-info">
                            <h3>{stats.totalTasks}</h3>
                            <p>Tổng số task</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <Icon name="COMPLETE" size={55} />
                        </div>
                        <div className="stat-info">
                            <h3>{stats.completedTasks}</h3>
                            <p>Task hoàn thành</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <Icon name="OVERDUE" size={55} />
                        </div>
                        <div className="stat-info">
                            <h3>{stats.overdueTasks}</h3>
                            <p>Task quá hạn</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <Icon name="AVERAGE" size={55} />
                        </div>
                        <div className="stat-info">
                            <h3>{stats.averageCompletionTime}</h3>
                            <p>Thời gian TB (phút)</p>
                        </div>
                    </div>
                </div>

                <div className="productivity-section">
                    <h3>Điểm năng suất</h3>
                    <div className="productivity-score">
                        <div className="score-circle">
                            <div className="score-value">{stats.productivityScore}</div>
                            <div className="score-label">/ 100</div>
                        </div>
                        <div className="score-description">
                            {stats.productivityScore >= 80 && "Xuất sắc! Bạn đang làm rất tốt!"}
                            {stats.productivityScore >= 60 && stats.productivityScore < 80 && "Tốt! Hãy tiếp tục phát huy!"}
                            {stats.productivityScore >= 40 && stats.productivityScore < 60 && "Cần cải thiện thêm!"}
                            {stats.productivityScore < 40 && "Hãy tập trung và cố gắng hơn!"}
                        </div>
                    </div>
                </div>

                {/* Weekly Productivity Chart */}
                <div className="chart-section">
                    <h3>Năng suất theo tuần</h3>
                    <div className="productivity-chart">
                        {weeklyProductivity.map((week, index) => (
                            <div key={index} className="chart-bar">
                                <div className="bar-container">
                                    <div
                                        className="bar-fill"
                                        style={{ height: `${week.productivity}%` }}
                                    />
                                </div>
                                <div className="bar-label">{week.week}</div>
                                <div className="bar-value">{week.productivity}%</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsView;
