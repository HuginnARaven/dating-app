import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor() {
    this.createToastContainer()
  }

  private createToastContainer() {
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast toast-bottom toast-end';
      document.body.appendChild(container)
    }
  }

  private createToastElement(message: string, alertClass: string, duration = 5000) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.classList.add('alert', alertClass, 'shadow-lg', 'flex', 'flex-col');
    toast.innerHTML = `
    <div class="flex-row items-center justify-between w-full">
      <span>${message}</span>
      <button class="ml-4 btn btn-sm btn-ghost">✕</button>
    </div>
    <progress class="progress w-full" max="${duration}" value="0"></progress>
  `;

    const progress = toast.querySelector('progress') as HTMLProgressElement;

    toast.querySelector('button')?.addEventListener('click', () => {
      clearInterval(interval);
      if (toastContainer.contains(toast)) {
        toastContainer.removeChild(toast);
      }
    });

    toastContainer.append(toast);

    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      if (progress) progress.value = elapsed;

      if (elapsed >= duration) {
        clearInterval(interval);
        if (toastContainer.contains(toast)) {
          toastContainer.removeChild(toast);
        }
      }
    }, 50);
  }

  success(message: string, duration?: number) {
    this.createToastElement(message, 'alert-success', duration);
  }

  error(message: string, duration?: number) {
    this.createToastElement(message, 'alert-error', duration);
  }

  warning(message: string, duration?: number) {
    this.createToastElement(message, 'alert-warning', duration);
  }

  info(message: string, duration?: number) {
    this.createToastElement(message, 'alert-info', duration);
  }
}
