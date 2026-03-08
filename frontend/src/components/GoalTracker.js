import React from 'react';
import { Target } from 'lucide-react';
import './GoalTracker.css';

function GoalTracker({ goals }) {
    return (
        <div className="goal-tracker">
            <div className="goal-tracker-title">
                <span><Target size={20} style={{ verticalAlign: 'middle', marginRight: 6, color: '#a78bfa' }} /></span> Goal Progress
            </div>
            <div className="goal-list">
                {goals.map((goal, index) => {
                    const percent = Math.min(Math.round((goal.current / goal.target) * 100), 100);
                    return (
                        <div className="goal-item" key={index}>
                            <div className="goal-header">
                                <span className="goal-label">
                                    <span>{goal.icon}</span> {goal.label}
                                </span>
                                <span className="goal-progress-text">
                                    {goal.current} / {goal.target} {goal.unit}
                                </span>
                            </div>
                            <div className="goal-bar">
                                <div
                                    className={`goal-bar-fill goal-bar-fill--${goal.color || 'blue'}`}
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default GoalTracker;
