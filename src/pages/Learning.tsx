import { useState, useEffect } from 'react';
import lessonsData from '../data/lessons.json';
import { Clock, CheckCircle, Check, PlayCircle } from 'lucide-react';
import { getProgress, markLessonComplete } from '../utils/storage';
import './Learning.css';

export default function Learning() {
    const [activeLesson, setActiveLesson] = useState<number | null>(null);
    const [completedLessons, setCompletedLessons] = useState<number[]>([]);

    useEffect(() => {
        setCompletedLessons(getProgress().completedLessons);
    }, []);

    const toggleLesson = (id: number) => {
        // Only toggle if closing, or opening a different one.
        // If opening, we just expand content which is the "Start".
        setActiveLesson(activeLesson === id ? null : id);
    };

    const handleStart = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        setActiveLesson(id);
    };

    const handleFinish = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        markLessonComplete(id);
        setCompletedLessons([...completedLessons, id]);
        // Optional: Close lesson or keep open? Let's keep open to show success state.
    };

    return (
        <div className="learning-container">
            <header className="page-header">
                <h1>Learning Modules</h1>
                <p>Master the rules of the road one lesson at a time.</p>
            </header>

            <div className="lessons-list">
                {lessonsData.map((lesson) => {
                    const isCompleted = completedLessons.includes(lesson.id);
                    const isActive = activeLesson === lesson.id;

                    return (
                        <div
                            key={lesson.id}
                            className={`lesson-card ${isActive ? 'active' : ''}`}
                            onClick={() => toggleLesson(lesson.id)}
                        >
                            <div className="lesson-header">
                                <div className="lesson-icon-wrapper">
                                    <span className="lesson-category">{lesson.category}</span>
                                </div>
                                <div className="lesson-meta">
                                    <span className="duration"><Clock size={14} /> {lesson.duration}</span>
                                </div>
                            </div>

                            <h3 className="lesson-title">{lesson.title}</h3>

                            <div className="lesson-content">
                                <p>{lesson.description}</p>

                                {!isActive && !isCompleted && (
                                    <button className="btn btn-primary start-btn" onClick={(e) => handleStart(e, lesson.id)} style={{ marginTop: '1rem' }}>
                                        <PlayCircle size={18} /> Start Lesson
                                    </button>
                                )}

                                {isActive && (
                                    <div className="lesson-details">
                                        <hr />
                                        <div className="lesson-body-content">
                                            <h4>Full Lesson Content</h4>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

                                            <p><strong>Key Takeaways:</strong></p>
                                            <ul>
                                                <li>Always obey regulatory signs.</li>
                                                <li>Come to a complete stop at Stop signs.</li>
                                                <li>Yield to pedestrians in crosswalks.</li>
                                            </ul>
                                        </div>

                                        <div className="lesson-actions">
                                            {isCompleted ? (
                                                <button className="btn btn-secondary start-btn" disabled>
                                                    <Check size={18} /> Completed
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-primary start-btn"
                                                    onClick={(e) => handleFinish(e, lesson.id)}
                                                >
                                                    Finish & Mark Complete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="lesson-status">
                                {isCompleted ? <CheckCircle size={20} color="var(--color-success)" /> : <div className="circle-placeholder"></div>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
