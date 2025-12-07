import { Component, OnInit, PLATFORM_ID, Inject, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-adsense',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="shouldShowAds" class="adsense-container my-4 text-center">
      <!-- Google AdSense Unit -->
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-7141762566773126" 
           data-ad-slot="1601531283"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      <div class="text-xs text-sky-muted mt-1">Advertisement</div>
    </div>
  `,
  styles: [`
    .adsense-container {
      min-height: 100px;
      overflow: hidden;
    }
  `]
})
export class AdSenseComponent implements OnInit, AfterViewInit {
  shouldShowAds = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    // 1. Check if running in the browser (SSR safety)
    if (isPlatformBrowser(this.platformId)) {
      // In a pure web app, we always want to show ads (unless you add other logic)
      this.shouldShowAds = true;
    }
  }

  ngAfterViewInit() {
    if (this.shouldShowAds) {
      try {
        // Trigger ad push
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }
}
