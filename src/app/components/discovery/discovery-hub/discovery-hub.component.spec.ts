import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiscoveryHubComponent } from './discovery-hub.component';
import { GeminiService } from '../services/gemini.service';

describe('DiscoveryHubComponent', () => {
  let component: DiscoveryHubComponent;
  let fixture: ComponentFixture<DiscoveryHubComponent>;
  let geminiServiceSpy: jasmine.SpyObj<GeminiService>;

  beforeEach(async () => {
    geminiServiceSpy = jasmine.createSpyObj('GeminiService', ['findFunPlaces']);

    await TestBed.configureTestingModule({
      imports: [DiscoveryHubComponent],
      providers: [
        { provide: GeminiService, useValue: geminiServiceSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DiscoveryHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update inputs', () => {
    const input = { target: { value: 'KIAD' } } as any;
    component.onAirportIdInput(input);
    expect(component.airportId()).toBe('KIAD');
  });

  it('should call service on findPlaces', async () => {
    geminiServiceSpy.findFunPlaces.and.resolveTo({
      destinations: [],
      departure_airport: { identifier: 'KIAD' } as any,
    });

    await component.findPlaces();
    expect(geminiServiceSpy.findFunPlaces).toHaveBeenCalled();
    expect(component.initialState()).toBe(false);
  });
});
