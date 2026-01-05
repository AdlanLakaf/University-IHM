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

    const allLessonsCompleted = lessonsData.every(l => completedLessons.includes(l.id));

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

                {/* Final Exam Card */}
                <div
                    className={`lesson-card exam-card ${!allLessonsCompleted ? 'locked' : ''}`}
                    onClick={() => allLessonsCompleted && navigate('/final-exam')}
                    style={{ cursor: allLessonsCompleted ? 'pointer' : 'not-allowed', marginTop: '1rem', borderTop: '4px solid var(--color-accent)' }}
                >
                    <div className="lesson-header">
                        <div className="lesson-icon-wrapper">
                            <span className="lesson-category" style={{ background: '#ffe5e0', color: '#E76F51' }}>FINAL CHALLENGE</span>
                        </div>
                    </div>

                    <h3 className="lesson-title" style={{ fontSize: '1.4rem', color: '#E76F51' }}>Final Driving Exam</h3>
                    <p className="lesson-description">
                        {allLessonsCompleted
                            ? "Proove your skills to earn your official Driver License!"
                            : "Complete all lessons to unlock the final exam."}
                    </p>

                    <div className="lesson-footer-row">
                        {allLessonsCompleted ? (
                            <span className="status-badge start" style={{ background: '#E76F51' }}>
                                <PlayCircle size={16} /> Start Final Exam
                            </span>
                        ) : (
                            <span className="status-badge locked" style={{ background: '#e9ecef', color: '#adb5bd' }}>
                                Locked 🔒
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
