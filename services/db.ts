import { supabase, isSupabaseConfigured } from './supabase';
import { storageService } from './storage';
import { Quiz, QuizResponse, User } from '../types';

export const dbService = {
  // ==========================================
  // AUTHENTICATION
  // ==========================================
  async signUp(email: string, name: string, password: string): Promise<User> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`
          }
        }
      });
      if (error) throw new Error(error.message);
      if (!data.user) throw new Error("Signup failed. Please try again.");
      
      const user: User = {
        id: data.user.id,
        email: data.user.email || email,
        name,
        avatar: data.user.user_metadata?.avatar_url
      };
      
      storageService.setCurrentUser(user);
      return user;
    } else {
      const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`
      };
      const success = storageService.registerUser(user, password);
      if (!success) throw new Error("An account with this email already exists.");
      storageService.setCurrentUser(user);
      return user;
    }
  },

  async signIn(email: string, password: string): Promise<User> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw new Error(error.message);
      if (!data.user) throw new Error("Invalid credentials.");

      // Fetch public profile metadata
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const user: User = {
        id: data.user.id,
        email: data.user.email || email,
        name: profile?.name || data.user.user_metadata?.name || 'Educator',
        avatar: profile?.avatar_url || data.user.user_metadata?.avatar_url
      };
      
      storageService.setCurrentUser(user);
      return user;
    } else {
      const user = storageService.validateUser(email, password);
      if (!user) throw new Error("Invalid email or password.");
      storageService.setCurrentUser(user);
      return user;
    }
  },

  async signOut(): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    storageService.setCurrentUser(null);
  },

  async updateProfile(user: User): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: user.name,
          email: user.email,
          avatar_url: user.avatar
        })
        .eq('id', user.id);

      if (error) {
        throw new Error(`Failed to update profile in cloud: ${error.message}`);
      }
    }
    storageService.updateProfile(user);
  },

  // ==========================================
  // QUIZZES
  // ==========================================
  async getQuizzes(userId: string): Promise<Quiz[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('creator_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error("Supabase getQuizzes error:", error);
        return [];
      }

      return (data || []).map(q => ({
        id: q.id,
        title: q.title,
        description: q.description || '',
        creatorId: q.creator_id,
        createdAt: q.created_at,
        updatedAt: q.updated_at,
        questions: q.questions || [],
        themeColor: q.theme_color || '#6366f1',
        coverImage: q.cover_image || undefined,
        settings: q.settings || { isReleased: true, requireConfidence: true, shuffleQuestions: false }
      }));
    } else {
      return storageService.getQuizzes().filter(q => q.creatorId === userId);
    }
  },

  async saveQuiz(quiz: Quiz): Promise<void> {
    if (isSupabaseConfigured()) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be logged in to save assessments to the cloud.");
      }

      const dbQuiz = {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        creator_id: user.id, // Ensure we use the real authenticated UUID to satisfy RLS
        questions: quiz.questions,
        theme_color: quiz.themeColor,
        cover_image: quiz.coverImage || null,
        settings: quiz.settings,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('quizzes')
        .upsert(dbQuiz);

      if (error) {
        throw new Error(`Failed to save quiz in cloud: ${error.message}`);
      }
    } else {
      storageService.saveQuiz({ ...quiz, updatedAt: new Date().toISOString() });
    }
  },

  async deleteQuiz(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete quiz in cloud: ${error.message}`);
      }
    } else {
      storageService.deleteQuiz(id);
    }
  },

  async getQuizById(id: string): Promise<Quiz | undefined> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        // Fallback check in local storage if not found in cloud
        return storageService.getQuizById(id);
      }

      return {
        id: data.id,
        title: data.title,
        description: data.description || '',
        creatorId: data.creator_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        questions: data.questions || [],
        themeColor: data.theme_color || '#6366f1',
        coverImage: data.cover_image || undefined,
        settings: data.settings || { isReleased: true, requireConfidence: true, shuffleQuestions: false }
      };
    } else {
      return storageService.getQuizById(id);
    }
  },

  // ==========================================
  // RESPONSES / SUBMISSIONS
  // ==========================================
  async getResponsesForQuiz(quizId: string): Promise<QuizResponse[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('responses')
        .select('*')
        .eq('quiz_id', quizId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase getResponsesForQuiz error:", error);
        return [];
      }

      return (data || []).map(r => ({
        id: r.id,
        quizId: r.quiz_id,
        respondentName: r.respondent_name,
        startTime: r.start_time,
        endTime: r.end_time,
        entries: r.entries || [],
        totalScore: r.total_score
      }));
    } else {
      return storageService.getResponsesForQuiz(quizId);
    }
  },

  async saveResponse(response: QuizResponse): Promise<void> {
    if (isSupabaseConfigured()) {
      const dbResponse = {
        id: response.id,
        quiz_id: response.quizId,
        respondent_name: response.respondentName,
        start_time: response.startTime,
        end_time: response.endTime,
        entries: response.entries,
        total_score: response.totalScore
      };

      const { error } = await supabase
        .from('responses')
        .insert(dbResponse);

      if (error) {
        throw new Error(`Failed to submit response in cloud: ${error.message}`);
      }
      
      storageService.clearDraft(response.quizId);
    } else {
      storageService.saveResponse(response);
    }
  }
};
