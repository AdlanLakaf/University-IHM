import { useNavigate } from 'react-router-dom';
import { PlayCircle, BookOpen, Award, TrendingUp } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
    const navigate = useNavigate();

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
                            <div className="progress-bar" style={{ width: '65%' }}></div>
                        </div>
                        <span className="stat-value">65%</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon score">
                        <Award size={24} color="white" />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Average Score</span>
                        <span className="stat-value">82%</span>
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
        </div>
    );
}
