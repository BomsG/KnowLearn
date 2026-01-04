
import { Quiz, QuizResponse, User } from '../types';

const STORAGE_KEYS = {
  QUIZZES: 'knowlearn_quizzes',
  RESPONSES: 'knowlearn_responses',
  USERS: 'knowlearn_users', 
  CURRENT_USER: 'knowlearn_current_user',
  DRAFTS: 'knowlearn_quiz_drafts'
};

interface StoredUser {
  user: User;
  password: string;
}

export const storageService = {
  // Users
  getStoredUsers: (): StoredUser[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'),
  
  registerUser: (user: User, password: string): boolean => {
    const users = storageService.getStoredUsers();
    if (users.some(u => u.user.email === user.email)) return false;
    users.push({ user, password });
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return true;
  },

  validateUser: (email: string, password: string): User | null => {
    const users = storageService.getStoredUsers();
    const found = users.find(u => u.user.email === email && u.password === password);
    return found ? found.user : null;
  },

  resetPassword: (email: string, newPassword: string): boolean => {
    const users = storageService.getStoredUsers();
    const index = users.findIndex(u => u.user.email === email);
    if (index === -1) return false;
    users[index].password = newPassword;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return true;
  },

  updateProfile: (updatedUser: User) => {
    const users = storageService.getStoredUsers();
    const index = users.findIndex(u => u.user.id === updatedUser.id);
    if (index > -1) {
      users[index].user = updatedUser;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
    storageService.setCurrentUser(updatedUser);
  },

  getCurrentUser: (): User | null => JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null'),
  setCurrentUser: (user: User | null) => localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user)),

  // Quizzes
  getQuizzes: (): Quiz[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZZES) || '[]'),
  saveQuiz: (quiz: Quiz) => {
    const quizzes = storageService.getQuizzes();
    const index = quizzes.findIndex(q => q.id === quiz.id);
    if (index > -1) {
      quizzes[index] = quiz;
    } else {
      quizzes.push(quiz);
    }
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
  },
  deleteQuiz: (id: string) => {
    const quizzes = storageService.getQuizzes().filter(q => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
  },
  getQuizById: (id: string): Quiz | undefined => storageService.getQuizzes().find(q => q.id === id),

  // Responses
  getResponses: (): QuizResponse[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.RESPONSES) || '[]'),
  saveResponse: (response: QuizResponse) => {
    const responses = storageService.getResponses();
    responses.push(response);
    localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(responses));
    // Clear draft on submission
    storageService.clearDraft(response.quizId);
  },
  getResponsesForQuiz: (quizId: string): QuizResponse[] => 
    storageService.getResponses().filter(r => r.quizId === quizId),

  // Drafts for Offline Resume
  saveDraft: (quizId: string, data: any) => {
    const drafts = JSON.parse(localStorage.getItem(STORAGE_KEYS.DRAFTS) || '{}');
    drafts[quizId] = { ...data, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));
  },
  getDraft: (quizId: string) => {
    const drafts = JSON.parse(localStorage.getItem(STORAGE_KEYS.DRAFTS) || '{}');
    return drafts[quizId];
  },
  clearDraft: (quizId: string) => {
    const drafts = JSON.parse(localStorage.getItem(STORAGE_KEYS.DRAFTS) || '{}');
    delete drafts[quizId];
    localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));
  }
};
