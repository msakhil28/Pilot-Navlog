import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-wind-component-calculator',
  imports: [FormsModule, DecimalPipe],
  templateUrl: './wind-component-calculator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WindComponentCalculatorComponent {
  course = signal(270);
  windDirection = signal(300);
  windSpeed = signal(15);

  windAngle = computed(() => {
    return this.windDirection() - this.course();
  });

  private windAngleRadians = computed(() => {
    return this.windAngle() * (Math.PI / 180);
  });

  headwind = computed(() => {
    return this.windSpeed() * Math.cos(this.windAngleRadians());
  });

  private rawCrosswind = computed(() => {
    return this.windSpeed() * Math.sin(this.windAngleRadians());
  });

  crosswind = computed(() => {
    return Math.abs(this.rawCrosswind());
  });

  crosswindDirection = computed(() => {
    const cw = this.rawCrosswind();
    if (Math.abs(cw) < 0.1) return 'Direct';
    return cw > 0 ? 'Right' : 'Left';
  });

  // Visual Rotations
  runwayRotation = computed(() => `rotate(${this.course()}deg)`);
  windRotation = computed(() => `rotate(${this.windDirection()}deg)`);
}