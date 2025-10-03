import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartureAirport, Place } from '../models/place.model';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class MapComponent {
  departure = input.required<DepartureAirport>();
  destination = input.required<Place>();

  private viewBoxParams = computed(() => {
    const dep = this.departure();
    const dest = this.destination();

    const minLon = Math.min(dep.longitude, dest.longitude);
    const maxLon = Math.max(dep.longitude, dest.longitude);
    const minLat = Math.min(dep.latitude, dest.latitude);
    const maxLat = Math.max(dep.latitude, dest.latitude);

    const lonRange = maxLon - minLon;
    const latRange = maxLat - minLat;

    const paddingFactor = 0.25;
    // Set a minimum padding for cases where lat/lon are very close
    const paddingX = Math.max(lonRange * paddingFactor, 0.05);
    const paddingY = Math.max(latRange * paddingFactor, 0.05);

    const vbX = minLon - paddingX;
    const vbY = -(maxLat + paddingY); // Y is inverted in SVG
    const vbWidth = lonRange + 2 * paddingX;
    const vbHeight = latRange + 2 * paddingY;
    
    const strokeWidth = Math.min(vbWidth, vbHeight) * 0.005;
    const pinRadius = Math.min(vbWidth, vbHeight) * 0.02;
    const fontSize = Math.min(vbWidth, vbHeight) * 0.025;

    return { vbX, vbY, vbWidth, vbHeight, strokeWidth, pinRadius, fontSize };
  });

  viewBox = computed(() => {
    const p = this.viewBoxParams();
    return `${p.vbX} ${p.vbY} ${p.vbWidth} ${p.vbHeight}`;
  });

  depPoint = computed(() => ({ x: this.departure().longitude, y: -this.departure().latitude }));
  destPoint = computed(() => ({ x: this.destination().longitude, y: -this.destination().latitude }));

  path = computed(() => `M ${this.depPoint().x} ${this.depPoint().y} L ${this.destPoint().x} ${this.destPoint().y}`);
  
  pinRadius = computed(() => this.viewBoxParams().pinRadius);
  strokeWidth = computed(() => this.viewBoxParams().strokeWidth);
  fontSize = computed(() => this.viewBoxParams().fontSize);
}
