import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-runway-wind-calculator',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './runway-wind-calculator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RunwayWindCalculatorComponent {
  runwayHeading = signal(100);
  windDirection = signal(310);
  windSpeed = signal(25);

  runwayNumber = computed(() => {
    const heading = this.runwayHeading();
    if (heading === 0 || heading === 360) return 36;
    return Math.round(heading / 10);
  });
  
  reciprocalRunwayHeading = computed(() => {
    const reciprocal = this.runwayHeading() + 180;
    return reciprocal > 360 ? reciprocal - 360 : reciprocal;
  });

  reciprocalRunwayNumber = computed(() => {
    const heading = this.reciprocalRunwayHeading();
     if (heading === 0 || heading === 360) return 36;
    return Math.round(heading / 10);
  });

  private calculateComponents(runwayHdg: number) {
    if (this.windSpeed() === 0) {
      return { headwind: 0, headwindType: 'headwind', crosswind: 0, crosswindDirection: '' };
    }
    
    const windDir = this.windDirection();
    const windSpd = this.windSpeed();
    
    const windAngle = windDir - runwayHdg;
    const windAngleRad = windAngle * (Math.PI / 180);

    const headwind = windSpd * Math.cos(windAngleRad);
    const crosswind = windSpd * Math.sin(windAngleRad);
    
    let crosswindDirection = '';
    if (Math.abs(crosswind) > 0.5) {
        crosswindDirection = crosswind > 0 ? 'from right' : 'from left';
    }

    return {
      headwind: Math.abs(headwind),
      headwindType: headwind >= 0 ? 'headwind' : 'tailwind',
      crosswind: Math.abs(crosswind),
      crosswindDirection: crosswindDirection
    };
  }
  
  runway1Components = computed(() => this.calculateComponents(this.runwayHeading()));
  runway2Components = computed(() => this.calculateComponents(this.reciprocalRunwayHeading()));
  
  incrementSpeed(): void {
    this.windSpeed.update(s => s + 1);
  }

  decrementSpeed(): void {
    this.windSpeed.update(s => Math.max(0, s - 1));
  }
}
