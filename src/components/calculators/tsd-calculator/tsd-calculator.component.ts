import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tsd-calculator',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tsd-calculator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TsdCalculatorComponent {
  mode = signal<'time' | 'speed' | 'distance'>('time');
  time = signal(60);
  speed = signal(100);
  distance = signal(100);

  result = computed(() => {
    const t = this.time();
    const s = this.speed();
    const d = this.distance();

    switch (this.mode()) {
      case 'time':
        if (s > 0) {
          const timeMinutes = (d / s) * 60;
          return `${timeMinutes.toFixed(0)} min`;
        }
        return 'N/A';
      case 'speed':
        if (t > 0) {
          const speedKts = (d / (t / 60));
          return `${speedKts.toFixed(0)} kts`;
        }
        return 'N/A';
      case 'distance':
        const distanceNm = s * (t / 60);
        return `${distanceNm.toFixed(0)} nm`;
    }
  });
}