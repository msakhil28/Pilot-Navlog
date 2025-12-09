import { Component } from '@angular/core';

@Component({
    selector: 'app-terms',
    standalone: true,
    template: `
    <div class="max-w-4xl mx-auto p-8 text-sky-muted font-sans font-light">
      <h1 class="text-3xl text-white mb-8">Terms of Service</h1>
      <div class="space-y-6">
        <p>Last updated: December 2025</p>

        <h2 class="text-xl text-white font-medium">1. Agreement to Terms</h2>
        <p>By accessing or using Pilot Navlog, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the Service.</p>

        <h2 class="text-xl text-white font-medium">2. Disclaimer of Warranty</h2>
        <p class="text-avionics-red bg-avionics-red/10 p-4 rounded-lg border border-avionics-red/20 font-medium">
          CRITICAL SAFETY WARNING: THIS APPLICATION IS FOR EDUCATIONAL AND PLANNING PURPOSES ONLY. IT IS NOT CERTIFIED FOR FLIGHT NAVIGATION.
        </p>
        <p>The calculations and data provided by Pilot Navlog are strictly for supplemental situational awareness and training. The Pilot in Command (PIC) is solely responsible for ensuring the accuracy of all flight planning data using official and approved sources (e.g., POH, official briefings).</p>

        <h2 class="text-xl text-white font-medium">3. Limitation of Liability</h2>
        <p>In no event shall Pilot Navlog, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of the Service.</p>

        <h2 class="text-xl text-white font-medium">4. Data Accuracy</h2>
        <p>While we strive to provide accurate calculations, we do not guarantee the correctness of any data derived from this application. Aviation data changes frequently, and software bugs may exist.</p>

        <h2 class="text-xl text-white font-medium">5. Changes</h2>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time.</p>
      </div>
    </div>
  `
})
export class TermsComponent { }
