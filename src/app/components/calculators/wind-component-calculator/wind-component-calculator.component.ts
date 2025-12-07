import { Component, ChangeDetectionStrategy, signal, computed, ElementRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-wind-component-calculator',
  imports: [FormsModule, DecimalPipe],
  templateUrl: './wind-component-calculator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WindComponentCalculatorComponent {
  private elementRef = inject(ElementRef);

  course = signal(270);
  windDirection = signal(300);
  windSpeed = signal(15);

  selectedElement = signal<'runway' | 'wind'>('runway');
  private isDragging = false;

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

  selectElement(element: 'runway' | 'wind'): void {
    this.selectedElement.set(element);
  }

  // Unified Drag Handler
  onDragStart(event: MouseEvent | TouchEvent): void {
    event.preventDefault();
    this.isDragging = true;

    // Initial update
    this.handleDragMove(event);

    const moveHandler = (e: MouseEvent | TouchEvent) => {
      if (this.isDragging) {
        this.handleDragMove(e);
      }
    };

    const endHandler = () => {
      this.isDragging = false;
      document.removeEventListener('mousemove', moveHandler as any);
      document.removeEventListener('mouseup', endHandler);
      document.removeEventListener('touchmove', moveHandler as any);
      document.removeEventListener('touchend', endHandler);
    };

    document.addEventListener('mousemove', moveHandler as any);
    document.addEventListener('mouseup', endHandler);
    document.addEventListener('touchmove', moveHandler as any);
    document.addEventListener('touchend', endHandler);
  }

  private handleDragMove(event: MouseEvent | TouchEvent): void {
    if (this.selectedElement() === 'runway') {
      this.updateRunwayAngle(event);
    } else {
      this.updateWindAngle(event);
    }
  }

  private updateRunwayAngle(event: MouseEvent | TouchEvent): void {
    const svg = this.elementRef.nativeElement.querySelector('svg');
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

    const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    const normalizedAngle = (angle + 90 + 360) % 360;

    this.course.set(Math.round(normalizedAngle));
  }

  private updateWindAngle(event: MouseEvent | TouchEvent): void {
    const svg = this.elementRef.nativeElement.querySelector('svg');
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

    const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    const normalizedAngle = (angle + 90 + 360) % 360;

    this.windDirection.set(Math.round(normalizedAngle));
  }
}