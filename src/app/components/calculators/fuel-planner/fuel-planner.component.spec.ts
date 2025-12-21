import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FuelPlannerComponent } from './fuel-planner.component';

describe('FuelPlannerComponent', () => {
    let component: FuelPlannerComponent;
    let fixture: ComponentFixture<FuelPlannerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FuelPlannerComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FuelPlannerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should calculate cruise fuel', () => {
        // 10 gal/hr for 90 mins (1.5h) -> 15 gals
        component.cruiseBurn.set(10);
        component.cruiseTime.set(90);
        expect(component.cruiseFuel()).toBe(15);
    });

    it('should calculate reserve fuel', () => {
        // 10 gal/hr for 45 mins (0.75h) -> 7.5 gals
        component.cruiseBurn.set(10);
        component.reserveTime.set(45);
        expect(component.reserveFuel()).toBe(7.5);
    });

    it('should calculate total fuel', () => {
        // 3 (climb) + 15 (cruise) + 7.5 (reserve) = 25.5
        component.climbFuel.set(3);
        component.cruiseBurn.set(10);
        component.cruiseTime.set(90);
        component.reserveTime.set(45);
        expect(component.totalFuel()).toBe(25.5);
    });
});
