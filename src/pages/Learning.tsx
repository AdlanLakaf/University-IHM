import { useState } from 'react';
import lessonsData from '../data/lessons.json';
import { Clock, CheckCircle } from 'lucide-react';
import './Learning.css';

export default function Learning() {
    const [activeLesson, setActiveLesson] = useState<number | null>(null);

    const toggleLesson = (id: number) => {
        setActiveLesson(activeLesson === id ? null : id);
    };

    return (
        <div className="learning-container">
            <header className="page-header">
                <h1>Learning Modules</h1>
                <p>Master the rules of the road one lesson at a time.</p>
            </header>

            <div className="lessons-list">
                {lessonsData.map((lesson) => (
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
                                    <button className="btn btn-primary start-btn">
                                        Start Lesson
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="lesson-status">
                            {/* Mock status */}
                            {lesson.id === 1 ? <CheckCircle size={20} color="var(--color-success)" /> : <div className="circle-placeholder"></div>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
