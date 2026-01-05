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

    // Quiz State
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
    const [quizStatus, setQuizStatus] = useState<'idle' | 'failed' | 'success'>('idle');

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

    const handleOptionSelect = (questionId: number, optionIndex: number) => {
        setQuizAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
        setQuizStatus('idle'); // Reset status on change
    };

    const handleQuizSubmit = () => {
        if (!lesson || !lesson.quiz) return;

        let allCorrect = true;
        for (const q of lesson.quiz) {
            if (quizAnswers[q.id] !== q.correctAnswer) {
                allCorrect = false;
                break;
            }
        }

        if (allCorrect) {
            setQuizStatus('success');
            markLessonComplete(lesson.id);
            setIsCompleted(true);
        } else {
            setQuizStatus('failed');
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
                    <div className="lesson-quiz-section">
                        <h3 className="quiz-section-title">Quick Quiz</h3>
                        <p className="quiz-section-desc">Answer correctly to complete the lesson.</p>

                        <div className="quiz-questions">
                            {lesson.quiz && lesson.quiz.map((q: any) => (
                                <div key={q.id} className="quiz-question-card">
                                    <p className="question-text">{q.question}</p>
                                    <div className="options-grid">
                                        {q.options.map((opt: string, idx: number) => (
                                            <label key={idx} className={`option-label ${quizAnswers[q.id] === idx ? 'selected' : ''}`}>
                                                <input
                                                    type="radio"
                                                    name={`question-${q.id}`}
                                                    value={idx}
                                                    checked={quizAnswers[q.id] === idx}
                                                    onChange={() => handleOptionSelect(q.id, idx)}
                                                />
                                                {opt}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {quizStatus === 'failed' && (
                            <div className="quiz-alert error">
                                <AlertTriangle size={18} />
                                <span>Incorrect. Please try again. you must get all answers correct.</span>
                            </div>
                        )}

                        <button
                            className="btn btn-primary btn-large"
                            onClick={handleQuizSubmit}
                            disabled={!lesson.quiz || Object.keys(quizAnswers).length < lesson.quiz.length}
                        >
                            Check Answers
                        </button>
                    </div>
                ) : (
                    <div className="lesson-completed-message">
                        <div className="success-icon-large">
                            <CheckCircle size={48} />
                        </div>
                        <h3>Lesson Completed!</h3>
                        <p>Great job! You've mastered this topic.</p>
                        <button className="btn btn-outline" onClick={() => navigate('/learn')}>
                            Back to Lessons
                        </button>
                    </div>
                )}
            </footer>
        </div>
    );
}
