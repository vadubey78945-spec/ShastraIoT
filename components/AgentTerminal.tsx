import React, { useEffect, useRef } from 'react';
import { AgentLog } from '../types';
import { Terminal, ShieldAlert, Cpu, Activity, Play } from 'lucide-react';

interface AgentTerminalProps {
    logs: AgentLog[];
}

const AgentTerminal: React.FC<AgentTerminalProps> = ({ logs }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    const getIcon = (agent: string) => {
        switch (agent) {
            case 'Discovery': return <Activity size={12} className="text-blue-500" />;
            case 'Defense': return <ShieldAlert size={12} className="text-red-500" />;
            case 'Deception': return <Terminal size={12} className="text-purple-500" />;
            default: return <Cpu size={12} className="text-emerald-500" />;
        }
    };

    const getColor = (level: string) => {
        if (level === 'action') return 'text-red-400 font-medium';
        if (level === 'warning') return 'text-yellow-400';
        return 'text-zinc-400';
    };

    return (
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg overflow-hidden flex flex-col h-full">
            {/* Header */}
            <div className="bg-black/20 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">System Logs</span>
                <div className="flex items-center gap-2">
                     <span className="text-[10px] text-zinc-600 font-mono">LIVE</span>
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
            </div>
            
            {/* Terminal Body */}
            <div className="p-3 font-mono text-xs overflow-y-auto flex-1 space-y-2 bg-[#050505]">
                {logs.map((log) => (
                    <div key={log.id} className="flex gap-3 items-start">
                        <span className="text-zinc-600 shrink-0 select-none text-[10px] mt-0.5">
                            {log.timestamp}
                        </span>
                        <div className="flex items-center gap-2 shrink-0 w-20 mt-0.5">
                            {getIcon(log.agent)}
                            <span className={`text-[10px] font-semibold ${
                                log.agent === 'Defense' ? 'text-red-500' : 
                                log.agent === 'Deception' ? 'text-purple-500' :
                                log.agent === 'Discovery' ? 'text-blue-500' : 'text-zinc-500'
                            }`}>
                                {log.agent}
                            </span>
                        </div>
                        <span className={`${getColor(log.level)} break-all`}>
                            {log.message}
                        </span>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default AgentTerminal;