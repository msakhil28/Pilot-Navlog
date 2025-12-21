import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasCalculatorComponent } from './tas-calculator.component';

describe('TasCalculatorComponent', () => {
    let component: TasCalculatorComponent;
    let fixture: ComponentFixture<TasCalculatorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TasCalculatorComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TasCalculatorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should calculate TAS', () => {
        // Sea level, standard day: TAS ~= IAS
        component.ias.set(100);
        component.pressureAltitude.set(0);
        component.oatCelsius.set(15);

        // allow small floating point diffs
        expect(component.tas()).toBeCloseTo(100, 0);

        // 10,000 ft, standard temp approx -5C?
        // Rule of thumb: +2% per 1000ft -> +20% -> 120 kts
        component.pressureAltitude.set(10000);
        // Standard temp at 10000 is 15 - 20 = -5C
        component.oatCelsius.set(-5);

        const tas = component.tas();
        expect(tas).toBeGreaterThan(115);
        expect(tas).toBeLessThan(125);
    });
});
