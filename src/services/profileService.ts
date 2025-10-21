


// import api from "./api";

import api from "./api";

// export interface ProfileData {
//   firstName?: string;
//   lastName?: string;
//   phone?: string;
//   companyName?: string;
// }

// export interface EmailUpdateData {
//   email: string;
// }

// export interface UserProfile {
//   id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   phone: string | null;
//   avatar: string | null;
//   role: string;
//   type: 'PERSON' | 'COMPANY';
//   status: string;
//   isEmailVerified: boolean;
//   referralCode: string;
//   companyName: string | null;
//   createdAt: string;
//   wallet: {
//     balance: number;
//     availableBalance: number;
//     pendingBalance: number;
//     currency: string;
//     status: string;
//   } | null;
//   _count: {
//     referrals: number;
//     orders: number;
//   };
// }

// export interface ApiResponse<T> {
//   success: boolean;
//   data: T;
//   message: string;
// }

// class ProfileService {
//   /**
//    * Obtener perfil del usuario autenticado
//    */
//   async getProfile(): Promise<UserProfile> {
//     try {
//       console.log('🔄 Fetching profile from:', '/users/profile');
      
//       const response = await api.get('/users/profile');
      
//       // Log completo de la respuesta
//       console.group('📥 Profile API Response');
//       console.log('Status:', response.status);
//       console.log('Data:', response.data);
//       console.groupEnd();
      
//       // Extraer los datos
//       let userData: any = null;
      
//       // Formato: { success: true, data: {...} }
//       if (response.data && response.data.success && response.data.data) {
//         console.log('✅ Format detected: { success, data }');
//         userData = response.data.data;
//       }
//       // Formato: { data: {...} }
//       else if (response.data && response.data.data) {
//         console.log('✅ Format detected: { data }');
//         userData = response.data.data;
//       }
//       // Formato: datos directos
//       else if (response.data && response.data.id) {
//         console.log('✅ Format detected: Direct data');
//         userData = response.data;
//       }
      
//       if (!userData || !userData.id) {
//         console.error('❌ Could not extract user data from response');
//         console.error('Response data:', response.data);
//         throw new Error('No se pudo extraer los datos del perfil de la respuesta del servidor');
//       }
      
//       // Normalizar los datos (convertir strings a números en wallet)
//       if (userData.wallet) {
//         userData.wallet = {
//           ...userData.wallet,
//           balance: parseFloat(userData.wallet.balance) || 0,
//           availableBalance: parseFloat(userData.wallet.availableBalance) || 0,
//           pendingBalance: parseFloat(userData.wallet.pendingBalance) || 0,
//         };
//       }
      
//       console.log('✅ Profile loaded and normalized:', userData);
//       return userData as UserProfile;
      
//     } catch (error: any) {
//       console.group('❌ Error getting profile');
//       console.error('Error:', error);
//       console.error('Error message:', error.message);
//       console.error('Error response:', error.response);
//       console.error('Error response data:', error.response?.data);
//       console.groupEnd();
      
//       throw error;
//     }
//   }

//   /**
//    * Actualizar perfil del usuario
//    */
//   async updateProfile(data: ProfileData): Promise<UserProfile> {
//     try {
//       const response = await api.put('/users/profile', data);
      
//       console.log('📥 Update Profile Response:', response.data);
      
//       // Misma lógica de extracción
//       if (response.data && response.data.success && response.data.data) {
//         return response.data.data;
//       } else if (response.data && response.data.data) {
//         return response.data.data;
//       } else if (response.data && response.data.id) {
//         return response.data;
//       }
      
//       throw new Error('Formato de respuesta inválido al actualizar perfil');
//     } catch (error: any) {
//       console.error('❌ Error updating profile:', error);
//       throw error;
//     }
//   }

//   /**
//    * Actualizar email del usuario
//    */
//   async updateEmail(data: EmailUpdateData): Promise<UserProfile> {
//     try {
//       const response = await api.put('/users/email', data);
      
//       if (response.data && response.data.success && response.data.data) {
//         return response.data.data;
//       } else if (response.data && response.data.data) {
//         return response.data.data;
//       } else if (response.data && response.data.id) {
//         return response.data;
//       }
      
//       throw new Error('Formato de respuesta inválido al actualizar email');
//     } catch (error: any) {
//       console.error('❌ Error updating email:', error);
//       throw error;
//     }
//   }

//   /**
//    * Upload avatar
//    */
//   async uploadAvatar(file: File): Promise<string> {
//     try {
//       const formData = new FormData();
//       formData.append('avatar', file);

//       const response = await api.post('/users/avatar', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       console.log('📥 Upload Avatar Response:', response.data);

//       if (response.data && response.data.success && response.data.data) {
//         return response.data.data.avatar;
//       } else if (response.data && response.data.data) {
//         return response.data.data.avatar;
//       } else if (response.data && response.data.avatar) {
//         return response.data.avatar;
//       }

//       throw new Error('No se recibió URL del avatar');
//     } catch (error: any) {
//       console.error('❌ Error uploading avatar:', error);
//       throw error;
//     }
//   }
// }

// export const profileService = new ProfileService();
// export default profileService;










// export interface ProfileData {
//   firstName?: string;
//   lastName?: string;
//   phone?: string;
//   companyName?: string;
// }

// export interface EmailUpdateData {
//   email: string;
// }

// export interface UserProfile {
//   id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   phone: string | null;
//   avatar: string | null;
//   role: string;
//   type: 'PERSON' | 'COMPANY';
//   status: string;
//   isEmailVerified: boolean;
//   referralCode: string;
//   companyName: string | null;
//   createdAt: string;
//   wallet: {
//     balance: number;
//     availableBalance: number;
//     pendingBalance: number;
//     currency: string;
//     status: string;
//   } | null;
//   _count: {
//     referrals: number;
//     orders: number;
//   };
// }

// export interface ApiResponse<T> {
//   success: boolean;
//   data: T;
//   message: string;
// }

// class ProfileService {
//   /**
//    * Obtener perfil del usuario autenticado
//    */
//   async getProfile(): Promise<UserProfile> {
//     try {
//       console.log('🔄 Fetching profile from:', '/users/profile');
      
//       const response = await api.get('/users/profile');
      
//       // Log completo de la respuesta
//       console.group('📥 Profile API Response');
//       console.log('Status:', response.status);
//       console.log('Data:', response.data);
//       console.groupEnd();
      
//       // Extraer los datos
//       let userData: any = null;
      
//       // Formato: { success: true, data: {...} }
//       if (response.data && response.data.success && response.data.data) {
//         console.log('✅ Format detected: { success, data }');
//         userData = response.data.data;
//       }
//       // Formato: { data: {...} }
//       else if (response.data && response.data.data) {
//         console.log('✅ Format detected: { data }');
//         userData = response.data.data;
//       }
//       // Formato: datos directos
//       else if (response.data && response.data.id) {
//         console.log('✅ Format detected: Direct data');
//         userData = response.data;
//       }
      
//       if (!userData || !userData.id) {
//         console.error('❌ Could not extract user data from response');
//         console.error('Response data:', response.data);
//         throw new Error('No se pudo extraer los datos del perfil de la respuesta del servidor');
//       }
      
//       // Normalizar los datos (convertir strings a números en wallet)
//       if (userData.wallet) {
//         userData.wallet = {
//           ...userData.wallet,
//           balance: parseFloat(userData.wallet.balance) || 0,
//           availableBalance: parseFloat(userData.wallet.availableBalance) || 0,
//           pendingBalance: parseFloat(userData.wallet.pendingBalance) || 0,
//         };
//       }
      
//       console.log('✅ Profile loaded and normalized:', userData);
//       return userData as UserProfile;
      
//     } catch (error: any) {
//       console.group('❌ Error getting profile');
//       console.error('Error:', error);
//       console.error('Error message:', error.message);
//       console.error('Error response:', error.response);
//       console.error('Error response data:', error.response?.data);
//       console.groupEnd();
      
//       throw error;
//     }
//   }

//   /**
//    * Actualizar perfil del usuario
//    */
//   async updateProfile(data: ProfileData): Promise<void> {
//     try {
//       console.log('🔄 Updating profile with data:', data);
      
//       const response = await api.put('/users/profile', data);
      
//       console.log('📥 Update Profile Response:', response.data);
//       console.log('✅ Profile updated in backend successfully');
      
//       // No devolver nada, el hook se encargará de refrescar
      
//     } catch (error: any) {
//       console.error('❌ Error updating profile:', error);
//       console.error('Error response:', error.response?.data);
      
//       // Lanzar el error con un mensaje claro
//       if (error.response?.data?.message) {
//         throw new Error(error.response.data.message);
//       } else if (error.message) {
//         throw new Error(error.message);
//       } else {
//         throw new Error('Error al actualizar el perfil');
//       }
//     }
//   }

//   /**
//    * Actualizar email del usuario
//    */
//   async updateEmail(data: EmailUpdateData): Promise<UserProfile> {
//     try {
//       const response = await api.put('/users/email', data);
      
//       if (response.data && response.data.success && response.data.data) {
//         return response.data.data;
//       } else if (response.data && response.data.data) {
//         return response.data.data;
//       } else if (response.data && response.data.id) {
//         return response.data;
//       }
      
//       throw new Error('Formato de respuesta inválido al actualizar email');
//     } catch (error: any) {
//       console.error('❌ Error updating email:', error);
//       throw error;
//     }
//   }

//   /**
//    * Upload avatar
//    */
//   async uploadAvatar(file: File): Promise<string> {
//     try {
//       const formData = new FormData();
//       formData.append('avatar', file);

//       const response = await api.post('/users/avatar', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       console.log('📥 Upload Avatar Response:', response.data);

//       if (response.data && response.data.success && response.data.data) {
//         return response.data.data.avatar;
//       } else if (response.data && response.data.data) {
//         return response.data.data.avatar;
//       } else if (response.data && response.data.avatar) {
//         return response.data.avatar;
//       }

//       throw new Error('No se recibió URL del avatar');
//     } catch (error: any) {
//       console.error('❌ Error uploading avatar:', error);
//       throw error;
//     }
//   }
// }

// export const profileService = new ProfileService();
// export default profileService;




// src/services/profileService.ts - SERVICIO OPTIMIZADO


// src/services/profileService.ts - SERVICIO OPTIMIZADO


// src/services/profileService.ts - VERSIÓN SIMPLIFICADA Y CORREGIDA

// src/services/profileService.ts - SIMPLE Y DIRECTO


export interface ProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  companyName?: string;
}

export interface EmailUpdateData {
  email: string;
  currentPassword: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatar: string | null;
  role: string;
  type: 'PERSON' | 'COMPANY';
  status: string;
  isEmailVerified: boolean;
  companyName: string | null;
  companyDocument: string | null;
  referralCode: string;
  referredBy: string | null;
  createdAt: string;
  updatedAt: string;
  wallet: {
    id: string;
    balance: number;
    availableBalance: number;
    pendingBalance: number;
    currency: string;
    status: string;
  } | null;
  _count: {
    orders: number;
    referrals: number;
  };
}

class ProfileService {
  /**
   * Obtener perfil del usuario
   */
  async getProfile(): Promise<UserProfile> {
    const response = await api.get('/users/profile');
    
    // Extraer datos según formato del backend
    const userData = response.data || response;
    
    // Normalizar wallet si existe
    if (userData.wallet) {
      userData.wallet = {
        ...userData.wallet,
        balance: parseFloat(userData.wallet.balance) || 0,
        availableBalance: parseFloat(userData.wallet.availableBalance) || 0,
        pendingBalance: parseFloat(userData.wallet.pendingBalance) || 0,
      };
    }
    
    return userData as UserProfile;
  }

  /**
   * ✅ Actualizar perfil - SOLO HACE PUT
   */
  async updateProfile(data: ProfileData): Promise<void> {
    console.log('📤 PUT /users/profile:', data);
    
    await api.put('/users/profile', data);
    
    console.log('✅ PUT exitoso');
    // No retorna nada, el hook actualiza el estado local
  }

  /**
   * Actualizar email
   */
  async updateEmail(data: EmailUpdateData): Promise<void> {
    await api.put('/users/email', data);
  }

  /**
   * Subir avatar
   */
  async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data?.avatar || response.avatar;
  }
}

export const profileService = new ProfileService();
export default profileService;