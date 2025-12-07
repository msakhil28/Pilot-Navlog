import { Component, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { NavlogComponent } from './components/navlog/navlog.component';
import { CalculatorsHubComponent } from './components/calculators/calculators-hub.component';
import { DiscoveryHubComponent } from './components/discovery/discovery-hub/discovery-hub.component';
import { TitleCasePipe } from '@angular/common';

import { AdSenseComponent } from './features/ads/adsense.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavlogComponent, CalculatorsHubComponent, DiscoveryHubComponent, TitleCasePipe, AdSenseComponent]
})
export class AppComponent {
  activeView = signal<'navlog' | 'calculator' | 'discovery'>('calculator');
  currentUtcTime = signal<string>('');
  sidebarOpen = signal<boolean>(true);

  // Calculator management
  activeCalculator = signal<'pa-da' | 'tsd' | 'fuel' | 'tas' | 'wind' | 'conversions'>('pa-da');

  calculators = [
    { id: 'pa-da' as const, name: 'Pressure & Density Altitude', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'tsd' as const, name: 'Time, Speed, Distance', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'fuel' as const, name: 'Fuel Planner', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
    { id: 'tas' as const, name: 'True Airspeed', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'wind' as const, name: 'Wind Component', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a2.5 2.5 0 110 5H9m0-5v5m0-5a2.5 2.5 0 110-5H10.5M9 15h1.5a2.5 2.5 0 010 5H9m0-5v5' },
    { id: 'conversions' as const, name: 'Conversions', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' }
  ];

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

  setCalculator(id: 'pa-da' | 'tsd' | 'fuel' | 'tas' | 'wind' | 'conversions'): void {
    this.activeCalculator.set(id);
    this.setView('calculator');
  }
}