import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TsdCalculatorComponent } from './tsd-calculator.component';

describe('TsdCalculatorComponent', () => {
    let component: TsdCalculatorComponent;
    let fixture: ComponentFixture<TsdCalculatorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TsdCalculatorComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TsdCalculatorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should calculate time', () => {
        component.mode.set('time');
        component.speed.set(100);
        component.distance.set(50);
        // 50nm / 100kts = 0.5hr = 30min
        expect(component.result()).toBe('30 min');
    });

    it('should calculate speed', () => {
        component.mode.set('speed');
        component.distance.set(100);
        component.time.set(60);
        // 100nm / 1hr = 100kts
        expect(component.result()).toBe('100 kts');
    });

    it('should calculate distance', () => {
        component.mode.set('distance');
        component.speed.set(100);
        component.time.set(30);
        // 100kts * 0.5hr = 50nm
        expect(component.result()).toBe('50 nm');
    });
});
