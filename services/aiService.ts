import { GoogleGenAI } from "@google/genai";
import { Device, AgentLog } from "../types";

// Note: In a real production app, never expose keys in client-side code.
// This is for demonstration with process.env or user input.
const API_KEY = process.env.API_KEY || ''; 

export const analyzeThreats = async (
    apiKey: string,
    logs: AgentLog[],
    devices: Device[]
): Promise<string> => {
    if (!apiKey) return "API Key missing. Please provide a key in settings or env.";

    const ai = new GoogleGenAI({ apiKey });

    // Filter relevant logs for context
    const recentLogs = logs.slice(-10).map(l => `[${l.agent}] ${l.message}`).join('\n');
    
    // Enhanced device details for AI context
    const riskyDevices = devices.filter(d => d.riskScore > 20).map(d => `
        Device: ${d.name} (${d.ip})
        Risk Score: ${d.riskScore}
        Firmware: ${d.firmwareVersion} (${d.firmwareStatus})
        Open Ports: ${d.openPorts.join(', ')}
        Vulnerabilities: ${d.vulnerabilities.join(', ')}
    `).join('\n');

    const prompt = `
    You are the 'Aeon-Shield' Security AI Analyst. 
    Analyze the following recent system logs and risky devices.
    
    Your goal is to detect:
    1. Outdated firmware risks.
    2. Weak configurations (e.g., default passwords, open Telnet).
    3. Active intrusion attempts (honeypot triggers).
    
    Provide a concise (max 3 sentences) tactical assessment.
    Suggest one specific remediation step.

    System Logs:
    ${recentLogs}

    Risky Devices Profile:
    ${riskyDevices || "No high-risk devices detected."}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || "Analysis complete. No specific output generated.";
    } catch (error) {
        console.error("AI Error:", error);
        return "Unable to contact Security Analyst AI. Check connection or API Key.";
    }
};