import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatorsHubComponent } from './calculators-hub.component';

describe('CalculatorsHubComponent', () => {
    let component: CalculatorsHubComponent;
    let fixture: ComponentFixture<CalculatorsHubComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CalculatorsHubComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CalculatorsHubComponent);
        component = fixture.componentInstance;
        // Set required input
        fixture.componentRef.setInput('activeCalculator', 'pa-da');
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show correct info for pa-da', () => {
        expect(component.calculatorInfo.title).toContain('Pressure & Density Altitude');
    });

    it('should update info when input changes', () => {
        fixture.componentRef.setInput('activeCalculator', 'fuel');
        fixture.detectChanges();
        expect(component.calculatorInfo.title).toContain('Fuel Planner');
    });
});
