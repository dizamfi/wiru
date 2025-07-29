// // src/components/payments/WithdrawalModal.tsx
// import React, { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   Button,
//   Input,
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
//   Card,
//   CardContent,
//   Badge,
//   Alert,
//   AlertDescription
// } from '@/components/ui';
// import {
//   BanknotesIcon,
//   CreditCardIcon,
//   ExclamationTriangleIcon,
//   InformationCircleIcon,
//   PlusIcon
// } from '@heroicons/react/24/outline';
// import { usePaymentStore } from '@/stores/usePaymentStore';
// import { BankAccount, PaymentMethod, WithdrawalForm } from '@/types/payment';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';

// const withdrawalSchema = z.object({
//   amount: z.number().min(10, 'El monto mínimo es $10').max(10000, 'El monto máximo es $10,000'),
//   method: z.enum(['bank_transfer', 'paypal', 'crypto']),
//   bankAccountId: z.string().optional(),
//   paypalEmail: z.string().email('Email inválido').optional(),
//   cryptoAddress: z.string().min(20, 'Dirección inválida').optional(),
//   cryptoCurrency: z.string().optional()
// }).refine((data) => {
//   if (data.method === 'bank_transfer' && !data.bankAccountId) {
//     return false;
//   }
//   if (data.method === 'paypal' && !data.paypalEmail) {
//     return false;
//   }
//   if (data.method === 'crypto' && (!data.cryptoAddress || !data.cryptoCurrency)) {
//     return false;
//   }
//   return true;
// }, {
//   message: 'Datos requeridos para el método de pago seleccionado'
// });

// interface WithdrawalModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   availableAmount: number;
// }

// export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
//   isOpen,
//   onClose,
//   availableAmount
// }) => {
//   const { bankAccounts, fetchBankAccounts, createWithdrawal, loading } = usePaymentStore();
//   const [showAddBankAccount, setShowAddBankAccount] = useState(false);
  
//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors },
//     reset
//   } = useForm<WithdrawalForm>({
//     resolver: zodResolver(withdrawalSchema),
//     defaultValues: {
//       method: 'bank_transfer'
//     }
//   });

//   const selectedMethod = watch('method');
//   const amount = watch('amount');

//   // Configuración de fees (esto vendría de la API)
//   const fees = {
//     bank_transfer: { percentage: 0, fixed: 3.50 },
//     paypal: { percentage: 2.9, fixed: 0.30 },
//     crypto: { percentage: 1.5, fixed: 0 }
//   };

//   const calculateFees = (amount: number, method: PaymentMethod) => {
//     if (!amount || amount <= 0) return 0;
//     const methodFees = fees[method] || fees.bank_transfer;
//     return (amount * methodFees.percentage / 100) + methodFees.fixed;
//   };

//   const totalFees = amount ? calculateFees(amount, selectedMethod) : 0;
//   const netAmount = amount ? amount - totalFees : 0;

//   useEffect(() => {
//     if (isOpen) {
//       fetchBankAccounts();
//     }
//   }, [isOpen, fetchBankAccounts]);

//   const onSubmit = async (data: WithdrawalForm) => {
//     try {
//       await createWithdrawal(data);
//       reset();
//       onClose();
//       // TODO: Mostrar notificación de éxito
//     } catch (error) {
//       // Error ya manejado en el store
//     }
//   };

//   const handleClose = () => {
//     reset();
//     setShowAddBankAccount(false);
//     onClose();
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={handleClose}>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <BanknotesIcon className="h-5 w-5" />
//             Solicitar Retiro
//           </DialogTitle>
//           <DialogDescription>
//             Retira tus ganancias de forma segura. Disponible: ${availableAmount.toFixed(2)}
//           </DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           {/* Monto */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Monto a retirar
//             </label>
//             <div className="relative">
//               <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
//                 $
//               </span>
//               <Input
//                 type="number"
//                 step="0.01"
//                 min="10"
//                 max={availableAmount}
//                 placeholder="0.00"
//                 className="pl-8"
//                 {...register('amount', { valueAsNumber: true })}
//               />
//             </div>
//             {errors.amount && (
//               <p className="text-sm text-error-600 mt-1">{errors.amount.message}</p>
//             )}
            
//             {/* Quick amounts */}
//             <div className="flex gap-2 mt-2">
//               {[25, 50, 100, availableAmount].map((quickAmount) => (
//                 <Button
//                   key={quickAmount}
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setValue('amount', Math.min(quickAmount, availableAmount))}
//                   disabled={quickAmount > availableAmount}
//                 >
//                   ${quickAmount === availableAmount ? 'Todo' : quickAmount}
//                 </Button>
//               ))}
//             </div>
//           </div>

//           {/* Método de pago */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Método de retiro
//             </label>
//             <Select
//               value={selectedMethod}
//               onValueChange={(value: PaymentMethod) => setValue('method', value)}
//             >
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="bank_transfer">
//                   <div className="flex items-center gap-2">
//                     <BanknotesIcon className="h-4 w-4" />
//                     Transferencia Bancaria
//                     <Badge variant="outline" className="ml-auto">$3.50</Badge>
//                   </div>
//                 </SelectItem>
//                 <SelectItem value="paypal">
//                   <div className="flex items-center gap-2">
//                     <CreditCardIcon className="h-4 w-4" />
//                     PayPal
//                     <Badge variant="outline" className="ml-auto">2.9% + $0.30</Badge>
//                   </div>
//                 </SelectItem>
//                 <SelectItem value="crypto">
//                   <div className="flex items-center gap-2">
//                     <span className="text-lg">₿</span>
//                     Criptomonedas
//                     <Badge variant="outline" className="ml-auto">1.5%</Badge>
//                   </div>
//                 </SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Detalles específicos del método */}
//           {selectedMethod === 'bank_transfer' && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Cuenta bancaria
//               </label>
              
//               {bankAccounts.length === 0 ? (
//                 <Card>
//                   <CardContent className="p-6 text-center">
//                     <p className="text-gray-500 mb-4">No tienes cuentas bancarias registradas</p>
//                     <Button
//                       type="button"
//                       variant="outline"
//                       leftIcon={<PlusIcon className="h-4 w-4" />}
//                       onClick={() => setShowAddBankAccount(true)}
//                     >
//                       Agregar Cuenta Bancaria
//                     </Button>
//                   </CardContent>
//                 </Card>
//               ) : (
//                 <Select
//                   value={watch('bankAccountId') || ''}
//                   onValueChange={(value) => setValue('bankAccountId', value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Selecciona una cuenta" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {bankAccounts.map((account) => (
//                       <SelectItem key={account.id} value={account.id!}>
//                         <div>
//                           <div className="font-medium">{account.name}</div>
//                           <div className="text-sm text-gray-500">
//                             {account.bank} - {account.account}
//                             {account.isDefault && (
//                               <Badge variant="outline" className="ml-2">Por defecto</Badge>
//                             )}
//                           </div>
//                         </div>
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               )}
              
//               {errors.bankAccountId && (
//                 <p className="text-sm text-error-600 mt-1">{errors.bankAccountId.message}</p>
//               )}
//             </div>
//           )}

//           {selectedMethod === 'paypal' && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email de PayPal
//               </label>
//               <Input
//                 type="email"
//                 placeholder="tu@email.com"
//                 {...register('paypalEmail')}
//               />
//               {errors.paypalEmail && (
//                 <p className="text-sm text-error-600 mt-1">{errors.paypalEmail.message}</p>
//               )}
//             </div>
//           )}

//           {selectedMethod === 'crypto' && (
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Criptomoneda
//                 </label>
//                 <Select
//                   value={watch('cryptoCurrency') || ''}
//                   onValueChange={(value) => setValue('cryptoCurrency', value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Selecciona criptomoneda" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
//                     <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
//                     <SelectItem value="USDT">Tether (USDT)</SelectItem>
//                     <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Dirección de wallet
//                 </label>
//                 <Input
//                   placeholder="Dirección de tu wallet"
//                   {...register('cryptoAddress')}
//                 />
//                 {errors.cryptoAddress && (
//                   <p className="text-sm text-error-600 mt-1">{errors.cryptoAddress.message}</p>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Resumen de fees */}
//           {amount && amount > 0 && (
//             <Card>
//               <CardContent className="p-4">
//                 <h4 className="font-medium mb-3">Resumen del retiro</h4>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span>Monto solicitado:</span>
//                     <span>${amount.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between text-gray-600">
//                     <span>Comisión ({selectedMethod}):</span>
//                     <span>-${totalFees.toFixed(2)}</span>
//                   </div>
//                   <hr className="my-2" />
//                   <div className="flex justify-between font-medium">
//                     <span>Recibirás:</span>
//                     <span className="text-primary-600">${netAmount.toFixed(2)}</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* Información importante */}
//           <Alert>
//             <InformationCircleIcon className="h-4 w-4" />
//             <AlertDescription>
//               <div className="space-y-1">
//                 <p><strong>Tiempos de procesamiento:</strong></p>
//                 <ul className="text-sm space-y-1 ml-4">
//                   <li>• Transferencia bancaria: 2-3 días hábiles</li>
//                   <li>• PayPal: 1-2 días hábiles</li>
//                   <li>• Criptomonedas: 30 minutos - 2 horas</li>
//                 </ul>
//               </div>
//             </AlertDescription>
//           </Alert>

//           {/* Validaciones adicionales */}
//           {amount && amount > availableAmount && (
//             <Alert variant="destructive">
//               <ExclamationTriangleIcon className="h-4 w-4" />
//               <AlertDescription>
//                 El monto excede tu saldo disponible (${availableAmount.toFixed(2)})
//               </AlertDescription>
//             </Alert>
//           )}

//           {amount && amount < 10 && (
//             <Alert variant="destructive">
//               <ExclamationTriangleIcon className="h-4 w-4" />
//               <AlertDescription>
//                 El monto mínimo de retiro es $10.00
//               </AlertDescription>
//             </Alert>
//           )}

//           {/* Botones */}
//           <div className="flex justify-end gap-3 pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={handleClose}
//               disabled={loading}
//             >
//               Cancelar
//             </Button>
//             <Button
//               type="submit"
//               disabled={loading || !amount || amount < 10 || amount > availableAmount}
//               loading={loading}
//             >
//               {loading ? 'Procesando...' : 'Solicitar Retiro'}
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };



// src/components/payments/WithdrawalModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalFooter,
  Button,
  Input,
  Select,
  Card,
  CardContent,
  Badge,
  Alert
} from '@/components/ui';
import {
  BanknotesIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { usePaymentStore } from '@/stores/usePaymentStore';
import { BankAccount, PaymentMethod, WithdrawalForm } from '@/types/payment';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const withdrawalSchema = z.object({
  amount: z.number().min(10, 'El monto mínimo es $10').max(10000, 'El monto máximo es $10,000'),
  method: z.enum(['bank_transfer', 'paypal', 'crypto']),
  bankAccountId: z.string().optional(),
  paypalEmail: z.string().email('Email inválido').optional(),
  cryptoAddress: z.string().min(20, 'Dirección inválida').optional(),
  cryptoCurrency: z.string().optional()
}).refine((data) => {
  if (data.method === 'bank_transfer' && !data.bankAccountId) {
    return false;
  }
  if (data.method === 'paypal' && !data.paypalEmail) {
    return false;
  }
  if (data.method === 'crypto' && (!data.cryptoAddress || !data.cryptoCurrency)) {
    return false;
  }
  return true;
}, {
  message: 'Datos requeridos para el método de pago seleccionado'
});

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableAmount: number;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
  availableAmount
}) => {
  const { bankAccounts, fetchBankAccounts, createWithdrawal, loading } = usePaymentStore();
  const [showAddBankAccount, setShowAddBankAccount] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      method: 'bank_transfer'
    }
  });

  const selectedMethod = watch('method');
  const amount = watch('amount');

  // Configuración de fees (esto vendría de la API)
  const fees = {
    bank_transfer: { percentage: 0, fixed: 3.50 },
    paypal: { percentage: 2.9, fixed: 0.30 },
    crypto: { percentage: 1.5, fixed: 0 }
  };

  const calculateFees = (amount: number, method: PaymentMethod) => {
    if (!amount || amount <= 0) return 0;
    const methodFees = fees[method as keyof typeof fees] || fees.bank_transfer;
    return (amount * methodFees.percentage / 100) + methodFees.fixed;
  };

  const totalFees = amount ? calculateFees(amount, selectedMethod) : 0;
  const netAmount = amount ? amount - totalFees : 0;

  useEffect(() => {
    if (isOpen) {
      fetchBankAccounts();
    }
  }, [isOpen, fetchBankAccounts]);


  const onSubmit = async (data: any) => {
    try {
      await createWithdrawal({
        ...data,
        currency: 'MXN', // O ajusta según la lógica de tu app
        fees: {
          processingFee: totalFees,
          platformFee: 0,
          withdrawalFee: 0,
          totalFees: totalFees,
          currency: 'MXN'
        }
        // fees: { total: totalFees }
      });
      reset();
      onClose();
      // TODO: Mostrar notificación de éxito
    } catch (error) {
      // Error ya manejado en el store
    }
  };

  const handleClose = () => {
    reset();
    setShowAddBankAccount(false);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      title="Solicitar Retiro"
      size="lg"
    >
      <ModalContent>
        <div className="space-y-4">
          <p className="text-gray-600">
            Retira tus ganancias de forma segura. Disponible: ${availableAmount.toFixed(2)}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Monto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monto a retirar
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  type="number"
                  step="0.01"
                  min="10"
                  max={availableAmount}
                  placeholder="0.00"
                  className="pl-8"
                  {...register('amount', { valueAsNumber: true })}
                />
              </div>
              {errors.amount && (
                <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>
              )}
              
              {/* Quick amounts */}
              <div className="flex gap-2 mt-2">
                {[25, 50, 100, availableAmount].map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setValue('amount', Math.min(quickAmount, availableAmount))}
                    disabled={quickAmount > availableAmount}
                  >
                    ${quickAmount === availableAmount ? 'Todo' : quickAmount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Método de pago */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de retiro
              </label>
              <Select
                value={selectedMethod}
                onChange={(value: string | number) => setValue('method', value as 'bank_transfer' | 'paypal' | 'crypto')}
                options={[
                  { 
                    value: 'bank_transfer', 
                    label: 'Transferencia Bancaria ($3.50)' 
                  },
                  { 
                    value: 'paypal', 
                    label: 'PayPal (2.9% + $0.30)' 
                  },
                  { 
                    value: 'crypto', 
                    label: 'Criptomonedas (1.5%)' 
                  }
                ]}
              />
            </div>

            {/* Detalles específicos del método */}
            {selectedMethod === 'bank_transfer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuenta bancaria
                </label>
                
                {bankAccounts.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-gray-500 mb-4">No tienes cuentas bancarias registradas</p>
                      <Button
                        type="button"
                        variant="outline"
                        leftIcon={<PlusIcon className="h-4 w-4" />}
                        onClick={() => setShowAddBankAccount(true)}
                      >
                        Agregar Cuenta Bancaria
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Select
                    value={watch('bankAccountId') || ''}
                    onChange={(value) => setValue('bankAccountId', String(value))}
                    options={bankAccounts.map((account) => ({
                      value: account.id!,
                      label: `${account.name} - ${account.bank} - ${account.account}${account.isDefault ? ' (Por defecto)' : ''}`
                    }))}
                    placeholder="Selecciona una cuenta"
                  />
                )}
                
                {errors.bankAccountId && (
                  <p className="text-sm text-red-600 mt-1">{errors.bankAccountId.message}</p>
                )}
              </div>
            )}

            {selectedMethod === 'paypal' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de PayPal
                </label>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  {...register('paypalEmail')}
                />
                {errors.paypalEmail && (
                  <p className="text-sm text-red-600 mt-1">{errors.paypalEmail.message}</p>
                )}
              </div>
            )}

            {selectedMethod === 'crypto' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Criptomoneda
                  </label>
                  <Select
                    value={watch('cryptoCurrency') || ''}
                    onChange={(value: string | number) => setValue('cryptoCurrency', String(value))}
                    options={[
                      { value: 'BTC', label: 'Bitcoin (BTC)' },
                      { value: 'ETH', label: 'Ethereum (ETH)' },
                      { value: 'USDT', label: 'Tether (USDT)' },
                      { value: 'USDC', label: 'USD Coin (USDC)' }
                    ]}
                    placeholder="Selecciona criptomoneda"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección de wallet
                  </label>
                  <Input
                    placeholder="Dirección de tu wallet"
                    {...register('cryptoAddress')}
                  />
                  {errors.cryptoAddress && (
                    <p className="text-sm text-red-600 mt-1">{errors.cryptoAddress.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Resumen de fees */}
            {amount && amount > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Resumen del retiro</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Monto solicitado:</span>
                      <span>${amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Comisión ({selectedMethod}):</span>
                      <span>-${totalFees.toFixed(2)}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>Recibirás:</span>
                      <span className="text-blue-600">${netAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Información importante */}
            <Alert variant="default">
              <InformationCircleIcon className="h-4 w-4" />
              <div className="space-y-1">
                <p><strong>Tiempos de procesamiento:</strong></p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Transferencia bancaria: 2-3 días hábiles</li>
                  <li>• PayPal: 1-2 días hábiles</li>
                  <li>• Criptomonedas: 30 minutos - 2 horas</li>
                </ul>
              </div>
            </Alert>

            {/* Validaciones adicionales */}
            {amount && amount > availableAmount && (
              <Alert variant="danger">
                <ExclamationTriangleIcon className="h-4 w-4" />
                El monto excede tu saldo disponible (${availableAmount.toFixed(2)})
              </Alert>
            )}

            {amount && amount < 10 && (
              <Alert variant="danger">
                <ExclamationTriangleIcon className="h-4 w-4" />
                El monto mínimo de retiro es $10.00
              </Alert>
            )}
          </form>
        </div>
      </ModalContent>
      
      <ModalFooter>
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading || !amount || amount < 10 || amount > availableAmount}
            loading={loading}
            onClick={handleSubmit(onSubmit)}
          >
            {loading ? 'Procesando...' : 'Solicitar Retiro'}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};