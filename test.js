// Replace with your actual API key
const API_KEY = 'AIzaSyDGYZ-Ui2O2Rf1Vs7b2N-toSyYjOS_Pcmc'; 

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${API_KEY}`;

async function chat(message) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: message }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("API Error:", data.error.message);
        } else {
            console.log("AI:", data.candidates[0].content.parts[0].text);
        }
    } catch (e) {
        console.error("Request failed:", e);
    }
}

// Just a quick greeting
chat("Hi there! Just testing the connection.");