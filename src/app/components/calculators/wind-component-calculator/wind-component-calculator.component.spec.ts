import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WindComponentCalculatorComponent } from './wind-component-calculator.component';

describe('WindComponentCalculatorComponent', () => {
    let component: WindComponentCalculatorComponent;
    let fixture: ComponentFixture<WindComponentCalculatorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WindComponentCalculatorComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(WindComponentCalculatorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should calculate headwind and crosswind correctly', () => {
        // Runway 36 (360), Wind 030 @ 20kts
        // Angle = 30
        // Headwind = 20 * cos(30) = 20 * 0.866 = 17.3
        // Crosswind = 20 * sin(30) = 20 * 0.5 = 10

        component.course.set(360);
        component.windDirection.set(30);
        component.windSpeed.set(20);

        expect(component.headwind()).toBeCloseTo(17.3, 1);
        expect(component.crosswind()).toBeCloseTo(10, 1);
        expect(component.crosswindDirection()).toBe('Right');
    });

    it('should identify direct crosswind', () => {
        component.course.set(360);
        component.windDirection.set(360);
        component.windSpeed.set(10);
        expect(component.crosswind()).toBe(0);
        expect(component.crosswindDirection()).toBe('Direct');
    });
});
