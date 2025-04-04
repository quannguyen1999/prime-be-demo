import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Client } from '@stomp/stompjs';
import { Task } from './task.service';
import { AuthService } from './auth.service';

// Add global object polyfill
declare global {
  interface Window {
    global: any;
  }
}
window.global = window;

export interface TaskEvent {
  type: 'create' | 'update' | 'delete';
  data: Task | string;  // Task for create/update, string (taskId) for delete
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client;
  private taskSubject = new Subject<TaskEvent>();
  private subscriptions: any[] = [];
  private isConnected = false;
  private currentProjectId: string | null = null;
  private connectionAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;

  taskEvents$ = this.taskSubject.asObservable();

  constructor(private authService: AuthService) {
    const token = localStorage.getItem('access_token');
    console.log('Initializing WebSocket with token:', token ? 'present' : 'missing');
    
    this.stompClient = new Client({
      brokerURL: 'ws://localhost:9000/project-service/ws',
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: function (str) {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectionTimeout: 10000
    });

    // Add more detailed logging for WebSocket lifecycle
    this.stompClient.onWebSocketClose = (event) => {
      console.log('WebSocket closed:', event);
      this.isConnected = false;
      this.handleConnectionError();
    };

    this.stompClient.onWebSocketError = (event) => {
      console.error('WebSocket error:', event);
      this.isConnected = false;
      this.handleConnectionError();
    };

    this.stompClient.onStompError = (frame) => {
      console.error('STOMP error:', frame);
      this.isConnected = false;
      this.handleConnectionError();
    };

    this.stompClient.onDisconnect = (frame) => {
      console.log('STOMP disconnected:', frame);
      this.isConnected = false;
      this.handleConnectionError();
    };
  }

  connectToProject(projectId: string) {
    if (this.currentProjectId === projectId && this.isConnected) {
      console.log('Already connected to WebSocket for this project');
      return;
    }

    // Reset connection attempts for new project
    if (this.currentProjectId !== projectId) {
      this.connectionAttempts = 0;
    }

    // Disconnect from previous connection if exists
    if (this.isConnected) {
      this.disconnect();
    }

    this.currentProjectId = projectId;

    this.stompClient.onConnect = (frame) => {
      console.log('Connected to WebSocket', frame);
      this.isConnected = true;
      this.connectionAttempts = 0; // Reset attempts on successful connection
      this.subscribeToProjectEvents(projectId);
    };

    try {
      console.log('Attempting to connect to WebSocket...');
      this.stompClient.activate();
    } catch (error) {
      console.error('Failed to activate WebSocket connection:', error);
      this.handleConnectionError();
    }
  }

  private handleConnectionError() {
    // Clear existing subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];

    // Increment connection attempts
    this.connectionAttempts++;

    // Only attempt to reconnect if we haven't exceeded max attempts
    if (this.connectionAttempts <= this.MAX_RECONNECT_ATTEMPTS && this.currentProjectId) {
      console.log(`Attempting to reconnect (attempt ${this.connectionAttempts}/${this.MAX_RECONNECT_ATTEMPTS})...`);
      setTimeout(() => {
        this.connectToProject(this.currentProjectId!);
      }, 5000);
    } else if (this.connectionAttempts > this.MAX_RECONNECT_ATTEMPTS) {
      console.error('Max reconnection attempts reached. Please refresh the page to try again.');
    }
  }

  private subscribeToProjectEvents(projectId: string) {
    if (!this.stompClient.connected) {
      console.error('Cannot subscribe: WebSocket is not connected');
      return;
    }

    // Unsubscribe from existing subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];

    const subscribeWithRetry = (destination: string, callback: (message: any) => void) => {
      try {
        const subscription = this.stompClient.subscribe(destination, callback);
        this.subscriptions.push(subscription);
        console.log(`Subscribed to ${destination}`);
      } catch (error) {
        console.error(`Failed to subscribe to ${destination}:`, error);
      }
    };

    // Subscribe to task creation
    subscribeWithRetry(
      `/topic/projects/${projectId}/tasks/create`,
      (message) => {
        try {
          const task = JSON.parse(message.body);
          console.log('Received task creation event:', task);
          this.taskSubject.next({ type: 'create', data: task });
        } catch (error) {
          console.error('Error parsing task creation message:', error);
        }
      }
    );

    // Subscribe to task updates
    subscribeWithRetry(
      `/topic/projects/${projectId}/tasks/update`,
      (message) => {
        try {
          const task = JSON.parse(message.body);
          console.log('Received task update event:', task);
          this.taskSubject.next({ type: 'update', data: task });
        } catch (error) {
          console.error('Error parsing task update message:', error);
        }
      }
    );

    // Subscribe to task deletion
    subscribeWithRetry(
      `/topic/projects/${projectId}/tasks/delete`,
      (message) => {
        try {
          const taskId = message.body;
          console.log('Received task deletion event:', taskId);
          this.taskSubject.next({ type: 'delete', data: taskId });
        } catch (error) {
          console.error('Error parsing task deletion message:', error);
        }
      }
    );
  }

  disconnect() {
    if (this.stompClient.connected) {
      console.log('Disconnecting from WebSocket...');
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
      this.stompClient.deactivate();
      this.isConnected = false;
      this.currentProjectId = null;
      this.connectionAttempts = 0;
    }
  }
} 