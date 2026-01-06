import React from 'react';
import { Device, DeviceType } from '../types';
import { AlertTriangle, CheckCircle2, AlertCircle, Shield, Server, Smartphone, Monitor, Radio } from 'lucide-react';

interface DeviceInventoryProps {
    devices: Device[];
}

const DeviceInventory: React.FC<DeviceInventoryProps> = ({ devices }) => {
    
    const getIcon = (type: DeviceType) => {
        switch (type) {
            case DeviceType.IOT: return <Radio size={14} />;
            case DeviceType.MOBILE: return <Smartphone size={14} />;
            case DeviceType.PC: return <Monitor size={14} />;
            case DeviceType.SERVER: return <Server size={14} />;
            case DeviceType.HONEYPOT: return <Shield size={14} />;
            default: return <Radio size={14} />;
        }
    };

    return (
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-black/20">
                <h2 className="text-sm font-medium text-zinc-200">Device Risk Profiling & Inventory</h2>
                <span className="text-xs text-zinc-500 font-mono">AUTOSCAN: ENABLED</span>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-400">
                    <thead className="bg-zinc-900/50 text-zinc-300 font-medium border-b border-zinc-800">
                        <tr>
                            <th className="px-4 py-3">Device Name</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Firmware</th>
                            <th className="px-4 py-3">Open Ports</th>
                            <th className="px-4 py-3">Risk Assessment</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {devices.map((device) => (
                            <tr key={device.id} className="hover:bg-zinc-900/20 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-md ${device.status === 'quarantined' ? 'bg-red-900/20 text-red-500' : 'bg-zinc-800 text-zinc-400'}`}>
                                            {getIcon(device.type)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-zinc-200">{device.name}</div>
                                            <div className="text-[10px] text-zinc-500 font-mono">{device.ip}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">{device.type}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-1.5 h-1.5 rounded-full ${device.firmwareStatus === 'up-to-date' ? 'bg-emerald-500' : device.firmwareStatus === 'outdated' ? 'bg-red-500' : 'bg-zinc-500'}`}></span>
                                        <span className="text-zinc-300">{device.firmwareVersion || 'Unknown'}</span>
                                        {device.firmwareStatus === 'outdated' && (
                                            <span className="text-[10px] bg-red-900/20 text-red-400 px-1.5 py-0.5 rounded border border-red-900/30">Update Avail</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-mono text-zinc-500">
                                    {device.openPorts.length > 0 ? device.openPorts.join(', ') : 'None'}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-col gap-1">
                                        {device.vulnerabilities.length > 0 ? (
                                            device.vulnerabilities.map((vuln, idx) => (
                                                <div key={idx} className="flex items-center gap-1.5 text-red-400">
                                                    <AlertTriangle size={10} />
                                                    <span>{vuln}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-emerald-500">
                                                <CheckCircle2 size={10} />
                                                <span>Secure</span>
                                            </div>
                                        )}
                                        {device.riskScore > 50 && (
                                            <span className="text-[10px] text-red-500 font-bold">Score: {device.riskScore}/100</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DeviceInventory;