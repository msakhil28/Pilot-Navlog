import { Injectable } from '@angular/core';
import { GoogleGenAI, Type } from "@google/genai";
import { Place, FlightPlan } from '../models/place.model';
import { AirportDetails } from '../models/airport-details.model';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private readonly ai: GoogleGenAI;

  constructor() {
    // Decrypt the API key from Base64
    const encryptedKey = environment.gemini.apiKey;
    const decryptedKey = atob(encryptedKey);
    this.ai = new GoogleGenAI({ apiKey: decryptedKey });
  }

  /**
   * Step 1: Acts like a database to get an exhaustive list of airport identifiers.
   */
  private async _getAirportsInRadius(airportId: string, distance: number): Promise<string[]> {
    const prompt = `
      You are an aviation database. Your sole function is to return a list of airport identifiers.
      Given the departure airport "${airportId}", find all public-use airports within ${distance} nautical miles.
      Return a JSON array of strings, where each string is the ICAO identifier of an airport.
      Do not include the departure airport "${airportId}" in the list.
      Only return the JSON array and nothing else.
    `;
    const responseSchema = {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    };

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
          temperature: 0
        },
      });
      const jsonText = response.text.trim();
      return JSON.parse(jsonText);
    } catch (error) {
      console.error("Gemini API call failed for _getAirportsInRadius:", error);
      // Return empty array on failure to prevent crashing the next step
      return [];
    }
  }

  async findFunPlaces(airportId: string, distance: number, placeType: string): Promise<FlightPlan> {
    // Step 1: Get an exhaustive list of all airports in the radius.
    const airportIdentifiers = await this._getAirportsInRadius(airportId, distance);

    if (airportIdentifiers.length === 0) {
      // If no airports are found, we can short-circuit and return an empty plan.
      const departureAirportResponse = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Get me the identifier, latitude and longitude for airport ${airportId}`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              identifier: { type: Type.STRING },
              latitude: { type: Type.NUMBER },
              longitude: { type: Type.NUMBER }
            },
            required: ["identifier", "latitude", "longitude"]
          }
        }
      });
      const depAirport = JSON.parse(departureAirportResponse.text);
      return { departure_airport: depAirport, destinations: [] };
    }

    // Step 2: Enrich the list with details.
    const typeFilterPrompt = placeType !== 'All'
      ? `From this list, only provide details for destinations that match the type "${placeType}". If none match, return an empty destinations array.`
      : `For each airport, determine if it's an interesting destination. Classify it as 'Restaurant', 'Scenic', 'Viewpoint', 'Activity', 'Scenic-Route', or 'Airport'. 
      
      IMPORTANT: Also consider and include:
      - Scenic VFR corridors and routes (e.g., Hudson River SFRA from KEWR/KTEB, LAX Coastal Route, San Francisco Bay Tour)
      - Special Flight Rules Areas (SFRAs) with sightseeing value
      - Famous aviation landmarks and points of interest
      - Unique airport experiences (mountain airports, island airports, challenging approaches)
      - Popular flight training areas with scenic value
      
      The 'Scenic-Route' type is for VFR corridors, transition routes, and scenic flight paths that aren't necessarily airports.
      The 'Airport' type is for airports interesting on their own (e.g., a museum on the field, a unique approach, historical significance).`;

    const prompt = `
      You are an expert pilot's guide for general aviation with deep knowledge of scenic routes and special airspace. 
      The pilot is departing from ${airportId}.
      
      I have a definitive list of airport identifiers that are within the desired flight distance: [${airportIdentifiers.join(', ')}].
      
      Your task is to provide detailed information for these destinations AND suggest relevant scenic routes/special airspace.

      ${typeFilterPrompt}

      CRITICAL: If departing from airports near major cities or scenic areas, ALWAYS include:
      - KEWR/KTEB/KLDJ → Hudson River SFRA (scenic route along Hudson River, Statue of Liberty, NYC skyline)
      - KLAX/KSMO/KVNY → LAX Coastal Route (scenic coastal flight, Malibu, Santa Monica)
      - KSQL/KPAO/KHWD → San Francisco Bay Tour (Golden Gate Bridge, Alcatraz, Bay Bridge)
      - KOSH → EAA Aviation Museum and AirVenture sites
      - Any mountain airports → Mention challenging approaches and scenic mountain flying

      For each resulting destination, provide:
      - A short, engaging description for a pilot (mention what makes it special for flying)
      - Its official name (for scenic routes, use descriptive names like "Hudson River SFRA" or "NYC Skyline Tour")
      - Its type ('Restaurant','Scenic', 'Viewpoint', 'Activity', 'Scenic-Route', 'Airport')
      - The distance in nautical miles from ${airportId}
      - The latitude and longitude of both the departure airport (${airportId}) and each destination airport
      - For scenic routes, use the midpoint or entry point coordinates
      
      Prioritize diversity: mix of nearby airports (40%), scenic routes (30%), unique destinations (20%), and landmarks (10%).
      
      Return the results strictly in the specified JSON format.
    `;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        departure_airport: {
          type: Type.OBJECT,
          properties: {
            identifier: { type: Type.STRING },
            latitude: { type: Type.NUMBER },
            longitude: { type: Type.NUMBER }
          },
          required: ["identifier", "latitude", "longitude"]
        },
        destinations: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              airport_identifier: { type: Type.STRING },
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              type: { type: Type.STRING },
              distance_nm: { type: Type.NUMBER },
              latitude: { type: Type.NUMBER },
              longitude: { type: Type.NUMBER }
            },
            required: ["airport_identifier", "name", "description", "type", "distance_nm", "latitude", "longitude"]
          }
        }
      },
      required: ["departure_airport", "destinations"]
    };

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
          temperature: 0.7
        },
      });

      const jsonText = response.text.trim();
      const result = JSON.parse(jsonText);
      return result as FlightPlan;

    } catch (error) {
      console.error("Gemini API call failed for enriching places:", error);
      throw new Error("Failed to fetch data from Gemini API.");
    }
  }

  async getAirportDetails(airportId: string): Promise<AirportDetails> {
    const prompt = `
      You are an expert aviation data provider.
      Provide key information for airport with identifier "${airportId}" in a structured JSON format.
      Include the airport's full name, a list of runways (with name/identifier, dimensions in feet, and surface type),
      a list of key communication frequencies (like CTAF, Tower, Ground, ATIS, Approach, etc. with type and frequency value),
      and a list of available on-field services (e.g., "Fuel (100LL)", "Fuel (Jet A)", "Aircraft Maintenance", "Flight School", "Restaurant").
      Ensure the output is strictly in the specified JSON format.
    `;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        identifier: { type: Type.STRING },
        name: { type: Type.STRING },
        runways: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              dimensions: { type: Type.STRING },
              surface: { type: Type.STRING }
            },
            required: ["name", "dimensions", "surface"]
          }
        },
        frequencies: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              value: { type: Type.STRING }
            },
            required: ["type", "value"]
          }
        },
        services: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      },
      required: ["identifier", "name", "runways", "frequencies", "services"]
    };

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
        },
      });

      const jsonText = response.text.trim();
      return JSON.parse(jsonText) as AirportDetails;

    } catch (error) {
      console.error(`Gemini API call failed for airport details (${airportId}):`, error);
      throw new Error("Failed to fetch airport details from Gemini API.");
    }
  }

  async generatePlaceImage(place: Place): Promise<string> {
    const prompt = `
      Create a beautiful, high-quality, photorealistic image of the following aviation destination:
      Name: "${place.name}"
      Description: "${place.description}"
      Type: ${place.type}
      Focus on a visually appealing and representative scene. For a Scenic, viewpoint, show the landscape. For a restaurant, show the exterior with an airplane parked nearby if appropriate. For an airport, show an interesting perspective of the airport.
    `;
    try {
      const response = await this.ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
      });

      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } catch (error) {
      console.error(`Gemini image generation failed for place "${place.name}":`, error);
      throw new Error("Failed to generate image from Gemini API.");
    }
  }
}
