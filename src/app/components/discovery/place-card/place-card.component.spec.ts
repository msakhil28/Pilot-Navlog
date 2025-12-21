import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaceCardComponent } from './place-card.component';
import { Place } from '../models/place.model';

describe('PlaceCardComponent', () => {
    let component: PlaceCardComponent;
    let fixture: ComponentFixture<PlaceCardComponent>;

    const mockPlace: Place = {
        name: 'Test Place',
        description: 'A test place',
        type: 'Restaurant',
        airport_identifier: 'KTEST',
        latitude: 0,
        longitude: 0,
        distance_nm: 10
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PlaceCardComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PlaceCardComponent);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('place', mockPlace);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should apply correct color class for Restaurant', () => {
        // Restaurant -> bg-amber-500/10
        expect(component.typeColorClass).toContain('amber');
    });

    it('should emit select event on click', () => {
        let emitted: Place | undefined;
        component.select.subscribe(p => emitted = p);

        const el = fixture.nativeElement as HTMLElement;
        el.click();

        expect(emitted).toBe(mockPlace);
    });
});
