// src/services/websocketClient.ts

import { io, Socket } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Cliente de WebSocket para notificaciones en tiempo real
 * Se conecta al servidor y escucha eventos de notificaciones
 */

class WebSocketClient {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  /**
   * Conectar al servidor WebSocket
   */
  connect() {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      console.warn('No access token found, skipping WebSocket connection');
      return;
    }

    if (this.socket?.connected) {
      console.log('WebSocket already connected');
      return;
    }

    console.log('🔌 Connecting to WebSocket server...');

    this.socket = io(API_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      auth: {
        token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventHandlers();
  }

  /**
   * Configurar handlers de eventos
   */
  private setupEventHandlers() {
    if (!this.socket) return;

    // Conexión exitosa
    this.socket.on('connected', (data) => {
      console.log('✅ WebSocket connected:', data);
      this.reconnectAttempts = 0;
      this.emit('connected', data);
    });

    // Nueva notificación
    this.socket.on('notification', (notification) => {
      console.log('🔔 New notification received:', notification);
      this.emit('notification', notification);
    });

    // Contador de no leídas
    this.socket.on('notification:unread-count', (data) => {
      console.log('📊 Unread count updated:', data.count);
      this.emit('unreadCountUpdated', data.count);
    });

    // Desconexión
    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      this.emit('disconnected', reason);
    });

    // Error de conexión
    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error.message);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.emit('connectionFailed', error);
      }
    });

    // Reconexión exitosa
    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`✅ WebSocket reconnected after ${attemptNumber} attempts`);
      this.reconnectAttempts = 0;
      this.emit('reconnected', attemptNumber);
    });
  }

  /**
   * Desconectar
   */
  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting WebSocket...');
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  /**
   * Verificar si está conectado
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Agregar listener para un evento
   */
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  /**
   * Remover listener
   */
  off(event: string, callback?: Function) {
    if (!callback) {
      this.listeners.delete(event);
      return;
    }

    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }

  /**
   * Emitir evento a los listeners locales
   */
  private emit(event: string, data?: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  /**
   * Enviar evento al servidor
   */
  send(event: string, data?: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('WebSocket not connected. Cannot send event:', event);
    }
  }

  /**
   * Solicitar contador de no leídas
   */
  requestUnreadCount() {
    this.send('notification:get-unread-count');
  }

  /**
   * Marcar notificación como leída
   */
  markAsRead(notificationId: string) {
    this.send('notification:read', { notificationId });
  }

  /**
   * Obtener estado de la conexión
   */
  getStatus() {
    return {
      connected: this.isConnected(),
      reconnectAttempts: this.reconnectAttempts,
      socketId: this.socket?.id,
    };
  }
}

// Singleton
const websocketClient = new WebSocketClient();
export default websocketClient;