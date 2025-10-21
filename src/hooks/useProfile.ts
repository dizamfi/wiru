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



// src/hooks/useProfile.ts - SOLUCIÓN SIMPLE Y DIRECTA
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
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * Cargar perfil desde el backend (solo al inicio)
   */
  const refreshProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await profileService.getProfile();
      setProfile(data);
      
    } catch (err: any) {
      console.error('❌ Error loading profile:', err);
      setError(err.message || 'Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cargar perfil al montar
   */
  useEffect(() => {
    if (user) {
      refreshProfile();
    }
  }, [user, refreshProfile]);

  /**
   * ✅ ACTUALIZAR PERFIL - SOLUCIÓN SIMPLE
   * 1. Hacer PUT al backend
   * 2. Actualizar estado local inmediatamente
   * 3. Listo!
   */
  const updateProfile = useCallback(async (data: ProfileData) => {
    if (!profile) return;

    try {
      setIsUpdating(true);
      setError(null);

      console.log('📤 Actualizando perfil:', data);
      
      // 1. Enviar al backend
      await profileService.updateProfile(data);
      console.log('✅ Backend actualizado');
      
      // 2. Actualizar estado local INMEDIATAMENTE con los datos que enviamos
      setProfile(prevProfile => {
        if (!prevProfile) return prevProfile;
        
        return {
          ...prevProfile,
          ...data, // Fusionar los cambios directamente
          updatedAt: new Date().toISOString(),
        };
      });
      
      console.log('✅ Estado local actualizado');
      toast.success('Perfil actualizado exitosamente');
      
    } catch (err: any) {
      console.error('❌ Error updating profile:', err);
      const errorMessage = err.message || 'Error al actualizar el perfil';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [profile]);

  /**
   * Actualizar email
   */
  const updateEmail = useCallback(async (data: EmailUpdateData) => {
    try {
      setIsUpdating(true);
      setError(null);

      await profileService.updateEmail(data);
      
      // Actualizar solo el email en el estado local
      if (profile) {
        setProfile({
          ...profile,
          email: data.email,
          isEmailVerified: false, // Requiere nueva verificación
        });
      }

      toast.success('Email actualizado. Se requiere verificación.');
    } catch (err: any) {
      const errorMessage = err.message || 'Error al actualizar el email';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [profile]);

  /**
   * Subir avatar
   */
  const uploadAvatar = useCallback(async (file: File) => {
    try {
      setIsUpdating(true);
      setError(null);

      const avatarUrl = await profileService.uploadAvatar(file);
      
      // Actualizar avatar en el estado local inmediatamente
      if (profile) {
        setProfile({
          ...profile,
          avatar: avatarUrl,
        });
      }

      toast.success('Avatar actualizado exitosamente');
    } catch (err: any) {
      const errorMessage = err.message || 'Error al subir el avatar';
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