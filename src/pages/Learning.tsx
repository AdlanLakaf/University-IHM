import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import lessonsData from '../data/lessons.json';
import { Clock, CheckCircle, PlayCircle } from 'lucide-react';
import { getProgress } from '../utils/storage';
import './Learning.css';

export default function Learning() {
    const navigate = useNavigate();
    const [completedLessons, setCompletedLessons] = useState<number[]>([]);

    useEffect(() => {
        setCompletedLessons(getProgress().completedLessons);
    }, []);

    return (
        <div className="learning-container">
            <header className="page-header">
                <h1>Learning Modules</h1>
                <p>Master the rules of the road one lesson at a time.</p>
            </header>

            <div className="lessons-list">
                {lessonsData.map((lesson) => {
                    const isCompleted = completedLessons.includes(lesson.id);

                    return (
                        <div
                            key={lesson.id}
                            className={`lesson-card ${isCompleted ? 'completed-card' : ''}`}
                            onClick={() => navigate(`/learn/${lesson.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="lesson-header">
                                <div className="lesson-icon-wrapper">
                                    <span className="lesson-category">{lesson.category}</span>
                                </div>
                                <div className="lesson-meta">
                                    <span className="duration"><Clock size={14} /> {lesson.duration}</span>
                                </div>
                            </div>

                            <h3 className="lesson-title" style={{ fontSize: '1.25rem' }}>{lesson.title}</h3>
                            <p className="lesson-description">{lesson.description}</p>

                            <div className="lesson-footer-row">
                                {isCompleted ? (
                                    <span className="status-badge completed">
                                        <CheckCircle size={16} /> Completed
                                    </span>
                                ) : (
                                    <span className="status-badge start">
                                        <PlayCircle size={16} /> Start Lesson
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
