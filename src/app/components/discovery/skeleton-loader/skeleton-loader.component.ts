
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  template: `
    <div class="h-full bg-slate-800 rounded-lg shadow-lg overflow-hidden p-6 animate-pulse ring-1 ring-slate-700">
      <div class="flex justify-between items-start mb-4">
        <div class="h-6 bg-slate-700 rounded w-3/4"></div>
        <div class="h-6 bg-slate-700 rounded w-1/5"></div>
      </div>
      <div class="h-4 bg-slate-700 rounded w-1/2 mb-4"></div>
      <div class="space-y-2">
        <div class="h-4 bg-slate-700 rounded"></div>
        <div class="h-4 bg-slate-700 rounded"></div>
        <div class="h-4 bg-slate-700 rounded w-5/6"></div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonLoaderComponent {}
