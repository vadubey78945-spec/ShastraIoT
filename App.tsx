import React, { useState, useEffect } from 'react';
import { Shield, Activity, FileCode, LayoutDashboard, Menu, Globe, Zap, Server, Lock, ChevronRight, X } from 'lucide-react';
import NetworkMap from './components/NetworkMap';
import AgentTerminal from './components/AgentTerminal';
import Assistant from './components/Assistant';
import DeviceInventory from './components/DeviceInventory';
import { Device, AgentLog } from './types';
import { INITIAL_DEVICES, MOCK_LOGS, PYTHON_DISCOVERY_CODE, PYTHON_DECEPTION_CODE, ARCHITECTURE_MERMAID, ROADMAP_MD } from './constants';

function App() {
  // State
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [logs, setLogs] = useState<AgentLog[]>(MOCK_LOGS);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'blueprint'>('dashboard');
  
  // Responsive Sidebar State
  // Default to true (open) on desktop, but we'll check width in effect
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle Resize for Responsive Layout
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false); // Default to closed on mobile
      } else {
        setSidebarOpen(true); // Default to open on desktop
      }
    };

    // Init
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Simulation Effect
  useEffect(() => {
    const interval = setInterval(() => {
      const randomDeviceIdx = Math.floor(Math.random() * devices.length);
      const randomLogType = Math.random();

      // Simulation logic extended to cover firmware and profiling
      if (randomLogType > 0.6) {
        let newLog: AgentLog;
        
        if (randomLogType > 0.9) {
             newLog = {
                id: Date.now().toString(),
                timestamp: new Date().toLocaleTimeString(),
                agent: 'Deception',
                message: `Honeypot probe detected from ${devices[randomDeviceIdx].ip} on Port 2222`,
                level: 'warning'
             };
        } else if (randomLogType > 0.8) {
            newLog = {
                id: Date.now().toString(),
                timestamp: new Date().toLocaleTimeString(),
                agent: 'Defense',
                message: `Firewall: Blocked suspicious outbound traffic from ${devices[randomDeviceIdx].ip}`,
                level: 'action'
             };
        } else if (randomLogType > 0.7) {
            newLog = {
                id: Date.now().toString(),
                timestamp: new Date().toLocaleTimeString(),
                agent: 'Profiling',
                message: `Firmware Check: ${devices[randomDeviceIdx].name} version ${devices[randomDeviceIdx].firmwareVersion || 'unknown'} validated against vendor DB.`,
                level: 'info'
             };
        } else {
            newLog = {
                id: Date.now().toString(),
                timestamp: new Date().toLocaleTimeString(),
                agent: 'Discovery',
                message: `Port Scan: Verifying open ports for ${devices[randomDeviceIdx].ip}`,
                level: 'info'
             };
        }

        setLogs(prev => [...prev.slice(-49), newLog]);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [devices]);

  return (
    <div className="flex h-full text-zinc-100 relative z-10 overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        bg-black border-r border-zinc-800 flex flex-col 
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'w-64 translate-x-0' : (isMobile ? '-translate-x-full w-64' : 'w-16 translate-x-0')}
      `}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2 text-white overflow-hidden">
             <div className="p-1 bg-white rounded-md shrink-0">
                <Shield size={16} className="text-black" />
             </div>
             <span className={`font-semibold tracking-tight whitespace-nowrap ${!sidebarOpen && !isMobile && 'hidden'}`}>AeonShield</span>
          </div>
          {/* Mobile Close Button */}
          {isMobile && (
              <button onClick={() => setSidebarOpen(false)} className="text-zinc-500 hover:text-white">
                  <X size={20} />
              </button>
          )}
        </div>
        
        <nav className="flex-1 p-3 space-y-1 mt-2 overflow-y-auto">
          <button 
            onClick={() => { setActiveTab('dashboard'); if (isMobile) setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-sm whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'}`}
          >
            <LayoutDashboard size={18} className="shrink-0" />
            <span className={`${!sidebarOpen && !isMobile && 'hidden'}`}>Overview</span>
          </button>
          
          <button 
            onClick={() => { setActiveTab('blueprint'); if (isMobile) setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-sm whitespace-nowrap ${activeTab === 'blueprint' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'}`}
          >
            <FileCode size={18} className="shrink-0" />
            <span className={`${!sidebarOpen && !isMobile && 'hidden'}`}>Blueprint</span>
          </button>
        </nav>

        <div className="p-4 border-t border-zinc-800 shrink-0">
             <div className={`flex items-center gap-3 ${(!sidebarOpen && !isMobile) && 'justify-center'}`}>
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
                <div className={`flex flex-col overflow-hidden ${(!sidebarOpen && !isMobile) && 'hidden'}`}>
                    <span className="text-xs text-zinc-300 font-medium whitespace-nowrap">System Online</span>
                    <span className="text-[10px] text-zinc-600 whitespace-nowrap">v2.4.0</span>
                </div>
             </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-black w-full">
        
        {/* Header */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-4 lg:px-6 bg-black z-20 shrink-0">
          <div className="flex items-center gap-3 lg:gap-4 overflow-hidden">
             <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-zinc-500 hover:text-white transition-colors shrink-0">
                <Menu size={20} />
             </button>
             <span className="text-sm text-zinc-500 hidden sm:inline">/</span>
             <div className="flex items-center gap-2 truncate">
                 <Globe size={14} className="text-zinc-500 shrink-0" />
                 <span className="text-sm text-zinc-300 font-medium truncate">192.168.1.0/24</span>
             </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
             <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                 <span className="text-xs text-zinc-500">Discovery</span>
             </div>
             <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                 <span className="text-xs text-zinc-500">Deception</span>
             </div>
             <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                 <span className="text-xs text-zinc-500">Defense</span>
             </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-6 scroll-smooth">
          
          {activeTab === 'dashboard' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 h-auto lg:h-full lg:min-h-[800px] auto-rows-min lg:auto-rows-fr">
                
                {/* Top Row: Clean Stats Cards */}
                <div className="lg:col-span-3 bg-zinc-900/50 border border-zinc-800 rounded-lg p-5 flex flex-col justify-between hover:border-zinc-700 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-zinc-500 text-sm font-medium">Health Score</span>
                        <Activity size={16} className="text-emerald-500" />
                    </div>
                    <div>
                        <div className="text-3xl font-semibold text-white tracking-tight">92%</div>
                        <div className="w-full bg-zinc-800 h-1 mt-3 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 w-[92%] h-full"></div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3 bg-zinc-900/50 border border-zinc-800 rounded-lg p-5 flex flex-col justify-between hover:border-zinc-700 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-zinc-500 text-sm font-medium">Threats Blocked</span>
                        <Lock size={16} className="text-red-500" />
                    </div>
                    <div>
                        <div className="text-3xl font-semibold text-white tracking-tight">14</div>
                        <div className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                            <span className="text-emerald-500">+2</span> since last hour
                        </div>
                    </div>
                </div>

                 <div className="lg:col-span-3 bg-zinc-900/50 border border-zinc-800 rounded-lg p-5 flex flex-col justify-between hover:border-zinc-700 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-zinc-500 text-sm font-medium">Vulnerabilities</span>
                        <Zap size={16} className="text-orange-500" />
                    </div>
                     <div>
                        <div className="text-3xl font-semibold text-white tracking-tight">3</div>
                        <div className="text-xs text-orange-500 mt-1">Outdated Firmware Detected</div>
                    </div>
                </div>

                 <div className="lg:col-span-3 bg-zinc-900/50 border border-zinc-800 rounded-lg p-5 flex flex-col justify-between hover:border-zinc-700 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-zinc-500 text-sm font-medium">Devices</span>
                        <Server size={16} className="text-blue-500" />
                    </div>
                     <div>
                        <div className="text-3xl font-semibold text-white tracking-tight">{devices.length}</div>
                        <div className="text-xs text-blue-500/80 mt-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span> Scanning
                        </div>
                    </div>
                </div>

                {/* Second Row: Network Map & Assistant */}
                <div className="lg:col-span-8 lg:row-span-1 bg-zinc-900/30 border border-zinc-800 rounded-lg flex flex-col h-[350px] lg:h-auto lg:min-h-[400px] overflow-hidden">
                    <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-black/20">
                        <h2 className="text-sm font-medium text-zinc-200">Network Topology</h2>
                        <span className="text-xs text-zinc-500 font-mono">LIVE</span>
                    </div>
                    <div className="flex-1 p-0 relative">
                        <NetworkMap devices={devices} />
                    </div>
                </div>

                <div className="lg:col-span-4 lg:row-span-1 h-[400px] lg:h-[400px]">
                    <Assistant logs={logs} devices={devices} />
                </div>

                {/* Third Row: Device Inventory (New) */}
                <div className="lg:col-span-8 h-auto">
                    <DeviceInventory devices={devices} />
                </div>

                {/* Third Row: Logs */}
                <div className="lg:col-span-4 h-[300px] lg:h-auto lg:min-h-[250px]">
                    <AgentTerminal logs={logs} />
                </div>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto space-y-6 pb-10">
                <div className="border-b border-zinc-800 pb-6 mb-6">
                    <h1 className="text-2xl font-semibold text-white mb-2">System Blueprint</h1>
                    <p className="text-zinc-500 text-sm">Technical architecture, agent source code, and deployment roadmap.</p>
                </div>

                {/* Architecture */}
                <div className="border border-zinc-800 rounded-lg p-4 lg:p-6 bg-zinc-900/20">
                    <h2 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                        <Activity size={16} className="text-zinc-500" /> Architecture Diagram
                    </h2>
                    <div className="bg-zinc-950 p-4 rounded border border-zinc-800 font-mono text-xs text-zinc-400 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                        {ARCHITECTURE_MERMAID}
                    </div>
                </div>

                 {/* Python Code */}
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="border border-zinc-800 rounded-lg p-4 lg:p-6 bg-zinc-900/20">
                        <h2 className="text-sm font-medium text-white mb-4">Discovery Agent (Python)</h2>
                        <pre className="bg-zinc-950 p-4 rounded border border-zinc-800 font-mono text-xs text-zinc-400 overflow-x-auto h-64 lg:h-80">
                            <code>{PYTHON_DISCOVERY_CODE}</code>
                        </pre>
                    </div>

                    <div className="border border-zinc-800 rounded-lg p-4 lg:p-6 bg-zinc-900/20">
                        <h2 className="text-sm font-medium text-white mb-4">Deception Agent (Python)</h2>
                        <pre className="bg-zinc-950 p-4 rounded border border-zinc-800 font-mono text-xs text-zinc-400 overflow-x-auto h-64 lg:h-80">
                            <code>{PYTHON_DECEPTION_CODE}</code>
                        </pre>
                    </div>
                 </div>

                 {/* Roadmap */}
                 <div className="border border-zinc-800 rounded-lg p-4 lg:p-6 bg-zinc-900/20">
                    <h2 className="text-sm font-medium text-white mb-4">Roadmap</h2>
                    <div className="prose prose-invert prose-sm max-w-none text-zinc-400">
                        <div className="whitespace-pre-wrap font-sans">
                            {ROADMAP_MD}
                        </div>
                    </div>
                 </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default App;