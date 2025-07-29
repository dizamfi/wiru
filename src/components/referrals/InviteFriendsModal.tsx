// src/components/referrals/InviteFriendsModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalFooter,
  Button,
  Input,
  Card,
  CardContent,
  Badge
} from '@/components/ui';
import {
  UserPlusIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  PlusIcon,
  XMarkIcon,
  ClipboardDocumentIcon,
  QrCodeIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { useReferrals } from '@/hooks/useReferrals';
import { InvitationSource } from '@/types/referral';

interface InviteFriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode: string;
  referralLink: string;
}

export const InviteFriendsModal: React.FC<InviteFriendsModalProps> = ({
  isOpen,
  onClose,
  referralCode,
  referralLink
}) => {
  const { sendInvitations, shareOnPlatform, copyReferralLink, copyReferralCode } = useReferrals();
  const [emails, setEmails] = useState<string[]>(['']);
  const [customMessage, setCustomMessage] = useState('');
  const [selectedSource, setSelectedSource] = useState<InvitationSource>('email');
  const [loading, setLoading] = useState(false);

  const addEmailField = () => {
    setEmails([...emails, '']);
  };

  const removeEmailField = (index: number) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index));
    }
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleSendInvitations = async () => {
    const validEmails = emails.filter(email => email.trim() && email.includes('@'));
    
    if (validEmails.length === 0) {
      return;
    }

    setLoading(true);
    try {
      await sendInvitations(validEmails, selectedSource, customMessage || undefined);
      setEmails(['']);
      setCustomMessage('');
      onClose();
    } catch (error) {
      // Error ya manejado en el hook
    } finally {
      setLoading(false);
    }
  };

  const shareOptions = [
    {
      platform: 'whatsapp' as InvitationSource,
      name: 'WhatsApp',
      icon: DevicePhoneMobileIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      platform: 'email' as InvitationSource,
      name: 'Email',
      icon: EnvelopeIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      platform: 'facebook' as InvitationSource,
      name: 'Facebook',
      icon: GlobeAltIcon,
      color: 'text-blue-700',
      bgColor: 'bg-blue-100'
    },
    {
      platform: 'twitter' as InvitationSource,
      name: 'Twitter',
      icon: GlobeAltIcon,
      color: 'text-sky-600',
      bgColor: 'bg-sky-100'
    },
    {
      platform: 'linkedin' as InvitationSource,
      name: 'LinkedIn',
      icon: GlobeAltIcon,
      color: 'text-blue-800',
      bgColor: 'bg-blue-100'
    },
    {
      platform: 'copy_link' as InvitationSource,
      name: 'Copiar Enlace',
      icon: ClipboardDocumentIcon,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invitar Amigos" size="lg">
      <ModalContent>
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlusIcon className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Invita a tus amigos
            </h3>
            <p className="text-gray-600">
              Gana <strong>$25</strong> por cada amigo que se registre y <strong>$50</strong> cuando haga su primera venta
            </p>
          </div>

          {/* Quick Share Options */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Compartir en redes sociales</h4>
            <div className="grid grid-cols-3 gap-3">
              {shareOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.platform}
                    variant="outline"
                    onClick={() => shareOnPlatform(option.platform, customMessage)}
                    className="flex flex-col items-center py-4 h-auto"
                  >
                    <div className={`w-8 h-8 rounded-full ${option.bgColor} flex items-center justify-center mb-2`}>
                      <Icon className={`h-4 w-4 ${option.color}`} />
                    </div>
                    <span className="text-xs">{option.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Referral Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tu Código</p>
                    <code className="text-lg font-mono font-bold text-primary-600">
                      {referralCode}
                    </code>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyReferralCode}
                  >
                    <ClipboardDocumentIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700">Tu Enlace</p>
                    <p className="text-sm text-gray-600 truncate">
                      {referralLink}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyReferralLink}
                  >
                    <ClipboardDocumentIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Email Invitations */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Invitar por email</h4>
            
            <div className="space-y-3">
              {emails.map((email, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="email@ejemplo.com"
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    className="flex-1"
                  />
                  {emails.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeEmailField(index)}
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={addEmailField}
                leftIcon={<PlusIcon className="h-4 w-4" />}
              >
                Agregar otro email
              </Button>
            </div>
          </div>

          {/* Custom Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensaje personalizado (opcional)
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="¡Hola! Te invito a unirte a Wiru y ganar dinero reciclando..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {customMessage.length}/500 caracteres
            </p>
          </div>

          {/* Benefits Reminder */}
          <div className="bg-primary-50 rounded-lg p-4">
            <h5 className="font-medium text-primary-900 mb-2">
              💰 Beneficios del programa
            </h5>
            <ul className="text-sm text-primary-800 space-y-1">
              <li>• $25 cuando tu amigo se registre</li>
              <li>• $50 cuando haga su primera venta</li>
              <li>• 5% de comisión en todas sus ventas</li>
              <li>• Bonos especiales por niveles</li>
            </ul>
          </div>
        </div>
      </ModalContent>

      <ModalFooter>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSendInvitations}
            loading={loading}
            disabled={emails.filter(e => e.trim() && e.includes('@')).length === 0}
          >
            Enviar Invitaciones
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};