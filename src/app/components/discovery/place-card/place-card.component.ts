import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Place } from '../models/place.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-place-card',
  templateUrl: './place-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  host: {
    '(click)': 'select.emit(place())',
    'class': 'cursor-pointer block h-full'
  }
})
export class PlaceCardComponent {
  place = input.required<Place>();
  select = output<Place>();

  get typeColorClass(): string {
    switch (this.place().type) {
      case 'Restaurant': return 'bg-amber-500/10 text-amber-400 ring-amber-500/20';
      case 'Scenic': return 'bg-green-500/10 text-green-400 ring-green-500/20';
      case 'Viewpoint': return 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20';
      case 'Activity': return 'bg-sky-500/10 text-sky-400 ring-sky-500/20';
      case 'Airport': return 'bg-indigo-500/10 text-indigo-400 ring-indigo-500/20';
      default: return 'bg-slate-500/10 text-slate-400 ring-slate-500/20';
    }
  }
}
