import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-pa-da-calculator',
  imports: [FormsModule, DecimalPipe],
  templateUrl: './calculator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaDaCalculatorComponent {
  fieldElevation = signal(0);
  altimeterSetting = signal(29.92);
  oatCelsius = signal(15);

  pressureAltitude = computed(() => {
    const elevation = this.fieldElevation();
    const altimeter = this.altimeterSetting();
    // Formula: PA = (Standard Pressure - Altimeter Setting) * 1000 + Field Elevation
    return Math.round((29.92 - altimeter) * 1000 + elevation);
  });

  densityAltitude = computed(() => {
    const pa = this.pressureAltitude();
    const oat = this.oatCelsius();
    // Standard temp at PA: ISA = 15°C - (2°C per 1000ft * PA in thousands of feet)
    const isaTemp = 15 - (pa / 1000) * 1.98; // Using 1.98 for more precision
    // DA = PA + 120 * (OAT - ISA)
    return Math.round(pa + 120 * (oat - isaTemp));
  });
}