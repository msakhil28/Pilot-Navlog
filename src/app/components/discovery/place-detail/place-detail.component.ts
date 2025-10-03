import { Component, ChangeDetectionStrategy, inject, input, output, signal, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Place, DepartureAirport } from '../models/place.model';
import { AirportDetails } from '../models/airport-details.model';
import { GeminiService } from '../services/gemini.service';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MapComponent],
})
export class PlaceDetailComponent implements OnInit {
  place = input.required<Place>();
  departureAirport = input<DepartureAirport | null>();
  close = output<void>();

  private readonly geminiService = inject(GeminiService);

  imageLoading = signal(true);
  imageError = signal<string | null>(null);
  imageUrl = signal<string | null>(null);

  detailsLoading = signal(true);
  detailsError = signal<string | null>(null);
  airportDetails = signal<AirportDetails | null>(null);

  constructor() {
    // Prevent scrolling on the body when the modal is open
    effect(() => {
      document.body.style.overflow = 'hidden';
      // Cleanup function
      return () => {
        document.body.style.overflow = 'auto';
      };
    });
  }
  
  ngOnInit(): void {
    this.loadData();
  }
  
  async loadData(): Promise<void> {
    this.imageLoading.set(true);
    this.imageError.set(null);
    this.detailsLoading.set(true);
    this.detailsError.set(null);
    
    const place = this.place();

    const [imageResult, detailsResult] = await Promise.allSettled([
      this.geminiService.generatePlaceImage(place),
      this.geminiService.getAirportDetails(place.airport_identifier)
    ]);

    if (imageResult.status === 'fulfilled') {
      this.imageUrl.set(imageResult.value);
    } else {
      console.error('Image generation failed:', imageResult.reason);
      this.imageError.set('Could not load image.');
    }
    this.imageLoading.set(false);

    if (detailsResult.status === 'fulfilled') {
      this.airportDetails.set(detailsResult.value);
    } else {
      console.error('Airport details fetch failed:', detailsResult.reason);
      this.detailsError.set('Could not load airport details.');
    }
    this.detailsLoading.set(false);
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}