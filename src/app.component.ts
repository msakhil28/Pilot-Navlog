import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { NavlogComponent } from './components/navlog/navlog.component';
import { CalculatorsHubComponent } from './components/calculators/calculators-hub.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavlogComponent, CalculatorsHubComponent]
})
export class AppComponent {
  activeView = signal<'navlog' | 'calculator'>('navlog');

  setView(view: 'navlog' | 'calculator'): void {
    this.activeView.set(view);
  }
}