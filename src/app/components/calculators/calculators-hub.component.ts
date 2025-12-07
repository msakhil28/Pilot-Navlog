import { Component, ChangeDetectionStrategy, input } from '@angular/core';

import { PaDaCalculatorComponent } from '../calculator/calculator.component';
import { TsdCalculatorComponent } from './tsd-calculator/tsd-calculator.component';
import { FuelPlannerComponent } from './fuel-planner/fuel-planner.component';
import { TasCalculatorComponent } from './tas-calculator/tas-calculator.component';
import { WindComponentCalculatorComponent } from './wind-component-calculator/wind-component-calculator.component';
import { ConversionsCalculatorComponent } from './conversions-calculator/conversions-calculator.component';

type CalculatorId = 'pa-da' | 'tsd' | 'fuel' | 'tas' | 'wind' | 'conversions';

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
  activeCalculator = input.required<CalculatorId>();
}