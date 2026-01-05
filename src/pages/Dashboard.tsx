import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, BookOpen, Award, TrendingUp, Trash2 } from 'lucide-react';
import { getProgress, type UserProgress, saveProgress } from '../utils/storage';
import lessonsData from '../data/lessons.json';
import './Dashboard.css';

export default function Dashboard() {
    const navigate = useNavigate();
    const [progress, setProgress] = useState<UserProgress | null>(null);
    const [animatingProgress, setAnimatingProgress] = useState(0);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    useEffect(() => {
        const data = getProgress();
        setProgress(data);

        // Animate progress calc
        const completed = data.completedLessons.length;
        const total = lessonsData.length;
        const target = Math.round((completed / total) * 100);

        // Simple animation effect
        const timer = setTimeout(() => {
            setAnimatingProgress(target);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    const handleResetClick = () => {
        setShowResetConfirm(true);
    };

    const cancelReset = () => {
        setShowResetConfirm(false);
    };

    const confirmReset = () => {
        saveProgress({ completedLessons: [], quizScores: [] });
        setProgress({ completedLessons: [], quizScores: [] });
        setAnimatingProgress(0);
        setShowResetConfirm(false);
    };

    // If progress is null (initial load), count is 0.
    // We use animatingProgress for the bar width and text to allow "count up" feel.

    const quizScores = progress?.quizScores || [];
    const avgScore = quizScores.length > 0
        ? Math.round(quizScores.reduce((acc, curr) => acc + (curr.score / curr.total) * 100, 0) / quizScores.length)
        : 0;

    return (
        <div className="dashboard-container">
            {/* Welcome Section */}
            <header className="dashboard-header">
                <div>
                    <h1 className="welcome-title">Welcome back, Alex! 👋</h1>
                    <p className="welcome-subtitle">Ready to ace your driving test? Let's continue learning.</p>
                </div>
                <div className="date-badge">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
            </header>

            {/* Stats/Progress Grid */}
            <section className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon progress">
                        <TrendingUp size={24} color="white" />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Course Progress</span>
                        <div className="progress-bar-container">
                            <div className="progress-bar" style={{ width: `${animatingProgress}%` }}></div>
                        </div>
                        <span className="stat-value">{animatingProgress}%</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon score">
                        <Award size={24} color="white" />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Average Score</span>
                        <span className="stat-value">{avgScore}%</span>
                    </div>
                </div>
            </section>

            {/* Main Actions */}
            <h2 className="section-title">What would you like to do?</h2>
            <section className="actions-grid">
                <div className="action-card learn" onClick={() => navigate('/learn')}>
                    <div className="action-content">
                        <h3>Start Learning</h3>
                        <p>Master road signs, rules, and safety regulations.</p>
                        <span className="action-link">Continue Lesson <BookOpen size={16} /></span>
                    </div>
                    <BookOpen className="bg-icon" size={120} />
                </div>

                <div className="action-card quiz" onClick={() => navigate('/quiz')}>
                    <div className="action-content">
                        <h3>Take a Quiz</h3>
                        <p>Test your knowledge with interactive questions.</p>
                        <span className="action-link">Start Quiz <PlayCircle size={16} /></span>
                    </div>
                    <PlayCircle className="bg-icon" size={120} />
                </div>
            </section>

            {/* Recent Activity or Recommended */}
            <h2 className="section-title">Recommended for You</h2>
            <div className="card recommended-card">
                <div className="rec-icon">⚠️</div>
                <div className="rec-content">
                    <h4>Road Signs Masterclass</h4>
                    <p>You missed 3 questions about "Warning Signs" in your last quiz.</p>
                </div>
                <button className="btn btn-secondary" onClick={() => navigate('/learn')}>Review Now</button>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <button onClick={handleResetClick} style={{ background: 'transparent', border: '1px solid #ccc', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', color: '#666', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <Trash2 size={14} /> Reset Progress
                </button>
            </div>

            {/* Confirmation Modal */}
            {showResetConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Reset Progress?</h3>
                        <p>Are you sure you want to reset all your progress? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={cancelReset}>Cancel</button>
                            <button className="btn btn-primary" style={{ backgroundColor: 'var(--color-error)' }} onClick={confirmReset}>Yes, Reset</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
