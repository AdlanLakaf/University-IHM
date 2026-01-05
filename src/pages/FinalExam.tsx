import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import questionsData from '../data/questions.json';
import lessonsData from '../data/lessons.json';
import { AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { issueLicense } from '../utils/storage';
import DriverLicense from '../components/DriverLicense';
import './FinalExam.css';

interface Question {
    id: string; // Composite ID
    question: string;
    options: string[];
    answer: string; // We'll normalize this
    correctIndex?: number;
}

export default function FinalExam() {
    const navigate = useNavigate();
    const [started, setStarted] = useState(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, number>>({}); // qIndex -> optionIndex
    const [finished, setFinished] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        // Aggregate Questions
        const allQuestions: Question[] = [];

        // 1. General Questions
        questionsData.forEach(q => {
            allQuestions.push({
                id: `gen-${q.id}`,
                question: q.question,
                options: q.options,
                answer: q.answer
            });
        });

        // 2. Lesson Quizzes
        lessonsData.forEach(l => {
            if (l.quiz) {
                l.quiz.forEach(q => {
                    allQuestions.push({
                        id: `less-${l.id}-${q.id}`,
                        question: q.question,
                        options: q.options,
                        answer: q.options[q.correctAnswer], // Normalize to string for consistency or store index
                        correctIndex: q.correctAnswer
                    });
                });
            }
        });

        // Shuffle and pick 10
        const shuffled = allQuestions.sort(() => 0.5 - Math.random());
        setQuestions(shuffled.slice(0, 10));
    }, []);

    const handleAnswer = (optionIndex: number) => {
        setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionIndex }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            calculateScore();
        }
    };

    const calculateScore = () => {
        let correctCount = 0;
        questions.forEach((q, idx) => {
            const userAnsIdx = userAnswers[idx];
            if (userAnsIdx === undefined) return;

            // Check correctness
            // For lesson questions, we have correctIndex
            if (q.correctIndex !== undefined) {
                if (userAnsIdx === q.correctIndex) correctCount++;
            } else {
                // For general questions, we compare string
                if (q.options[userAnsIdx] === q.answer) correctCount++;
            }
        });

        const finalScore = Math.round((correctCount / questions.length) * 100);
        setScore(finalScore);
        if (finalScore >= 80) {
            issueLicense();
        }
        setFinished(true);
    };

    if (!started) {
        return (
            <div className="exam-intro-container">
                <div className="exam-card intro">
                    <h1>The Final Exam</h1>
                    <p>You have completed all the lessons. Now it's time to prove your knowledge.</p>

                    <div className="exam-rules">
                        <div className="rule-item">
                            <AlertCircle size={20} />
                            <span>10 Random Questions</span>
                        </div>
                        <div className="rule-item">
                            <AlertCircle size={20} />
                            <span>80% Score to Pass</span>
                        </div>
                        <div className="rule-item">
                            <AlertCircle size={20} />
                            <span>Earn your Helper Driver License</span>
                        </div>
                    </div>

                    <button className="btn btn-primary btn-large" onClick={() => setStarted(true)}>
                        Start Exam
                    </button>
                    <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={() => navigate('/learn')}>
                        Not Ready Yet
                    </button>
                </div>
            </div>
        );
    }

    if (finished) {
        const passed = score >= 80;
        return (
            <div className="exam-result-container">
                {passed ? (
                    <div className="result-content success">
                        <h2>Congratulations! 🎉</h2>
                        <p>You passed the exam with a score of {score}%.</p>
                        <p>Here is your official license:</p>

                        <DriverLicense />

                        <button className="btn btn-primary" onClick={() => navigate('/')}>
                            Back to Dashboard
                        </button>
                    </div>
                ) : (
                    <div className="result-content fail">
                        <h2>Exam Failed</h2>
                        <div className="score-circle">{score}%</div>
                        <p>You need 80% to pass. Don't worry, review the lessons and try again.</p>
                        <div className="action-buttons">
                            <button className="btn btn-primary" onClick={() => window.location.reload()}>
                                <RotateCcw size={18} /> Retry Exam
                            </button>
                            <button className="btn btn-outline" onClick={() => navigate('/learn')}>
                                Review Lessons
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return <div>Loading...</div>;

    return (
        <div className="exam-container">
            <div className="exam-header">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <div className="exam-progress-bar">
                    <div className="fill" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
                </div>
            </div>

            <div className="question-card">
                <h3>{currentQ.question}</h3>
                <div className="options-list">
                    {currentQ.options.map((opt, idx) => (
                        <div
                            key={idx}
                            className={`exam-option ${userAnswers[currentQuestionIndex] === idx ? 'selected' : ''}`}
                            onClick={() => handleAnswer(idx)}
                        >
                            <div className="option-circle"></div>
                            <span>{opt}</span>
                        </div>
                    ))}
                </div>
            </div>

            <button
                className="btn btn-primary next-btn"
                onClick={handleNext}
                disabled={userAnswers[currentQuestionIndex] === undefined}
            >
                {currentQuestionIndex === questions.length - 1 ? 'Finish Exam' : 'Next Question'} <ArrowRight size={20} />
            </button>
        </div>
    );
}
