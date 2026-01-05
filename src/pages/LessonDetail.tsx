import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import lessonsData from '../data/lessons.json';
import { markLessonComplete, getProgress } from '../utils/storage';
import './LessonDetail.css';

export default function LessonDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState<any>(null);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        if (id) {
            const foundLesson = lessonsData.find(l => l.id === parseInt(id));
            if (foundLesson) {
                setLesson(foundLesson);
                const progress = getProgress();
                if (progress.completedLessons.includes(parseInt(id))) {
                    setIsCompleted(true);
                }
            } else {
                navigate('/learn'); // Fallback if not found
            }
        }
    }, [id, navigate]);

    const handleComplete = () => {
        if (lesson) {
            markLessonComplete(lesson.id);
            setIsCompleted(true);
            // Optional: Navigate back after a delay or show a success modal?
            // For now, let's just show state change and allow manual back navigation.
        }
    };

    if (!lesson) return <div>Loading...</div>;

    return (
        <div className="lesson-detail-container">
            <button className="back-btn" onClick={() => navigate('/learn')}>
                <ArrowLeft size={20} /> Back to Lessons
            </button>

            <header className="lesson-hero">
                <div className="hero-content">
                    <span className="lesson-category-badge">{lesson.category}</span>
                    <h1 className="lesson-title">{lesson.title}</h1>
                    <div className="lesson-meta">
                        <span className="meta-item"><Clock size={16} /> {lesson.duration}</span>
                        {isCompleted && <span className="meta-item completed-badge"><CheckCircle size={16} /> Completed</span>}
                    </div>
                </div>
            </header>

            <main className="lesson-body">
                {lesson.fullContent && lesson.fullContent.map((block: any, index: number) => {
                    switch (block.type) {
                        case 'paragraph':
                            return <p key={index} className="lesson-text">{block.content}</p>;
                        case 'heading':
                            return <h2 key={index} className="lesson-heading">{block.content}</h2>;
                        case 'list':
                            return (
                                <ul key={index} className="lesson-list">
                                    {block.content.map((item: string, i: number) => <li key={i}>{item}</li>)}
                                </ul>
                            );
                        case 'image':
                            return (
                                <figure key={index} className="lesson-image">
                                    <img src={block.src} alt={block.caption} />
                                    <figcaption>{block.caption}</figcaption>
                                </figure>
                            );
                        case 'alert':
                            return (
                                <div key={index} className="lesson-alert">
                                    <AlertTriangle size={24} />
                                    <p>{block.content}</p>
                                </div>
                            );
                        default:
                            return null;
                    }
                })}
            </main>

            <footer className="lesson-footer">
                {!isCompleted ? (
                    <button className="btn btn-primary btn-large" onClick={handleComplete}>
                        Mark as Complete
                    </button>
                ) : (
                    <button className="btn btn-secondary btn-large" disabled>
                        Lesson Completed
                    </button>
                )}
            </footer>
        </div>
    );
}
