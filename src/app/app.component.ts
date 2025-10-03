import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { NavlogComponent } from './components/navlog/navlog.component';
import { CalculatorsHubComponent } from './components/calculators/calculators-hub.component';
import { DiscoveryHubComponent } from './components/discovery/discovery-hub/discovery-hub.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NavlogComponent, CalculatorsHubComponent, DiscoveryHubComponent]
})
export class AppComponent {
  activeView = signal<'navlog' | 'calculator' | 'discovery'>('calculator');

  setView(view: 'navlog' | 'calculator' | 'discovery'): void {
    this.activeView.set(view);
  }
}