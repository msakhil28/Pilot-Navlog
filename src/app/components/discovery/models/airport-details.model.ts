export interface Runway {
  name: string;
  dimensions: string;
  surface: string;
}

export interface Frequency {
  type: string;
  value: string;
}

export interface AirportDetails {
  identifier: string;
  name: string;
  runways: Runway[];
  frequencies: Frequency[];
  services: string[];
}
