// // src/services/uploadService.ts - SERVICIO DE UPLOAD
// // import api from '@/config/axi';

import api from "./api";

// import api from "./api";

// class UploadService {
//   /**
//    * Subir imagen a Cloudinary
//    */
//   async uploadImage(file: File): Promise<string> {
//     try {
//       const formData = new FormData();
//       formData.append('file', file);
//       formData.append('folder', 'orders');

//       const response = await api.post('/upload/image', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       return response.data.data.url;
//     } catch (error: any) {
//       console.error('Error uploading image:', error);
//       throw new Error(
//         error.response?.data?.message || 'Error al subir la imagen'
//       );
//     }
//   }

//   /**
//    * Subir múltiples imágenes
//    */
//   async uploadMultipleImages(files: File[]): Promise<string[]> {
//     try {
//       const uploadPromises = files.map(file => this.uploadImage(file));
//       return await Promise.all(uploadPromises);
//     } catch (error) {
//       console.error('Error uploading multiple images:', error);
//       throw error;
//     }
//   }
// }

// export default new UploadService();





// src/services/uploadService.ts - ACTUALIZAR PARA USAR FormData


// src/services/uploadService.ts - VERSIÓN CORREGIDA


class UploadService {
  /**
   * Subir imagen a Cloudinary
   */
  async uploadImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'orders');

      console.log('📤 Uploading single image:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });

      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Upload response:', response.data);

      // Manejar diferentes estructuras de respuesta
      const data = response.data?.data || response.data;
      
      if (!data || !data.url) {
        console.error('❌ Invalid upload response:', response.data);
        throw new Error('Respuesta de upload inválida');
      }

      return data.url;
    } catch (error: any) {
      console.error('❌ Error uploading image:', error);
      console.error('Error response:', error.response?.data);
      
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al subir la imagen'
      );
    }
  }

  /**
   * Subir múltiples imágenes
   */
  async uploadMultipleImages(files: File[]): Promise<string[]> {
    try {
      if (!files || files.length === 0) {
        console.log('⚠️ No files to upload');
        return [];
      }

      console.log('📤 Uploading multiple images:', {
        count: files.length,
        files: files.map(f => ({ name: f.name, size: f.size, type: f.type })),
      });

      const formData = new FormData();
      
      // Agregar cada archivo al FormData
      files.forEach((file) => {
        formData.append('files', file);
      });
      formData.append('folder', 'orders');

      console.log('📤 Sending FormData to backend...');

      const response = await api.post('/upload/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 segundos
      });

      console.log('✅ Upload response:', response.data);

      // ✅ MANEJAR CORRECTAMENTE LA RESPUESTA
      const data = response.data?.data || response.data;
      
      if (!data) {
        console.error('❌ No data in response:', response.data);
        throw new Error('Respuesta de upload vacía');
      }

      // ✅ VERIFICAR QUE images EXISTA Y SEA UN ARRAY
      if (!data.images || !Array.isArray(data.images)) {
        console.error('❌ Invalid images array:', data);
        throw new Error('Respuesta de upload inválida - images no es un array');
      }

      // ✅ EXTRAER SOLO LAS URLs
      const imageUrls = data.images.map((img: any) => {
        if (typeof img === 'string') {
          return img;
        }
        if (img && typeof img === 'object' && img.url) {
          return img.url;
        }
        console.warn('⚠️ Invalid image format:', img);
        return null;
      }).filter((url: string | null) => url !== null) as string[];

      console.log('✅ Images uploaded successfully:', imageUrls);

      if (imageUrls.length === 0) {
        throw new Error('No se pudieron obtener las URLs de las imágenes');
      }

      return imageUrls;
    } catch (error: any) {
      console.error('❌ Error uploading multiple images:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        stack: error.stack,
      });
      
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al subir las imágenes'
      );
    }
  }
}

export default new UploadService();