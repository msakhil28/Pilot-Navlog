import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fuel-planner',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './fuel-planner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuelPlannerComponent {
  cruiseBurn = signal(10); // gal/hr
  cruiseTime = signal(90); // minutes
  climbFuel = signal(3);   // gallons
  reserveTime = signal(45); // minutes

  cruiseFuel = computed(() => {
    const burnRate = this.cruiseBurn();
    const timeHours = this.cruiseTime() / 60;
    return burnRate * timeHours;
  });

  reserveFuel = computed(() => {
    const burnRate = this.cruiseBurn();
    const reserveHours = this.reserveTime() / 60;
    return burnRate * reserveHours;
  });

  totalFuel = computed(() => {
    return this.climbFuel() + this.cruiseFuel() + this.reserveFuel();
  });
}