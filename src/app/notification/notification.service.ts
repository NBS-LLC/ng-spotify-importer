import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private timeoutSec = 5;
  private message = '';
  private messageType = 'info';

  constructor() {}

  public error(message: string) {
    this.messageType = 'error';
    this.setMessage(message);
  }

  public success(message: string) {
    this.messageType = 'success';
    this.setMessage(message);
  }

  public info(message: string) {
    this.messageType = 'info';
    this.setMessage(message);
  }

  public setMessage(message: string) {
    this.message = message;
    setTimeout(() => this.reset(), this.timeoutSec * 1000);
  }

  public getMessage(): string {
    return this.message;
  }

  public hasMessage() {
    return this.getMessage().length > 0;
  }

  public reset() {
    this.message = '';
    this.messageType = 'info';
  }

  public setTimeout(seconds: number) {
    this.timeoutSec = seconds;
  }

  public getMessageType() {
    return this.messageType;
  }
}
