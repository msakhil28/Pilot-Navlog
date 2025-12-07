import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-tas-calculator',
  imports: [FormsModule, DecimalPipe],
  templateUrl: './tas-calculator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasCalculatorComponent {
  ias = signal(120);
  pressureAltitude = signal(8000);
  oatCelsius = signal(-5);

  tas = computed(() => {
    const ias = this.ias();
    const pa = this.pressureAltitude();
    const oat = this.oatCelsius();

    // Standard atmosphere temperature in Kelvin at sea level
    const T0 = 288.15; // 15°C
    // Standard pressure at sea level in hPa
    const P0 = 1013.25;
    // Temperature lapse rate in K/m
    const L = 0.0065;
    // Gas constant for dry air in J/(kg·K)
    const R = 287.058;
    // Acceleration due to gravity in m/s^2
    const g = 9.80665;

    const paMeters = pa * 0.3048;
    const T = (oat + 273.15); // OAT in Kelvin

    // Density at altitude (rho)
    const P = P0 * Math.pow(1 - (L * paMeters) / T0, (g * 0.0289644) / (R * L));
    const rho = P / (R * (oat + 273.15));

    // Density at sea level (rho0)
    const rho0 = P0 / (R * T0);

    // TAS = EAS * sqrt(rho0 / rho). Assuming IAS is close to EAS at lower speeds.
    const tasValue = ias * Math.sqrt(rho0 / rho);

    return tasValue || 0;
  });
}