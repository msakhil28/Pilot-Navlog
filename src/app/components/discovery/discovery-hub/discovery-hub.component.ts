import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { PlaceCardComponent } from '../place-card/place-card.component';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { PlaceDetailComponent } from '../place-detail/place-detail.component';
import { GeminiService } from '../services/gemini.service';
import { DepartureAirport, Place } from '../models/place.model';

@Component({
  selector: 'app-discovery-hub',
  templateUrl: './discovery-hub.component.html',
  styleUrl: './discovery-hub.component.scss',
   changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, PlaceCardComponent, SkeletonLoaderComponent, PlaceDetailComponent],

})
export class DiscoveryHubComponent {
 private readonly geminiService = inject(GeminiService);

  airportId = signal('KJYO');
  distance = signal(50);
  distances = [25, 50, 75, 100, 150, 200, 250, 300];
  placeType = signal('All');
  placeTypes = ['All', 'Restaurant', 'Scenic', 'Viewpoint', 'Activity', 'Airport'];
  
  places = signal<Place[]>([]);
  departureAirport = signal<DepartureAirport | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  initialState = signal(true);
  selectedPlace = signal<Place | null>(null);

  onAirportIdInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.airportId.set(value.toUpperCase());
  }

  onDistanceChange(event: Event): void {
    const value = parseInt((event.target as HTMLSelectElement).value, 10);
    this.distance.set(value);
  }

  onPlaceTypeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.placeType.set(value);
  }

  async findPlaces(): Promise<void> {
    if (!this.airportId() || this.loading()) {
      return;
    }
    
    this.loading.set(true);
    this.error.set(null);
    this.initialState.set(false);
    this.places.set([]);
    this.departureAirport.set(null);

    try {
      const flightPlan = await this.geminiService.findFunPlaces(this.airportId(), this.distance(), this.placeType());
      this.places.set(flightPlan.destinations);
      this.departureAirport.set(flightPlan.departure_airport);
    } catch (e) {
      console.error('Error finding places:', e);
      this.error.set('Could not fetch destinations. Please check your input or try again later.');
    } finally {
      this.loading.set(false);
    }
  }

  onPlaceSelected(place: Place): void {
    this.selectedPlace.set(place);
  }

  onDetailClose(): void {
    this.selectedPlace.set(null);
  }
}
