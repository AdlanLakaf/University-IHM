import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, BrainCircuit, Trophy } from 'lucide-react';
import './MainLayout.css';

export default function MainLayout() {
    return (
        <div className="app-container">
            <nav className="sidebar">
                <div className="logo-container">
                    <div className="logo-icon">
                        <Trophy size={28} color="white" />
                    </div>
                    <h1 className="logo-text">DriveSafe</h1>
                </div>

                <ul className="nav-links">
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                        >
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/learn"
                            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                        >
                            <BookOpen size={20} />
                            <span>Learn</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/quiz"
                            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                        >
                            <BrainCircuit size={20} />
                            <span>Quiz</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
