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

  get calculatorInfo() {
    const id = this.activeCalculator();
    switch (id) {
      case 'pa-da':
        return {
          title: 'Pressure & Density Altitude',
          description: 'Calculate precision altitude data for safe takeoff and climb performance.',
          content: `
            <h3 class="text-white font-bold mb-2">Why Density Altitude Matters</h3>
            <p class="mb-4">Density altitude is properly defined as "pressure altitude corrected for non-standard temperature." In simpler terms, it's the altitude at which the airplane "feels" like it's flying.</p>
            <p class="mb-4">On a hot and humid day, the air is less dense. This reduces lift produced by the wings, decreases engine power output, and reduces propeller efficiency. The result is a triple penalty on aircraft performance: longer takeoff rolls and reduced rates of climb.</p>
            <h3 class="text-white font-bold mb-2">How to Use</h3>
            <p>Enter your local Altimeter Setting (inHg), Elevation (ft), and Temperature (°C). The calculator will instantly derive the Pressure Altitude and Density Altitude. Always assume the worst-case scenario when planning takeoffs at high-altitude airports.</p>
          `
        };
      case 'tsd':
        return {
          title: 'Time, Speed, & Distance',
          description: 'The fundamental aviation equation: Distance = Rate × Time.',
          content: `
            <h3 class="text-white font-bold mb-2">The Navigation Triangle</h3>
            <p class="mb-4">Time, Speed, and Distance are the three variables that ground every flight plan. Verification of ground speed (GS) in flight is critical to ensure you have sufficient fuel to reach your destination.</p>
            <h3 class="text-white font-bold mb-2">Formulas</h3>
            <ul class="list-disc pl-5 space-y-1 mb-4">
              <li><strong>Time:</strong> Distance ÷ Speed</li>
              <li><strong>Speed:</strong> Distance ÷ Time</li>
              <li><strong>Distance:</strong> Speed × Time</li>
            </ul>
            <p>Use this tool to cross-check your flight plan leg values or update your estimated time of arrival (ETA) while enroute.</p>
          `
        };
      case 'fuel':
        return {
          title: 'Fuel Planner',
          description: 'Estimate fuel requirements based on burn rate and flight time.',
          content: `
            <h3 class="text-white font-bold mb-2">Fuel Management</h3>
            <p class="mb-4">Fuel exhaustion is a leading cause of general aviation accidents. Regulations (FAR 91.151) require specific fuel reserves for VFR flight (30 minutes day, 45 minutes night). However, personal minimums should often exceed these regulatory baselines.</p>
            <p>This calculator helps you determine exactly how much fuel is required for a given leg or the entire trip based on your aircraft's Gallons Per Hour (GPH) performance.</p>
          `
        };
      case 'tas':
        return {
          title: 'True Airspeed (TAS)',
          description: 'Correct Indicated Airspeed (IAS) for altitude and temperature.',
          content: `
            <h3 class="text-white font-bold mb-2">IAS vs. TAS</h3>
            <p class="mb-4">The airspeed indicator in the cockpit measures dynamic pressure (Indicated Airspeed or IAS). However, as you climb, air density generates less pressure for the same true speed through the air.</p>
            <p class="mb-4"><strong>True Airspeed (TAS)</strong> is the actual speed of the aircraft relative to the airmass. It is essential for flight planning because it is the baseline for calculating Ground Speed (GS).</p>
            <p>Rule of Thumb: TAS increases by roughly 2% for every 1,000 feet of altitude gain.</p>
          `
        };
      case 'wind':
        return {
          title: 'Wind Component',
          description: 'Analyze crosswind and headwind vectors for takeoff and landing.',
          content: `
            <h3 class="text-white font-bold mb-2">Crosswind Limits</h3>
            <p class="mb-4">Every aircraft has a "Maximum Demonstrated Crosswind Component." While not always a regulatory limitation, it represents the limit at which the test pilot could safely control the aircraft. Exceeding this value significantly increases the risk of a runway excursion.</p>
            <h3 class="text-white font-bold mb-2">Visualizing the Vector</h3>
            <p>This tool breaks down the wind relative to the runway heading into two orthogonal components: Headwind (or Tailwind) and Crosswind. A strong headwind is beneficial for takeoff performance, while a tailwind is detrimental.</p>
          `
        };
      case 'conversions':
        return {
          title: 'Aviation Conversions',
          description: 'Quickly convert between standard aviation units.',
          content: `
            <h3 class="text-white font-bold mb-2">Common Aviation Units</h3>
            <p class="mb-4">Aviation is unique in its mix of units: distances in Nautical Miles (NM), speeds in Knots (kts), altitudes in Feet (ft), and fuel often in Gallons or Liters depending on the region.</p>
            <p>Using the correct units is vital for safety. A "liter" of fuel is roughly 1/4 of a gallon, a mistake that could lead to critically low fuel states if miscalculated.</p>
          `
        };
      default:
        return {
          title: 'Calculator',
          description: 'Aviation calculation tool.',
          content: '<p>Select a calculator to begin.</p>'
        };
    }
  }
}