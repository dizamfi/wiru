// src/hooks/useProfile.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { User, PersonProfile, CompanyProfile } from '@/types/user';

interface ProfileState {
  loading: boolean;
  error: string | null;
  updateInProgress: boolean;
}

interface ProfileActions {
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  updateAvatar: (avatarFile: File) => Promise<string>;
  verifyEmail: () => Promise<void>;
  verifyPhone: (phone: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const useProfileStore = create<ProfileState & ProfileActions>()(
  devtools((set, get) => ({
    loading: false,
    error: null,
    updateInProgress: false,

    updateProfile: async (profileData) => {
      set({ updateInProgress: true, error: null });
      try {
        // Simular API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Aquí iría la llamada real a la API
        console.log('Updating profile with:', profileData);
        
        set({ updateInProgress: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Error al actualizar perfil',
          updateInProgress: false
        });
        throw error;
      }
    },

    updateAvatar: async (avatarFile) => {
      set({ loading: true, error: null });
      try {
        // Simular upload de imagen
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simular URL de imagen subida
        const avatarUrl = URL.createObjectURL(avatarFile);
        
        set({ loading: false });
        return avatarUrl;
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Error al subir avatar',
          loading: false
        });
        throw error;
      }
    },

    verifyEmail: async () => {
      set({ loading: true, error: null });
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simular envío de email de verificación
        console.log('Verification email sent');
        
        set({ loading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Error al enviar verificación',
          loading: false
        });
        throw error;
      }
    },

    verifyPhone: async (phone) => {
      set({ loading: true, error: null });
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simular envío de SMS de verificación
        console.log('SMS verification sent to:', phone);
        
        set({ loading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Error al enviar SMS',
          loading: false
        });
        throw error;
      }
    },

    updatePassword: async (currentPassword, newPassword) => {
      set({ loading: true, error: null });
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simular cambio de contraseña
        if (currentPassword !== 'current123') {
          throw new Error('Contraseña actual incorrecta');
        }
        
        console.log('Password updated successfully');
        
        set({ loading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Error al cambiar contraseña',
          loading: false
        });
        throw error;
      }
    }
  }))
);

export const useProfile = () => {
  const store = useProfileStore();

  return {
    loading: store.loading,
    error: store.error,
    updateInProgress: store.updateInProgress,
    updateProfile: store.updateProfile,
    updateAvatar: store.updateAvatar,
    verifyEmail: store.verifyEmail,
    verifyPhone: store.verifyPhone,
    updatePassword: store.updatePassword
  };
};