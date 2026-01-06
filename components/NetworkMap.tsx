import React, { useMemo } from 'react';
import { Device, DeviceType } from '../types';
import { Shield, Smartphone, Server, Monitor, Radio, Router, Lock, AlertOctagon } from 'lucide-react';

interface NetworkMapProps {
    devices: Device[];
}

const NetworkMap: React.FC<NetworkMapProps> = ({ devices }) => {
    // Identify Gateway
    const gateway = devices.find(d => d.type === DeviceType.SERVER) || devices[0];
    const otherDevices = devices.filter(d => d.id !== gateway.id);

    // Calculate layout positions
    const nodes = useMemo(() => {
        const center = { x: 50, y: 50 };
        const radius = 35; // Percentage relative to viewbox
        
        // Position Gateway at Center
        const mappedNodes = [{
            ...gateway,
            x: center.x,
            y: center.y,
            isGateway: true
        }];

        // Distribute others in a circle
        const count = otherDevices.length;
        const angleStep = (2 * Math.PI) / count;

        otherDevices.forEach((device, index) => {
            const angle = index * angleStep - (Math.PI / 2); // Start from top
            mappedNodes.push({
                ...device,
                x: center.x + radius * Math.cos(angle),
                y: center.y + radius * Math.sin(angle),
                isGateway: false
            });
        });

        return mappedNodes;
    }, [devices, gateway, otherDevices]);

    const getDeviceIcon = (type: DeviceType) => {
        switch (type) {
            case DeviceType.SERVER: return <Router size={20} />;
            case DeviceType.IOT: return <Radio size={16} />;
            case DeviceType.MOBILE: return <Smartphone size={16} />;
            case DeviceType.PC: return <Monitor size={16} />;
            case DeviceType.HONEYPOT: return <Shield size={16} />;
            default: return <Radio size={16} />;
        }
    };

    return (
        <div className="relative w-full h-full min-h-[400px] bg-[#09090b] overflow-hidden group">
            {/* SVG Layer */}
            <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                <defs>
                    {/* Subtle Grid Pattern */}
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.1"/>
                    </pattern>
                    
                    {/* Glow Gradients */}
                    <radialGradient id="gateway-glow" cx="0.5" cy="0.5" r="0.5">
                        <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                    <radialGradient id="risk-glow" cx="0.5" cy="0.5" r="0.5">
                        <stop offset="0%" stopColor="rgba(239, 68, 68, 0.3)" />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                </defs>
                
                {/* Background */}
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Connection Lines */}
                {nodes.filter(n => !n.isGateway).map((node) => {
                    const isRisk = node.riskScore > 50;
                    const strokeColor = isRisk ? '#7f1d1d' : '#27272a'; // Dark Red vs Dark Zinc
                    const particleColor = isRisk ? '#ef4444' : '#10b981'; // Red vs Green
                    
                    return (
                        <g key={`link-${node.id}`}>
                            {/* Static Line */}
                            <line 
                                x1="50" y1="50" 
                                x2={node.x} y2={node.y} 
                                stroke={strokeColor} 
                                strokeWidth="0.3" 
                            />
                            
                            {/* Moving Traffic Particle */}
                            <circle r="0.6" fill={particleColor}>
                                <animateMotion 
                                    dur={`${Math.random() * 2 + 2}s`} 
                                    repeatCount="indefinite"
                                    path={`M 50 50 L ${node.x} ${node.y}`}
                                    keyPoints="0;1"
                                    keyTimes="0;1"
                                />
                            </circle>
                            
                            {/* Reverse Traffic (Ack) */}
                            <circle r="0.4" fill={particleColor} opacity="0.6">
                                <animateMotion 
                                    dur={`${Math.random() * 2 + 3}s`} 
                                    repeatCount="indefinite"
                                    path={`M ${node.x} ${node.y} L 50 50`}
                                    keyPoints="0;1"
                                    keyTimes="0;1"
                                />
                            </circle>
                        </g>
                    );
                })}

                {/* Gateway Glow */}
                <circle cx="50" cy="50" r="15" fill="url(#gateway-glow)" opacity="0.5">
                    <animate attributeName="opacity" values="0.3;0.6;0.3" dur="4s" repeatCount="indefinite" />
                </circle>
            </svg>

            {/* Interactive HTML Layer */}
            <div className="absolute inset-0 w-full h-full">
                {/* We map nodes to absolute positioned divs for cleaner content handling than foreignObject */}
                {nodes.map((node, i) => {
                     // Convert viewBox coordinates (0-100) to percentages for CSS positioning
                     // Adjust to center the element (subtract half width/height)
                     const left = `${node.x}%`;
                     const top = `${node.y}%`;
                     
                     let colorClass = 'text-zinc-400 border-zinc-700 bg-zinc-900';
                     let ringClass = '';
                     
                     if (node.isGateway) {
                         colorClass = 'text-blue-400 border-blue-500/30 bg-blue-950/80 shadow-[0_0_20px_rgba(59,130,246,0.2)]';
                     } else if (node.type === DeviceType.HONEYPOT) {
                         colorClass = 'text-purple-400 border-purple-500/30 bg-purple-950/50';
                     } else if (node.riskScore > 50) {
                         colorClass = 'text-red-400 border-red-500/50 bg-red-950/50';
                         ringClass = 'animate-pulse ring-2 ring-red-500/20';
                     } else if (node.status === 'quarantined') {
                         colorClass = 'text-orange-400 border-orange-500/50 bg-orange-950/50';
                     } else {
                         colorClass = 'text-emerald-400 border-zinc-800 bg-black hover:border-emerald-500/50';
                     }

                     return (
                         <div 
                            key={node.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group/node cursor-pointer z-10"
                            style={{ left, top }}
                         >
                             {/* Icon Container */}
                             <div className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${node.isGateway ? 'w-14 h-14 border-2' : 'w-10 h-10 border hover:scale-110'} ${colorClass} ${ringClass}`}>
                                 {getDeviceIcon(node.type)}
                                 
                                 {/* Status Indicator Dot */}
                                 {!node.isGateway && (
                                     <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#09090b] flex items-center justify-center ${
                                         node.riskScore > 50 ? 'bg-red-500' : 
                                         node.status === 'quarantined' ? 'bg-orange-500' : 'bg-emerald-500'
                                     }`}>
                                         {node.riskScore > 50 && <AlertOctagon size={6} className="text-white" />}
                                     </div>
                                 )}
                             </div>

                             {/* Tooltip Label */}
                             <div className={`mt-3 px-3 py-1.5 rounded bg-zinc-900/90 border border-zinc-800 backdrop-blur-md shadow-xl transition-all duration-300 ${node.isGateway ? 'opacity-100' : 'opacity-0 group-hover/node:opacity-100 group-hover/node:translate-y-1'} pointer-events-none`}>
                                 <div className="flex flex-col items-center whitespace-nowrap">
                                     <span className={`text-[10px] font-semibold tracking-wide ${node.riskScore > 50 ? 'text-red-400' : 'text-zinc-200'}`}>
                                         {node.name}
                                     </span>
                                     <span className="text-[9px] text-zinc-500 font-mono">{node.ip}</span>
                                     {node.riskScore > 0 && (
                                         <span className="text-[8px] text-red-500 mt-0.5 font-bold">RISK: {node.riskScore}/100</span>
                                     )}
                                 </div>
                             </div>
                         </div>
                     );
                })}
            </div>

            {/* Legend / Overlay Info */}
            <div className="absolute bottom-4 left-4 p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 backdrop-blur text-[10px] text-zinc-400 font-mono space-y-2 pointer-events-none">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                    <span>GATEWAY</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    <span>SECURE LINK</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                    <span>ACTIVE THREAT</span>
                </div>
            </div>
        </div>
    );
};

export default NetworkMap;