import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaceDetailComponent } from './place-detail.component';
import { GeminiService } from '../services/gemini.service';
import { Place } from '../models/place.model';

describe('PlaceDetailComponent', () => {
    let component: PlaceDetailComponent;
    let fixture: ComponentFixture<PlaceDetailComponent>;
    let geminiServiceSpy: jasmine.SpyObj<GeminiService>;

    const mockPlace: Place = {
        name: 'Test Place',
        description: 'Desc',
        type: 'Restaurant',
        airport_identifier: 'KTEST',
        latitude: 0,
        longitude: 0,
        distance_nm: 10
    };

    beforeEach(async () => {
        geminiServiceSpy = jasmine.createSpyObj('GeminiService', ['generatePlaceImage', 'getAirportDetails']);
        geminiServiceSpy.generatePlaceImage.and.resolveTo('http://example.com/image.jpg');
        geminiServiceSpy.getAirportDetails.and.resolveTo({
            identifier: 'KTEST',
            name: 'Test Airport',

            runways: [],
            frequencies: [],
            services: []
        });

        await TestBed.configureTestingModule({
            imports: [PlaceDetailComponent],
            providers: [
                { provide: GeminiService, useValue: geminiServiceSpy }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PlaceDetailComponent);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('place', mockPlace);
        fixture.componentRef.setInput('departureAirport', null);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load data on init', async () => {
        // ngOnInit calls loadData which calls service methods
        // Since loadData is async, we need to wait
        await fixture.whenStable();

        expect(geminiServiceSpy.generatePlaceImage).toHaveBeenCalledWith(mockPlace);
        expect(geminiServiceSpy.getAirportDetails).toHaveBeenCalledWith('KTEST');

        expect(component.imageUrl()).toBe('http://example.com/image.jpg');
        expect(component.airportDetails()?.name).toBe('Test Airport');
    });

    it('should emit close on backdrop click', () => {
        let closed = false;
        component.close.subscribe(() => closed = true);

        // Simulate backdrop click (the host element itself in the template structure likely acts as container)
        // Looking at template is risky without viewing it, but usually backdrop is the outer div.
        // The component TS says: if event.target === event.currentTarget

        const event = {
            target: {},
            currentTarget: {}
        };
        event.target = event.currentTarget; // Simulate clicking direct element

        component.onBackdropClick(event as any);
        expect(closed).toBe(true);
    });
});
