// // src/hooks/useProfile.ts
// import { useState, useEffect, useCallback } from 'react';
// import { profileService, UserProfile, ProfileData, EmailUpdateData } from '@/services/profileService';
// import { useAuth } from '@/hooks/useAuth';
// import { toast } from 'react-hot-toast';

// interface UseProfileReturn {
//   profile: UserProfile | null;
//   loading: boolean;
//   error: string | null;
//   refreshProfile: () => Promise<void>;
//   updateProfile: (data: ProfileData) => Promise<void>;
//   updateEmail: (data: EmailUpdateData) => Promise<void>;
//   uploadAvatar: (file: File) => Promise<void>;
//   isUpdating: boolean;
// }

// export const useProfile = (): UseProfileReturn => {
//   const { user, updateProfile: updateAuthProfile } = useAuth();
//   const [profile, setProfile] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isUpdating, setIsUpdating] = useState(false);

//   /**
//    * Cargar perfil desde el backend
//    */
//   const refreshProfile = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       console.log('🔄 Fetching profile...');
//       const data = await profileService.getProfile();
//       console.log('✅ Profile loaded:', data);
      
//       setProfile(data);
//     } catch (err: any) {
//       console.error('❌ Error loading profile:', err);
//       console.error('❌ Error response:', err.response);
      
//       let errorMessage = 'Error al cargar el perfil';
      
//       if (err.response) {
//         // El servidor respondió con un código de error
//         errorMessage = err.response.data?.message || err.response.statusText || errorMessage;
//       } else if (err.request) {
//         // La petición se hizo pero no hubo respuesta
//         errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
//       } else {
//         // Algo pasó al configurar la petición
//         errorMessage = err.message || errorMessage;
//       }
      
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   /**
//    * Cargar perfil al montar el componente
//    */
//   useEffect(() => {
//     if (user) {
//       refreshProfile();
//     }
//   }, [user, refreshProfile]);

//   /**
//    * Actualizar información del perfil
//    */
//   const updateProfile = useCallback(async (data: ProfileData) => {
//     try {
//       setIsUpdating(true);
//       setError(null);

//       const updatedProfile = await profileService.updateProfile(data);
//       setProfile(updatedProfile);

//       // Actualizar también el contexto de auth
//       await updateAuthProfile(data);

//       toast.success('Perfil actualizado exitosamente');
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar el perfil';
//       setError(errorMessage);
//       toast.error(errorMessage);
//       throw err;
//     } finally {
//       setIsUpdating(false);
//     }
//   }, [updateAuthProfile]);

//   /**
//    * Actualizar email
//    */
//   const updateEmail = useCallback(async (data: EmailUpdateData) => {
//     try {
//       setIsUpdating(true);
//       setError(null);

//       const updatedProfile = await profileService.updateEmail(data);
//       setProfile(updatedProfile);

//       toast.success('Email actualizado. Se requiere verificación.');
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar el email';
//       setError(errorMessage);
//       toast.error(errorMessage);
//       throw err;
//     } finally {
//       setIsUpdating(false);
//     }
//   }, []);

//   /**
//    * Subir avatar
//    */
//   const uploadAvatar = useCallback(async (file: File) => {
//     try {
//       setIsUpdating(true);
//       setError(null);

//       const avatarUrl = await profileService.uploadAvatar(file);
      
//       // Actualizar el perfil local
//       if (profile) {
//         setProfile({ ...profile, avatar: avatarUrl });
//       }

//       toast.success('Avatar actualizado exitosamente');
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || err.message || 'Error al subir el avatar';
//       setError(errorMessage);
//       toast.error(errorMessage);
//       throw err;
//     } finally {
//       setIsUpdating(false);
//     }
//   }, [profile]);

//   return {
//     profile,
//     loading,
//     error,
//     refreshProfile,
//     updateProfile,
//     updateEmail,
//     uploadAvatar,
//     isUpdating,
//   };
// };




// src/hooks/useProfile.ts
import { useState, useEffect, useCallback } from 'react';
import { profileService, UserProfile, ProfileData, EmailUpdateData } from '@/services/profileService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';

interface UseProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: ProfileData) => Promise<void>;
  updateEmail: (data: EmailUpdateData) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  isUpdating: boolean;
}

export const useProfile = (): UseProfileReturn => {
  const { user, updateProfile: updateAuthProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * Cargar perfil desde el backend
   */
  const refreshProfile = useCallback(async () => {
    try {
      console.log('🔄 refreshProfile: Starting...');
      setLoading(true);
      setError(null);
      
      console.log('🔄 refreshProfile: Fetching profile from API...');
      const data = await profileService.getProfile();
      console.log('✅ refreshProfile: Profile data received:', data);
      
      // Verificar que tengamos los datos mínimos necesarios
      if (!data || !data.id || !data.email) {
        console.error('❌ refreshProfile: Invalid profile data structure:', data);
        throw new Error('Los datos del perfil están incompletos');
      }
      
      console.log('✅ refreshProfile: Setting profile state with valid data...');
      setProfile(data);
      console.log('✅ refreshProfile: Profile state updated successfully');
      
    } catch (err: any) {
      console.error('❌ refreshProfile: Error:', err);
      
      let errorMessage = 'Error al cargar el perfil';
      
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Sesión expirada. Por favor inicia sesión nuevamente.';
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else {
          errorMessage = err.response.statusText || errorMessage;
        }
      } else if (err.request) {
        errorMessage = 'No se pudo conectar con el servidor.';
      } else {
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      console.log('🏁 refreshProfile: Setting loading to false');
      setLoading(false);
    }
  }, []);

  /**
   * Cargar perfil al montar el componente
   */
  useEffect(() => {
    if (user) {
      refreshProfile();
    }
  }, [user, refreshProfile]);

  /**
   * Actualizar información del perfil
   */
  const updateProfile = useCallback(async (data: ProfileData) => {
    try {
      setIsUpdating(true);
      setError(null);

      console.log('🔄 useProfile: Updating profile with:', data);
      
      // Actualizar en el backend
      await profileService.updateProfile(data);
      
      console.log('✅ useProfile: Profile updated in backend');
      
      // Forzar refresh completo del perfil desde el backend
      console.log('🔄 useProfile: Forcing full profile refresh...');
      await refreshProfile();
      
      console.log('✅ useProfile: Profile refreshed successfully');

      // También actualizar el contexto de auth si existe
      if (updateAuthProfile) {
        try {
          console.log('🔄 useProfile: Updating auth context...');
          await updateAuthProfile(data);
          console.log('✅ useProfile: Auth context updated');
        } catch (authError) {
          console.warn('⚠️ Could not update auth context:', authError);
        }
      }

      toast.success('Perfil actualizado exitosamente');
      
    } catch (err: any) {
      console.error('❌ useProfile: Error updating profile:', err);
      
      const errorMessage = err.message || err.response?.data?.message || 'Error al actualizar el perfil';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      console.log('🏁 useProfile: Setting isUpdating to false');
      setIsUpdating(false);
    }
  }, [updateAuthProfile, refreshProfile]);

  /**
   * Actualizar email
   */
  const updateEmail = useCallback(async (data: EmailUpdateData) => {
    try {
      setIsUpdating(true);
      setError(null);

      const updatedProfile = await profileService.updateEmail(data);
      setProfile(updatedProfile);

      toast.success('Email actualizado. Se requiere verificación.');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar el email';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  /**
   * Subir avatar
   */
  const uploadAvatar = useCallback(async (file: File) => {
    try {
      setIsUpdating(true);
      setError(null);

      const avatarUrl = await profileService.uploadAvatar(file);
      
      // Actualizar el perfil local
      if (profile) {
        setProfile({ ...profile, avatar: avatarUrl });
      }

      toast.success('Avatar actualizado exitosamente');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al subir el avatar';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [profile]);

  return {
    profile,
    loading,
    error,
    refreshProfile,
    updateProfile,
    updateEmail,
    uploadAvatar,
    isUpdating,
  };
};