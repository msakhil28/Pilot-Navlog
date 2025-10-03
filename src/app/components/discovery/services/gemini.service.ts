import { Injectable } from '@angular/core';
import { GoogleGenAI, Type } from "@google/genai";
import { Place, FlightPlan } from '../models/place.model';
import { AirportDetails } from '../models/airport-details.model';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private readonly ai = new GoogleGenAI({ apiKey: 'AIzaSyCm5E5CCZh1RhGLZ6jjUXw7AdDONRp6nMo' as string });

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
      : `For each airport, determine if it's an interesting destination. Classify it as 'Restaurant','Scenic', 'Viewpoint', 'Activity', or 'Airport'. The 'Airport' type is for airports interesting on their own (e.g., a museum on the field, a unique approach).`;

    const prompt = `
      You are an expert pilot's guide for general aviation. The pilot is departing from ${airportId}.
      I have a definitive list of airport identifiers that are within the desired flight distance: [${airportIdentifiers.join(', ')}].
      Your task is to provide detailed information for these destinations.

      ${typeFilterPrompt}

      For each resulting destination, provide:
      - A short, engaging description for a pilot.
      - Its official name.
      - Its type ('Restaurant','Scenic', 'Viewpoint', 'Activity', 'Airport').
      - The distance in nautical miles from ${airportId}.
      - The latitude and longitude of both the departure airport (${airportId}) and each destination airport.
      
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
