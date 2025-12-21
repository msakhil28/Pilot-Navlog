import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaDaCalculatorComponent } from './calculator.component';

describe('PaDaCalculatorComponent', () => {
    let component: PaDaCalculatorComponent;
    let fixture: ComponentFixture<PaDaCalculatorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PaDaCalculatorComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PaDaCalculatorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should calculate pressure altitude', () => {
        // Standard day: 29.92, 0 elevation -> 0 PA
        component.altimeterSetting.set(29.92);
        component.fieldElevation.set(0);
        expect(component.pressureAltitude()).toBe(0);

        // Non-standard: 29.82 (-0.1 * 1000 = +100ft PA), 1000 elev -> 1100 PA
        component.altimeterSetting.set(29.82);
        component.fieldElevation.set(1000);
        expect(component.pressureAltitude()).toBe(1100);
    });

    it('should calculate density altitude', () => {
        // Standard day at 0 ft: 15C -> 0 DA
        component.altimeterSetting.set(29.92);
        component.fieldElevation.set(0);
        component.oatCelsius.set(15);
        expect(component.densityAltitude()).toBe(0);

        // Hot day: 0 ft, 35C (ISA+20) -> should be approx 120 * 20 = 2400 ft DA
        component.oatCelsius.set(35);
        // Formula check: dA = pA + 120 * (OAT - ISA)
        // pA=0, OAT=35, ISA=15 -> 0 + 120 * 20 = 2400
        expect(component.densityAltitude()).toBe(2400);
    });
});
