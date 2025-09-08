// src/components/auth/ChangePasswordForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthContext } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: z.string()
    .min(6, 'La nueva contraseña debe tener al menos 6 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'La contraseña debe contener al menos: 1 minúscula, 1 mayúscula y 1 número'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

interface ChangePasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { changePassword } = useAuthContext();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true);
    
    try {
      const result = await changePassword(data.currentPassword, data.newPassword);
      
      if (result.success) {
        toast.success('Contraseña cambiada exitosamente. Por favor inicia sesión nuevamente.');
        reset();
        onSuccess?.();
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al cambiar contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Cambiar Contraseña
      </h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Contraseña Actual"
          type="password"
          placeholder="Tu contraseña actual"
          error={errors.currentPassword?.message}
          {...register('currentPassword')}
        />
        
        <Input
          label="Nueva Contraseña"
          type="password"
          placeholder="Tu nueva contraseña"
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />
        
        <Input
          label="Confirmar Nueva Contraseña"
          type="password"
          placeholder="Confirma tu nueva contraseña"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        
        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
          </Button>
          
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};