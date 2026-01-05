import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import questionsData from '../data/questions.json';
import { ArrowRight, RotateCcw, Home, Check, X } from 'lucide-react';
import { saveQuizResult } from '../utils/storage';
import './Quiz.css';

export default function Quiz() {
    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const currentQuestion = questionsData[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / questionsData.length) * 100;

    const handleOptionClick = (option: string) => {
        if (isAnswered) return;
        setSelectedOption(option);
        setIsAnswered(true);

        if (option === currentQuestion.answer) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questionsData.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = () => {
        // Determine the score. The state 'score' holds correct answers BEFORE the current one if we are just clicking.
        // However, handleNext is called AFTER handleOptionClick.
        // So 'score' state already has the correct value for the current answer if it was correct.
        // Wait, useState updates are async. 
        // BUT, handleNext is called via button click, which happens strictly after option click and re-render.
        // So 'score' is up to date with the latest answer.

        setIsFinished(true);

        saveQuizResult({
            date: new Date().toISOString(),
            score: score,
            total: questionsData.length,
            passed: (score / questionsData.length) >= 0.8
        });
    };

    const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setIsFinished(false);
    };

    if (isFinished) {
        const percentage = Math.round((score / questionsData.length) * 100);
        const passed = percentage >= 80;

        return (
            <div className="quiz-container results-view">
                <div className="result-card">
                    <div className={`result-icon ${passed ? 'passed' : 'failed'}`}>
                        {passed ? '🎉' : '📚'}
                    </div>
                    <h2>{passed ? 'Congratulations!' : 'Keep Practicing'}</h2>
                    <p>You scored {score} out of {questionsData.length}</p>
                    <div className="score-circle">
                        <span className="score-value">{percentage}%</span>
                    </div>
                    <div className="result-actions">
                        <button className="btn btn-primary" onClick={restartQuiz}>
                            <RotateCcw size={18} /> Retry Quiz
                        </button>
                        <button className="btn btn-secondary" onClick={() => navigate('/')}>
                            <Home size={18} /> Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="quiz-container">
            <div className="quiz-header">
                <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="question-counter">Question {currentQuestionIndex + 1} / {questionsData.length}</span>
            </div>

            <div className="question-card">
                {currentQuestion.image && (
                    <div className="question-image-container">
                        <img
                            src={currentQuestion.image}
                            alt="Question illustration"
                            className="question-image"
                        />
                        {currentQuestion.id === 1 && (
                            <div className="blur-overlay"></div>
                        )}
                    </div>
                )}
                <h2 className="question-text">{currentQuestion.question}</h2>

                <div className="options-list">
                    {currentQuestion.options.map((option, index) => {
                        let optionClass = "option-btn";
                        if (isAnswered) {
                            if (option === currentQuestion.answer) {
                                optionClass += " correct";
                            } else if (option === selectedOption) {
                                optionClass += " wrong";
                            }
                        } else if (selectedOption === option) {
                            optionClass += " selected";
                        }

                        return (
                            <button
                                key={index}
                                className={optionClass}
                                onClick={() => handleOptionClick(option)}
                                disabled={isAnswered}
                            >
                                {option}
                                {isAnswered && option === currentQuestion.answer && <Check size={20} />}
                                {isAnswered && option === selectedOption && option !== currentQuestion.answer && <X size={20} />}
                            </button>
                        );
                    })}
                </div>

                {isAnswered && (
                    <div className="quiz-footer">
                        <div className="feedback-text">
                            {selectedOption === currentQuestion.answer
                                ? <span className="text-success">Correct! Great job.</span>
                                : <span className="text-error">Incorrect. The answer is {currentQuestion.answer}.</span>}
                        </div>
                        <button className="btn btn-primary" onClick={handleNext}>
                            {currentQuestionIndex === questionsData.length - 1 ? "Finish" : "Next Question"} <ArrowRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
