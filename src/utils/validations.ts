// import { z } from 'zod';

// // Regex para validación de teléfono (formato internacional)
// const phoneRegex = /^\+?[1-9]\d{1,14}$/;

// // Regex para validación de código de referido (alfanumérico)
// const referralCodeRegex = /^[A-Za-z0-9]{6,}$/;

// // Esquema de validación para login
// export const loginSchema = z.object({
//   email: z
//     .string()
//     .min(1, 'El email es requerido')
//     .email('Ingresa un email válido')
//     .max(255, 'El email es demasiado largo'),
//   password: z
//     .string()
//     .min(1, 'La contraseña es requerida')
//     .min(6, 'La contraseña debe tener al menos 6 caracteres')
//     .max(100, 'La contraseña no puede tener más de 100 caracteres'),
// });

// // Esquema de validación para registro
// export const registerSchema = z.object({
//   firstName: z
//     .string()
//     .min(1, 'El nombre es requerido')
//     .min(2, 'El nombre debe tener al menos 2 caracteres')
//     .max(50, 'El nombre no puede tener más de 50 caracteres')
//     .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'El nombre solo puede contener letras y espacios'),
//   lastName: z
//     .string()
//     .min(1, 'El apellido es requerido')
//     .min(2, 'El apellido debe tener al menos 2 caracteres')
//     .max(50, 'El apellido no puede tener más de 50 caracteres')
//     .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'El apellido solo puede contener letras y espacios'),
//   email: z
//     .string()
//     .min(1, 'El email es requerido')
//     .email('Ingresa un email válido')
//     .max(255, 'El email es demasiado largo')
//     .toLowerCase(),
//   password: z
//     .string()
//     .min(1, 'La contraseña es requerida')
//     .min(6, 'La contraseña debe tener al menos 6 caracteres')
//     .max(100, 'La contraseña no puede tener más de 100 caracteres')
//     .regex(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
//       'La contraseña debe contener al menos: 1 minúscula, 1 mayúscula y 1 número'
//     ),
//   confirmPassword: z
//     .string()
//     .min(1, 'Confirma tu contraseña'),
//   phone: z
//     .string()
//     .optional()
//     .refine((val) => !val || val.length === 0 || phoneRegex.test(val), {
//       message: 'Ingresa un número de teléfono válido (ej: +57 300 123 4567)',
//     }),
//   referralCode: z
//     .string()
//     .optional()
//     .refine((val) => !val || val.length === 0 || referralCodeRegex.test(val), {
//       message: 'El código de referido debe tener al menos 6 caracteres alfanuméricos',
//     }),
//   acceptTerms: z
//     .boolean()
//     .refine((val) => val === true, {
//       message: 'Debes aceptar los términos y condiciones',
//     }),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: 'Las contraseñas no coinciden',
//   path: ['confirmPassword'],
// });

// // Esquema de validación para recuperación de contraseña
// export const forgotPasswordSchema = z.object({
//   email: z
//     .string()
//     .min(1, 'El email es requerido')
//     .email('Ingresa un email válido')
//     .max(255, 'El email es demasiado largo'),
// });

// // Esquema de validación para reset de contraseña
// export const resetPasswordSchema = z.object({
//   password: z
//     .string()
//     .min(1, 'La contraseña es requerida')
//     .min(6, 'La contraseña debe tener al menos 6 caracteres')
//     .max(100, 'La contraseña no puede tener más de 100 caracteres')
//     .regex(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
//       'La contraseña debe contener al menos: 1 minúscula, 1 mayúscula y 1 número'
//     ),
//   confirmPassword: z
//     .string()
//     .min(1, 'Confirma tu contraseña'),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: 'Las contraseñas no coinciden',
//   path: ['confirmPassword'],
// });

// // Esquema de validación para cambio de contraseña (desde perfil)
// export const changePasswordSchema = z.object({
//   currentPassword: z
//     .string()
//     .min(1, 'La contraseña actual es requerida'),
//   newPassword: z
//     .string()
//     .min(1, 'La nueva contraseña es requerida')
//     .min(6, 'La nueva contraseña debe tener al menos 6 caracteres')
//     .max(100, 'La nueva contraseña no puede tener más de 100 caracteres')
//     .regex(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
//       'La nueva contraseña debe contener al menos: 1 minúscula, 1 mayúscula y 1 número'
//     ),
//   confirmNewPassword: z
//     .string()
//     .min(1, 'Confirma la nueva contraseña'),
// }).refine((data) => data.newPassword === data.confirmNewPassword, {
//   message: 'Las nuevas contraseñas no coinciden',
//   path: ['confirmNewPassword'],
// }).refine((data) => data.currentPassword !== data.newPassword, {
//   message: 'La nueva contraseña debe ser diferente a la actual',
//   path: ['newPassword'],
// });

// // Esquema de validación para perfil de usuario
// export const updateProfileSchema = z.object({
//   firstName: z
//     .string()
//     .min(1, 'El nombre es requerido')
//     .min(2, 'El nombre debe tener al menos 2 caracteres')
//     .max(50, 'El nombre no puede tener más de 50 caracteres')
//     .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'El nombre solo puede contener letras y espacios'),
//   lastName: z
//     .string()
//     .min(1, 'El apellido es requerido')
//     .min(2, 'El apellido debe tener al menos 2 caracteres')
//     .max(50, 'El apellido no puede tener más de 50 caracteres')
//     .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'El apellido solo puede contener letras y espacios'),
//   phone: z
//     .string()
//     .optional()
//     .refine((val) => !val || val.length === 0 || phoneRegex.test(val), {
//       message: 'Ingresa un número de teléfono válido',
//     }),
//   birthDate: z
//     .string()
//     .optional()
//     .refine((val) => {
//       if (!val) return true;
//       const date = new Date(val);
//       const today = new Date();
//       const age = today.getFullYear() - date.getFullYear();
//       return age >= 18 && age <= 100;
//     }, {
//       message: 'Debes ser mayor de 18 años',
//     }),
// });

// // Tipos inferidos de los esquemas
// export type LoginFormData = z.infer<typeof loginSchema>;
// export type RegisterFormData = z.infer<typeof registerSchema>;
// export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
// export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
// export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
// export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

// // Utilidades de validación
// export const validateEmail = (email: string): boolean => {
//   return z.string().email().safeParse(email).success;
// };

// export const validatePassword = (password: string): { 
//   isValid: boolean; 
//   errors: string[] 
// } => {
//   const errors: string[] = [];
  
//   if (password.length < 6) {
//     errors.push('Debe tener al menos 6 caracteres');
//   }
  
//   if (!/[a-z]/.test(password)) {
//     errors.push('Debe contener al menos una letra minúscula');
//   }
  
//   if (!/[A-Z]/.test(password)) {
//     errors.push('Debe contener al menos una letra mayúscula');
//   }
  
//   if (!/\d/.test(password)) {
//     errors.push('Debe contener al menos un número');
//   }
  
//   return {
//     isValid: errors.length === 0,
//     errors
//   };
// };

// export const getPasswordStrength = (password: string): {
//   score: number;
//   label: string;
//   color: string;
// } => {
//   let score = 0;
  
//   // Longitud
//   if (password.length >= 6) score += 1;
//   if (password.length >= 8) score += 1;
//   if (password.length >= 12) score += 1;
  
//   // Complejidad
//   if (/[a-z]/.test(password)) score += 1;
//   if (/[A-Z]/.test(password)) score += 1;
//   if (/\d/.test(password)) score += 1;
//   if (/[^a-zA-Z\d]/.test(password)) score += 1;
  
//   if (score <= 2) {
//     return { score, label: 'Débil', color: 'text-danger-600' };
//   } else if (score <= 4) {
//     return { score, label: 'Regular', color: 'text-warning-600' };
//   } else if (score <= 5) {
//     return { score, label: 'Buena', color: 'text-primary-600' };
//   } else {
//     return { score, label: 'Excelente', color: 'text-success-600' };
//   }
// };








// src/utils/validations.ts - VERSIÓN SIMPLE
import { z } from 'zod';

// Regex para validación de teléfono (formato internacional)
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

// Regex para validación de código de referido (alfanumérico)
const referralCodeRegex = /^[A-Za-z0-9]{6,}$/;

// Esquema base común para ambos tipos de usuario
const baseSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Ingresa un email válido')
    .max(255, 'El email es demasiado largo')
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña no puede tener más de 100 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos: 1 minúscula, 1 mayúscula y 1 número'
    ),
  confirmPassword: z
    .string()
    .min(1, 'Confirma tu contraseña'),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || phoneRegex.test(val),
      'Formato de teléfono inválido'
    ),
  referralCode: z
    .string()
    .optional()
    .refine(
      (val) => !val || referralCodeRegex.test(val),
      'Código de referido inválido'
    ),
  acceptTerms: z
    .boolean()
    .refine(val => val === true, 'Debes aceptar los términos y condiciones'),
  acceptPrivacy: z
    .boolean()
    .refine(val => val === true, 'Debes aceptar la política de privacidad'),
  userType: z.enum(['person', 'company']),
  
  // ✅ firstName y lastName son OBLIGATORIOS para AMBOS tipos
  firstName: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  lastName: z
    .string()
    .min(1, 'El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede tener más de 50 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'El apellido solo puede contener letras y espacios'),
});

// ✅ ESQUEMA PARA PERSONAS NATURALES (igual que antes)
export const personSchema = baseSchema.extend({
  // Campos opcionales para personas naturales
  identificationNumber: z.string().optional(),
  identificationType: z.enum(['cedula', 'passport', 'license']).optional(),
  dateOfBirth: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

// ✅ ESQUEMA PARA EMPRESAS (ahora incluye firstName y lastName obligatorios)
export const companySchema = baseSchema.extend({
  // Campos requeridos para empresas
  companyName: z
    .string()
    .min(1, 'El nombre de la empresa es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
  legalName: z
    .string()
    .min(2, 'La razón social debe tener al menos 2 caracteres')
    .max(100, 'La razón social no puede tener más de 100 caracteres')
    .optional(),
  taxId: z
    .string()
    .min(1, 'El RUC/Tax ID es requerido')
    .min(8, 'El RUC debe tener al menos 8 caracteres')
    .max(20, 'El RUC no puede tener más de 20 caracteres'),
  
  // Campos opcionales de empresa
  industry: z.string().max(50).optional(),
  companySize: z.enum(['small', 'medium', 'large', 'enterprise']).optional(),
  
  // Representante legal (todos opcionales)
  legalRepFirstName: z.string().max(50).optional(),
  legalRepLastName: z.string().max(50).optional(),
  legalRepPosition: z.string().max(50).optional(),
  legalRepPhone: z.string().optional().refine(
    (val) => !val || phoneRegex.test(val),
    'Formato de teléfono inválido'
  ),
  legalRepEmail: z.string().email('Email del representante inválido').optional().or(z.literal('')),
  legalRepId: z.string().max(20).optional(),
  
  // Dirección comercial (todos opcionales)
  businessStreet: z.string().max(200).optional(),
  businessCity: z.string().max(100).optional(),
  businessState: z.string().max(100).optional(),
  businessZipCode: z.string().max(20).optional(),
  businessCountry: z.string().max(50).optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

// Esquemas adicionales (sin cambios)
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Ingresa un email válido')
    .max(255, 'El email es demasiado largo'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña no puede tener más de 100 caracteres'),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Ingresa un email válido')
    .max(255, 'El email es demasiado largo'),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña no puede tener más de 100 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos: 1 minúscula, 1 mayúscula y 1 número'
    ),
  confirmPassword: z
    .string()
    .min(1, 'Confirma tu contraseña'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

// ✅ TIPOS TYPESCRIPT DERIVADOS
export type PersonFormData = z.infer<typeof personSchema>;
export type CompanyFormData = z.infer<typeof companySchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// ✅ HELPER PARA VALIDAR DINÁMICAMENTE SEGÚN TIPO
export const getRegisterSchema = (userType: 'person' | 'company') => {
  return userType === 'person' ? personSchema : companySchema;
};

// ✅ OPCIONES PARA SELECTS
export const industries = [
  { value: 'technology', label: 'Tecnología' },
  { value: 'retail', label: 'Comercio al por menor' },
  { value: 'manufacturing', label: 'Manufactura' },
  { value: 'healthcare', label: 'Salud' },
  { value: 'education', label: 'Educación' },
  { value: 'finance', label: 'Finanzas' },
  { value: 'construction', label: 'Construcción' },
  { value: 'hospitality', label: 'Hostelería' },
  { value: 'other', label: 'Otro' },
];

export const companySizes = [
  { value: 'small', label: 'Pequeña (1-50 empleados)' },
  { value: 'medium', label: 'Mediana (51-250 empleados)' },
  { value: 'large', label: 'Grande (251-1000 empleados)' },
  { value: 'enterprise', label: 'Empresa (1000+ empleados)' },
];

export const identificationTypes = [
  { value: 'cedula', label: 'Cédula de Ciudadanía' },
  { value: 'passport', label: 'Pasaporte' },
  { value: 'license', label: 'Licencia de Conducir' },
];

export const countries = [
  { value: 'Ecuador', label: 'Ecuador' },
  { value: 'Colombia', label: 'Colombia' },
  { value: 'Peru', label: 'Perú' },
  { value: 'Venezuela', label: 'Venezuela' },
  { value: 'Other', label: 'Otro' },
];