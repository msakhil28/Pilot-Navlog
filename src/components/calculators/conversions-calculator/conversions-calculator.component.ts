import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-conversions-calculator',
  imports: [FormsModule],
  templateUrl: './conversions-calculator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversionsCalculatorComponent {
  // Temperature
  celsius = signal<number | null>(null);
  fahrenheit = signal<number | null>(null);

  // Speed
  knots = signal<number | null>(null);
  mph = signal<number | null>(null);

  // Distance
  nauticalMiles = signal<number | null>(null);
  statuteMiles = signal<number | null>(null);

  // Pressure
  inHg = signal<number | null>(null);
  hPa = signal<number | null>(null);
  
  // Length
  feet = signal<number | null>(null);
  meters = signal<number | null>(null);

  private isUpdating = false;

  onCelsiusChange(value: number | null) {
    if (this.isUpdating) return;
    this.isUpdating = true;
    this.celsius.set(value);
    if (value === null) {
      this.fahrenheit.set(null);
    } else {
      this.fahrenheit.set(Number(((value * 9/5) + 32).toFixed(2)));
    }
    this.isUpdating = false;
  }

  onFahrenheitChange(value: number | null) {
    if (this.isUpdating) return;
    this.isUpdating = true;
    this.fahrenheit.set(value);
    if (value === null) {
      this.celsius.set(null);
    } else {
      this.celsius.set(Number(((value - 32) * 5/9).toFixed(2)));
    }
    this.isUpdating = false;
  }

  onKnotsChange(value: number | null) {
    if (this.isUpdating) return;
    this.isUpdating = true;
    this.knots.set(value);
    if (value === null) {
      this.mph.set(null);
    } else {
      this.mph.set(Number((value * 1.15078).toFixed(2)));
    }
    this.isUpdating = false;
  }

  onMphChange(value: number | null) {
    if (this.isUpdating) return;
    this.isUpdating = true;
    this.mph.set(value);
    if (value === null) {
      this.knots.set(null);
    } else {
      this.knots.set(Number((value / 1.15078).toFixed(2)));
    }
    this.isUpdating = false;
  }
  
  onNmChange(value: number | null) {
    if (this.isUpdating) return;
    this.isUpdating = true;
    this.nauticalMiles.set(value);
    if (value === null) {
      this.statuteMiles.set(null);
    } else {
      this.statuteMiles.set(Number((value * 1.15078).toFixed(2)));
    }
    this.isUpdating = false;
  }

  onSmChange(value: number | null) {
    if (this.isUpdating) return;
    this.isUpdating = true;
    this.statuteMiles.set(value);
    if (value === null) {
      this.nauticalMiles.set(null);
    } else {
      this.nauticalMiles.set(Number((value / 1.15078).toFixed(2)));
    }
    this.isUpdating = false;
  }

  onInHgChange(value: number | null) {
    if (this.isUpdating) return;
    this.isUpdating = true;
    this.inHg.set(value);
    if (value === null) {
      this.hPa.set(null);
    } else {
      this.hPa.set(Number((value * 33.8639).toFixed(2)));
    }
    this.isUpdating = false;
  }
  
  onHpaChange(value: number | null) {
    if (this.isUpdating) return;
    this.isUpdating = true;
    this.hPa.set(value);
    if (value === null) {
      this.inHg.set(null);
    } else {
      this.inHg.set(Number((value / 33.8639).toFixed(2)));
    }
    this.isUpdating = false;
  }
  
  onFeetChange(value: number | null) {
    if (this.isUpdating) return;
    this.isUpdating = true;
    this.feet.set(value);
    if (value === null) {
      this.meters.set(null);
    } else {
      this.meters.set(Number((value * 0.3048).toFixed(2)));
    }
    this.isUpdating = false;
  }

  onMetersChange(value: number | null) {
    if (this.isUpdating) return;
    this.isUpdating = true;
    this.meters.set(value);
    if (value === null) {
      this.feet.set(null);
    } else {
      this.feet.set(Number((value / 0.3048).toFixed(2)));
    }
    this.isUpdating = false;
  }
}