// src/components/orders/InvoiceGenerator.tsx
import React, { useState, useRef } from 'react';
import { 
  QrCodeIcon, 
  DocumentArrowDownIcon,
  PrinterIcon,
  ShareIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Order, OrderItem } from '@/types/order';
import { User, isPersonProfile } from '@/types/user';
import { formatCurrency } from '@/utils/currency';
import { generateQRCode } from '@/utils/qr';
import { downloadPDF, printInvoice } from '@/utils/print';

interface InvoiceGeneratorProps {
  order: Order;
  user: User;
  onClose?: () => void;
}

export const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({
  order,
  user,
  onClose
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    generateOrderQR();
  }, [order]);

  const generateOrderQR = async () => {
    try {
      const qrData = {
        orderId: order.id,
        orderNumber: order.orderNumber,
        userId: user.id,
        totalItems: order.items.length,
        estimatedValue: order.estimatedTotal,
        estimatedWeight: order.totalWeight,
        createdAt: order.createdAt,
        deliveryMethod: order.shipping?.method,
        customerInfo: isPersonProfile(user) ? {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phone,
          identification: user.identificationNumber
        } : {
          companyName: user.companyName,
          taxId: user.taxId,
          legalRep: `${user.legalRepresentative.firstName} ${user.legalRepresentative.lastName}`,
          email: user.email
        }
      };

      const qrUrl = await generateQRCode(JSON.stringify(qrData));
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    
    setIsGeneratingPDF(true);
    try {
      await downloadPDF(invoiceRef.current, `Orden-${order.orderNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    if (!invoiceRef.current) return;
    printInvoice(invoiceRef.current);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Orden ${order.orderNumber}`,
          text: `Orden de venta de chatarra electrónica`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Orden #{order.orderNumber}
        </h2>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleShare}>
            <ShareIcon className="h-4 w-4 mr-2" />
            Compartir
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <PrinterIcon className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button 
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            loading={isGeneratingPDF}
          >
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            Descargar PDF
          </Button>
        </div>
      </div>

      {/* Invoice Content */}
      <Card>
        <CardContent className="p-8" ref={invoiceRef}>
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                ORDEN DE VENTA
              </h1>
              <div className="text-sm text-gray-600">
                <p>Orden: <span className="font-medium">{order.orderNumber}</span></p>
                <p>Fecha: <span className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString('es-ES')}
                </span></p>
                <p>Estado: <Badge variant={
                  order.status === 'confirmed' ? 'success' :
                  order.status === 'pending' ? 'warning' : 'secondary'
                }>
                  {order.status}
                </Badge></p>
              </div>
            </div>

            {/* QR Code */}
            <div className="text-center">
              {qrCodeUrl ? (
                <div>
                  <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Código QR para Servientrega</p>
                </div>
              ) : (
                <div className="w-32 h-32 bg-gray-100 flex items-center justify-center">
                  <QrCodeIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Información del Cliente</h3>
              {isPersonProfile(user) ? (
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Nombre:</span> {user.firstName} {user.lastName}</p>
                  <p><span className="font-medium">Email:</span> {user.email}</p>
                  <p><span className="font-medium">Teléfono:</span> {user.phone || 'No especificado'}</p>
                  <p><span className="font-medium">Identificación:</span> {user.identificationNumber}</p>
                  {user.address && (
                    <p><span className="font-medium">Dirección:</span> {user.address.street}, {user.address.city}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Empresa:</span> {user.companyName}</p>
                  <p><span className="font-medium">Razón Social:</span> {user.legalName}</p>
                  <p><span className="font-medium">RUC:</span> {user.taxId}</p>
                  <p><span className="font-medium">Rep. Legal:</span> {user.legalRepresentative.firstName} {user.legalRepresentative.lastName}</p>
                  <p><span className="font-medium">Email:</span> {user.email}</p>
                  {user.businessAddress && (
                    <p><span className="font-medium">Dirección:</span> {user.businessAddress.street}, {user.businessAddress.city}</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Información de Entrega</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Método:</span> {
                  order.shipping?.method === 'pickup' ? 'Recolección a domicilio' : 'Punto de acopio Servientrega'
                }</p>
                {order.shipping?.method === 'pickup' && order.shipping.address && (
                  <p><span className="font-medium">Dirección:</span> {order.shipping.address.street}, {order.shipping.address.city}</p>
                )}
                {order.shipping?.scheduledDate && (
                  <p><span className="font-medium">Fecha programada:</span> {
                    new Date(order.shipping.scheduledDate).toLocaleDateString('es-ES')
                  }</p>
                )}
                {order.shipping?.trackingNumber && (
                  <p><span className="font-medium">Guía Servientrega:</span> {order.shipping.trackingNumber}</p>
                )}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Dispositivos a Vender</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Dispositivo</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Condición</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Peso Est.</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Valor Est.</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Accesorios</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">
                        <div>
                          <p className="font-medium">{item.deviceName}</p>
                          {item.brand && item.model && (
                            <p className="text-sm text-gray-600">{item.brand} {item.model}</p>
                          )}
                          {item.description && (
                            <p className="text-xs text-gray-500">{item.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <Badge variant="outline" className="text-xs">
                          {item.condition}
                        </Badge>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {item.estimatedWeight} kg
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {formatCurrency(item.estimatedValue)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {item.hasCharger && <span className="text-xs bg-green-100 text-green-800 px-1 rounded">Cargador</span>}
                          {item.hasBox && <span className="text-xs bg-green-100 text-green-800 px-1 rounded">Caja</span>}
                          {item.hasDocuments && <span className="text-xs bg-green-100 text-green-800 px-1 rounded">Docs</span>}
                          {!item.hasCharger && !item.hasBox && !item.hasDocuments && (
                            <span className="text-xs text-gray-500">Ninguno</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-80">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Total de dispositivos:</span>
                  <span className="font-medium">{order.items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Peso total estimado:</span>
                  <span className="font-medium">{order.totalWeight} kg</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-semibold">
                  <span>Valor estimado total:</span>
                  <span>{formatCurrency(order.estimatedTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Notas Importantes</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p>Los valores mostrados son estimaciones basadas en la información proporcionada.</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p>El valor final será determinado después de la verificación física en nuestras instalaciones.</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p>Presenta este código QR al momento de la entrega en Servientrega.</p>
              </div>
              {isPersonProfile(user) && (
                <div className="flex items-start space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p>El pago se acreditará automáticamente en tu billetera virtual una vez verificado.</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t pt-6 mt-8 text-center text-sm text-gray-600">
            <p>Plataforma de Reciclaje Electrónico - {new Date().getFullYear()}</p>
            <p>Para consultas: soporte@reciclaje-electronico.com</p>
          </div>
        </CardContent>
      </Card>

      {onClose && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      )}
    </div>
  );
};

// src/utils/qr.ts - Utilidades para generar códigos QR
export const generateQRCode = async (data: string): Promise<string> => {
  try {
    // En un entorno real, usarías una librería como qrcode
    // Por ahora simulamos con un servicio online
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`;
    return qrApiUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

// src/utils/print.ts - Utilidades para imprimir y generar PDF
export const downloadPDF = async (element: HTMLElement, filename: string): Promise<void> => {
  try {
    // En un entorno real, usarías html2pdf.js o similar
    const { default: html2pdf } = await import('html2pdf.js');
    
    const options = {
      margin: 1,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    await html2pdf().set(options).from(element).save();
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const printInvoice = (element: HTMLElement): void => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Orden de Venta</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .text-center { text-align: center; }
            .font-bold { font-weight: bold; }
            .bg-gray-50 { background-color: #f9fafb; }
            .space-y-2 > * + * { margin-top: 0.5rem; }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
};

// Componente para mostrar el QR en la página de orden
export const OrderQRDisplay: React.FC<{ order: Order }> = ({ order }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  React.useEffect(() => {
    const generateQR = async () => {
      const qrData = {
        orderId: order.id,
        orderNumber: order.orderNumber,
        createdAt: order.createdAt
      };
      
      try {
        const url = await generateQRCode(JSON.stringify(qrData));
        setQrCodeUrl(url);
      } catch (error) {
        console.error('Error generating QR:', error);
      }
    };

    generateQR();
  }, [order]);

  return (
    <Card>
      <CardContent className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-4">Código QR para Entrega</h3>
        {qrCodeUrl ? (
          <div>
            <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-4">
              Presenta este código QR al momento de entregar tus dispositivos en Servientrega
            </p>
            <Button
              variant="outline"
              onClick={() => {
                const link = document.createElement('a');
                link.href = qrCodeUrl;
                link.download = `QR-${order.orderNumber}.png`;
                link.click();
              }}
            >
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              Descargar QR
            </Button>
          </div>
        ) : (
          <div className="w-48 h-48 mx-auto bg-gray-100 flex items-center justify-center">
            <QrCodeIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};