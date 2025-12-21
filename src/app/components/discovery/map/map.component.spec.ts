import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapComponent } from './map.component';
import { DepartureAirport, Place } from '../models/place.model';

describe('MapComponent', () => {
    let component: MapComponent;
    let fixture: ComponentFixture<MapComponent>;

    const mockDeparture: DepartureAirport = {
        latitude: 39.0,
        longitude: -77.0,
        identifier: 'KTEST'
    };

    const mockDestination: Place = {
        name: 'Test Dest',
        description: 'Desc',
        type: 'Restaurant',
        airport_identifier: 'KDEST',
        latitude: 39.1,
        longitude: -77.1,
        distance_nm: 10
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MapComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MapComponent);
        component = fixture.componentInstance;

        // Set required inputs
        fixture.componentRef.setInput('departure', mockDeparture);
        fixture.componentRef.setInput('destination', mockDestination);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should calculate viewBox', () => {
        // Should be something like "-77.1...etc"
        const vb = component.viewBox();
        expect(vb).toBeTruthy();
        expect(vb.split(' ').length).toBe(4);
    });

    it('should calculate path', () => {
        const p = component.path();
        // M -77 39 L -77.1 39.1 (inverted Y in computed?)
        // In code: y: -latitude. 
        // Dep: y = -39. Dest: y = -39.1.
        // M -77 -39 L -77.1 -39.1
        expect(p).toContain('M -77 -39');
        expect(p).toContain('L -77.1 -39.1');
    });
});
