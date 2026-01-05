import { useState, useEffect } from 'react';
import lessonsData from '../data/lessons.json';
import { Clock, CheckCircle, Check } from 'lucide-react';
import { getProgress, markLessonComplete } from '../utils/storage';
import './Learning.css';

export default function Learning() {
    const [activeLesson, setActiveLesson] = useState<number | null>(null);
    const [completedLessons, setCompletedLessons] = useState<number[]>([]);

    useEffect(() => {
        setCompletedLessons(getProgress().completedLessons);
    }, []);

    const toggleLesson = (id: number) => {
        setActiveLesson(activeLesson === id ? null : id);
    };

    const handleComplete = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        markLessonComplete(id);
        setCompletedLessons([...completedLessons, id]);
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
                    return (
                        <div
                            key={lesson.id}
                            className={`lesson-card ${activeLesson === lesson.id ? 'active' : ''}`}
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
                                {activeLesson === lesson.id && (
                                    <div className="lesson-details">
                                        <hr />
                                        <p><strong>Key Takeaways:</strong></p>
                                        <ul>
                                            <li>Always obey regulatory signs.</li>
                                            <li>Come to a complete stop at Stop signs.</li>
                                            <li>Yield to pedestrians in crosswalks.</li>
                                        </ul>
                                        <button
                                            className={`btn ${isCompleted ? 'btn-secondary' : 'btn-primary'} start-btn`}
                                            onClick={(e) => handleComplete(e, lesson.id)}
                                            disabled={isCompleted}
                                        >
                                            {isCompleted ? <><Check size={18} /> Completed</> : "Mark as Completed"}
                                        </button>
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
