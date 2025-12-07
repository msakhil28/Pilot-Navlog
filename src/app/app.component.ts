import { Component, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { NavlogComponent } from './components/navlog/navlog.component';
import { CalculatorsHubComponent } from './components/calculators/calculators-hub.component';
import { DiscoveryHubComponent } from './components/discovery/discovery-hub/discovery-hub.component';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavlogComponent, CalculatorsHubComponent, DiscoveryHubComponent, TitleCasePipe]
})
export class AppComponent {
  activeView = signal<'navlog' | 'calculator' | 'discovery'>('calculator');
  currentUtcTime = signal<string>('');
  sidebarOpen = signal<boolean>(true);

  constructor() {
    // Update UTC time every second
    effect(() => {
      const updateTime = () => {
        const now = new Date();
        const hours = now.getUTCHours().toString().padStart(2, '0');
        const minutes = now.getUTCMinutes().toString().padStart(2, '0');
        this.currentUtcTime.set(`${hours}:${minutes}Z`);
      };

      updateTime();
      const interval = setInterval(updateTime, 1000);

      return () => clearInterval(interval);
    });
  }

  setView(view: 'navlog' | 'calculator' | 'discovery'): void {
    this.activeView.set(view);
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(open => !open);
  }
}