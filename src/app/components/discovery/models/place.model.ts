export interface Place {
  airport_identifier: string;
  name: string;
  description: string;
  type: 'Restaurant' |'Scenic'| 'Viewpoint' | 'Activity' | 'Airport';
  distance_nm: number;
  latitude: number;
  longitude: number;
}

export interface DepartureAirport {
  identifier: string;
  latitude: number;
  longitude: number;
}

export interface FlightPlan {
  departure_airport: DepartureAirport;
  destinations: Place[];
}
