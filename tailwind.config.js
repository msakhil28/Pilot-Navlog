/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                sky: {
                    dark: '#0f172a',      // Slate 900 - Deep Night Sky background
                    light: '#1e293b',     // Slate 800 - Lighter Sky elements across UI
                    card: 'rgba(30, 41, 59, 0.7)', // Glassmorphism card background
                    text: '#f1f5f9',      // Slate 100 - High contrast text
                    muted: '#94a3b8',     // Slate 400 - Secondary text
                },
                flight: {
                    blue: '#3b82f6',      // Blue 500 - Primary Action / Indicators
                    focus: '#2563eb',     // Blue 600
                },
                avionics: {
                    green: '#10b981',     // Emerald 500 - Success / Active properties
                    amber: '#f59e0b',     // Amber 500 - Warnings
                    red: '#ef4444',       // Red 500 - Errors / Critical
                }
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui'],
            },
            backgroundImage: {
                'horizon-glow': 'linear-gradient(to top, #0f172a 0%, #1e293b 100%)',
            }
        },
    },
    plugins: [],
}
