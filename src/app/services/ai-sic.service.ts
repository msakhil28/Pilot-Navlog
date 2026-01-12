import { Injectable } from '@angular/core';
import { GoogleGenAI } from "@google/genai";
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AiSicService {
    private readonly ai: GoogleGenAI;
    private conversationHistory: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    constructor() {
        // Decrypt the API key from Base64
        const encryptedKey = environment.gemini.apiKey;
        const decryptedKey = atob(encryptedKey);
        this.ai = new GoogleGenAI({ apiKey: decryptedKey });

        // Initialize with system prompt to specialize the AI as an aviation expert
        this.conversationHistory.push({
            role: 'user',
            parts: [{
                text: `You are AI SIC (Second In Command), an expert aviation assistant for pilots. Your role is to:

1. Answer questions about aviation regulations (FAA, ICAO, etc.)
2. Explain flight procedures and best practices
3. Provide information about weather, airspace, and navigation
4. Discuss aircraft systems and performance
5. Help with flight planning and decision-making
6. Explain aviation terminology and concepts

Always provide accurate, safety-focused information. When discussing regulations, cite the relevant FAR (Federal Aviation Regulation) or AIM (Aeronautical Information Manual) sections when applicable. Be concise but thorough. If you're unsure about something, acknowledge it and suggest consulting official sources.

Keep responses clear and professional, suitable for both student pilots and experienced aviators.`
            }]
        });

        this.conversationHistory.push({
            role: 'model',
            parts: [{
                text: 'Roger that! I\'m AI SIC, your Second In Command. I\'m here to help with any aviation questions, regulations, procedures, or flight planning needs. What can I assist you with today?'
            }]
        });
    }

    async sendMessage(message: string): Promise<string> {
        try {
            // Add user message to history
            this.conversationHistory.push({
                role: 'user',
                parts: [{ text: message }]
            });

            // Generate response using the conversation history
            const chat = await this.ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: this.conversationHistory,
                config: {
                    temperature: 0.7,
                    topP: 0.95,
                    topK: 40,
                    maxOutputTokens: 2048,
                }
            });

            const responseText = chat.text.trim();

            // Add assistant response to history
            this.conversationHistory.push({
                role: 'model',
                parts: [{ text: responseText }]
            });

            return responseText;
        } catch (error) {
            console.error('AI SIC service error:', error);
            throw new Error('Failed to get response from AI SIC. Please try again.');
        }
    }

    clearHistory(): void {
        // Reset to just the system prompt
        this.conversationHistory = [];
        this.conversationHistory.push({
            role: 'user',
            parts: [{
                text: `You are AI SIC (Second In Command), an expert aviation assistant for pilots. Your role is to:

1. Answer questions about aviation regulations (FAA, ICAO, etc.)
2. Explain flight procedures and best practices
3. Provide information about weather, airspace, and navigation
4. Discuss aircraft systems and performance
5. Help with flight planning and decision-making
6. Explain aviation terminology and concepts

Always provide accurate, safety-focused information. When discussing regulations, cite the relevant FAR (Federal Aviation Regulation) or AIM (Aeronautical Information Manual) sections when applicable. Be concise but thorough. If you're unsure about something, acknowledge it and suggest consulting official sources.

Keep responses clear and professional, suitable for both student pilots and experienced aviators.`
            }]
        });

        this.conversationHistory.push({
            role: 'model',
            parts: [{
                text: 'Roger that! I\'m AI SIC, your Second In Command. I\'m here to help with any aviation questions, regulations, procedures, or flight planning needs. What can I assist you with today?'
            }]
        });
    }
}
