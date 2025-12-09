import { Component } from '@angular/core';

@Component({
    selector: 'app-privacy-policy',
    standalone: true,
    template: `
    <div class="max-w-4xl mx-auto p-8 text-sky-muted font-sans font-light">
      <h1 class="text-3xl text-white mb-8">Privacy Policy</h1>
      <div class="space-y-6">
        <p>Last updated: December 2025</p>
        
        <h2 class="text-xl text-white font-medium">1. Introduction</h2>
        <p>Welcome to Pilot Navlog ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>

        <h2 class="text-xl text-white font-medium">2. Data We Collect</h2>
        <p>We do not require user registration to use our basic calculators. However, we may collect:</p>
        <ul class="list-disc pl-6 space-y-2">
          <li>Usage Data (e.g., pages visited, time spent on the site) via Google Analytics.</li>
          <li>Technical Data (e.g., internet protocol (IP) address, browser type and version).</li>
        </ul>

        <h2 class="text-xl text-white font-medium">3. Cookies and Advertising</h2>
        <p>We use cookies to analyze website traffic and optimize your website experience. By accepting our use of cookies, your data will be aggregated with all other user data.</p>
        <p>We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to our website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our sites and/or other sites on the Internet.</p>
        <p>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" class="text-flight-blue hover:underline" target="_blank">Google Ads Settings</a>.</p>

        <h2 class="text-xl text-white font-medium">4. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us.</p>
      </div>
    </div>
  `
})
export class PrivacyPolicyComponent { }
