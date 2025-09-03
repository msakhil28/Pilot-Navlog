import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-wind-component-calculator',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './wind-component-calculator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WindComponentCalculatorComponent {
  course = signal(270);
  windDirection = signal(300);
  windSpeed = signal(15);

  windAngle = computed(() => {
    const angle = this.windDirection() - this.course();
    return angle;
  });

  private windAngleRadians = computed(() => {
    return this.windAngle() * (Math.PI / 180);
  });

  headwind = computed(() => {
    // Cosine gives the component parallel to the course. Positive is headwind.
    return this.windSpeed() * Math.cos(this.windAngleRadians());
  });

  private rawCrosswind = computed(() => {
    // Sine gives the component perpendicular to the course.
    return this.windSpeed() * Math.sin(this.windAngleRadians());
  });

  crosswind = computed(() => {
    return Math.abs(this.rawCrosswind());
  });

  crosswindDirection = computed(() => {
    const cw = this.rawCrosswind();
    if (Math.abs(cw) < 0.1) return 'No Crosswind';
    return cw > 0 ? 'From Right' : 'From Left';
  });
}