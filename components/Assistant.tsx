import React, { useState } from 'react';
import { Bot, Send, Loader2, Key, Sparkles } from 'lucide-react';
import { analyzeThreats } from '../services/aiService';
import { Device, AgentLog } from '../types';

interface AssistantProps {
    logs: AgentLog[];
    devices: Device[];
}

const Assistant: React.FC<AssistantProps> = ({ logs, devices }) => {
    const [response, setResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [showKeyInput, setShowKeyInput] = useState(false);

    const handleAnalyze = async () => {
        if (!apiKey && !process.env.API_KEY) {
            setShowKeyInput(true);
            return;
        }
        setLoading(true);
        const result = await analyzeThreats(apiKey || process.env.API_KEY || '', logs, devices);
        setResponse(result);
        setLoading(false);
    };

    return (
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-3 border-b border-zinc-800 flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-2">
                    <Bot size={16} className="text-zinc-400" />
                    <span className="text-xs font-medium text-zinc-300">Gemini Analyst</span>
                </div>
                <button 
                    onClick={() => setShowKeyInput(!showKeyInput)}
                    className="text-zinc-600 hover:text-zinc-300 transition-colors"
                >
                    <Key size={14} />
                </button>
            </div>

            {/* Input for Key */}
            {showKeyInput && (
                <div className="p-3 bg-zinc-900 border-b border-zinc-800">
                    <input 
                        type="password"
                        placeholder="Enter Google API Key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full bg-black border border-zinc-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500 placeholder:text-zinc-700"
                    />
                </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#050505]">
                {response ? (
                    <div className="text-sm text-zinc-300 leading-relaxed space-y-2">
                         <div className="flex items-center gap-2 text-indigo-400 mb-2">
                            <Sparkles size={12} />
                            <span className="text-xs font-medium uppercase tracking-wider">Analysis</span>
                        </div>
                        <p>{response}</p>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-700 gap-3">
                         <Bot size={24} className="opacity-20" />
                        <p className="text-xs text-center">Ready to analyze network telemetry.</p>
                    </div>
                )}
            </div>

            {/* Footer Action */}
            <div className="p-3 border-t border-zinc-800 bg-black/20">
                <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="w-full py-2 bg-zinc-100 hover:bg-white text-black rounded text-xs font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <>
                            <span>Generate Report</span>
                            <Send size={12} />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Assistant;