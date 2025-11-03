import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private router = inject(Router)

  constructor() {
    this.createToastContainer()
  }

  private createToastContainer() {
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast toast-bottom toast-end z-50';
      document.body.appendChild(container)
    }
  }

  private createToastElement(message: string, alertClass: string, duration = 5000, avatar?: string, route?: string) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.classList.add('alert', alertClass, 'shadow-lg', 'flex', 'flex-col');
    
    if (route){
      toast.classList.add('cursor-pointer')
      toast.addEventListener('click', () => this.router.navigateByUrl(route))
    }

    toast.innerHTML = `
    <div class="flex flex-row items-center justify-between w-full gap-3">
      ${avatar ? `<img src=${avatar || '/user.png'} class="w-10 h-10 rounded">` : ''}
      <span>${message}</span>
      ${ route ? '' : '<button class="ml-4 btn btn-sm btn-ghost">✕</button>'}
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

  success(message: string, duration?: number, avatar?: string, route?: string) {
    this.createToastElement(message, 'alert-success', duration, avatar, route);
  }

  error(message: string, duration?: number, avatar?: string, route?: string) {
    this.createToastElement(message, 'alert-error', duration, avatar, route);
  }

  warning(message: string, duration?: number, avatar?: string, route?: string) {
    this.createToastElement(message, 'alert-warning', duration, avatar, route);
  }

  info(message: string, duration?: number, avatar?: string, route?: string) {
    this.createToastElement(message, 'alert-info', duration, avatar, route);
  }
}
