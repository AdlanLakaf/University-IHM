const STORAGE_KEY = 'driveSafe_progress';

export interface QuizResult {
    date: string;
    score: number;
    total: number;
    passed: boolean;
}

export interface UserProgress {
    completedLessons: number[];
    quizScores: {
        quizId?: number; // Optional if generic
        score: number;
        total: number;
        date: string;
    }[];
    hasLicense?: boolean;
}

const defaultProgress: UserProgress = {
    completedLessons: [],
    quizScores: [],
    hasLicense: false
};

export const getProgress = (): UserProgress => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error("Failed to parse progress", e);
            return defaultProgress;
        }
    }
    return { completedLessons: [], quizScores: [], hasLicense: false };
};

export const saveProgress = (progress: UserProgress) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

export const markLessonComplete = (lessonId: number) => {
    const progress = getProgress();
    if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
        saveProgress(progress);
    }
};

export const saveQuizResult = (result: QuizResult) => {
    const progress = getProgress();
    progress.quizScores.push(result);
    saveProgress(progress);
};

export const issueLicense = () => {
    const progress = getProgress();
    progress.hasLicense = true;
    saveProgress(progress);
};
