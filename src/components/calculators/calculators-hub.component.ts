import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

import { PaDaCalculatorComponent } from '../calculator/calculator.component';
import { TsdCalculatorComponent } from './tsd-calculator/tsd-calculator.component';
import { FuelPlannerComponent } from './fuel-planner/fuel-planner.component';
import { TasCalculatorComponent } from './tas-calculator/tas-calculator.component';
import { WindComponentCalculatorComponent } from './wind-component-calculator/wind-component-calculator.component';
import { ConversionsCalculatorComponent } from './conversions-calculator/conversions-calculator.component';

type CalculatorId = 'pa-da' | 'tsd' | 'fuel' | 'tas' | 'wind' | 'conversions';

interface Calculator {
  id: CalculatorId;
  name: string;
}

@Component({
  selector: 'app-calculators-hub',
  templateUrl: './calculators-hub.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PaDaCalculatorComponent,
    TsdCalculatorComponent,
    FuelPlannerComponent,
    TasCalculatorComponent,
    WindComponentCalculatorComponent,
    ConversionsCalculatorComponent
  ]
})
export class CalculatorsHubComponent {
  calculators: Calculator[] = [
    { id: 'pa-da', name: 'Pressure & Density Altitude' },
    { id: 'tsd', name: 'Time, Speed, Distance' },
    { id: 'fuel', name: 'Fuel Planner' },
    { id: 'tas', name: 'True Airspeed (TAS)' },
    { id: 'wind', name: 'Wind Component' },
    { id: 'conversions', name: 'Conversions' },
  ];
  
  activeCalculator = signal<CalculatorId>('pa-da');

  setActiveCalculator(id: CalculatorId): void {
    this.activeCalculator.set(id);
  }
}