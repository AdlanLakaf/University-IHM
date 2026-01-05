const STORAGE_KEY = 'driveSafe_progress';

export interface QuizResult {
    date: string;
    score: number;
    total: number;
    passed: boolean;
}

export interface UserProgress {
    completedLessons: number[]; // Array of lesson IDs
    quizScores: QuizResult[];
}

const defaultProgress: UserProgress = {
    completedLessons: [],
    quizScores: []
};

export const getProgress = (): UserProgress => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultProgress;
    try {
        return JSON.parse(stored);
    } catch (e) {
        console.error("Failed to parse progress", e);
        return defaultProgress;
    }
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
