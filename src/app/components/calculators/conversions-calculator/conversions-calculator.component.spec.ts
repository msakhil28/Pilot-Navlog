import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConversionsCalculatorComponent } from './conversions-calculator.component';

describe('ConversionsCalculatorComponent', () => {
    let component: ConversionsCalculatorComponent;
    let fixture: ComponentFixture<ConversionsCalculatorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConversionsCalculatorComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ConversionsCalculatorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should convert Celsius to Fahrenheit', () => {
        component.onCelsiusChange(0);
        expect(component.fahrenheit()).toBe(32);

        component.onCelsiusChange(100);
        expect(component.fahrenheit()).toBe(212);
    });

    it('should convert Nautical Miles to Statute Miles', () => {
        component.onNmChange(1);
        expect(component.statuteMiles()).toBe(1.15); // 1.15078 rounded to 2
    });

    it('should handle null inputs', () => {
        component.onCelsiusChange(null);
        expect(component.fahrenheit()).toBeNull();
    });
});
