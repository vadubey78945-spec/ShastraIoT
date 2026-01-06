export enum DeviceType {
    IOT = 'IoT Device',
    MOBILE = 'Mobile',
    PC = 'Workstation',
    SERVER = 'Server',
    HONEYPOT = 'Honeypot'
}

export enum ThreatLevel {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High',
    CRITICAL = 'Critical'
}

export interface Device {
    id: string;
    name: string;
    ip: string;
    mac: string;
    type: DeviceType;
    status: 'online' | 'offline' | 'quarantined' | 'compromised';
    manufacturer?: string;
    riskScore: number; // 0-100
    lastSeen: string;
    // New Profiling Data
    firmwareVersion?: string;
    firmwareStatus?: 'up-to-date' | 'outdated' | 'unknown';
    openPorts: number[];
    vulnerabilities: string[]; // e.g., "Default Password", "Weak Encryption"
}

export interface AgentLog {
    id: string;
    timestamp: string;
    agent: 'Discovery' | 'Profiling' | 'Deception' | 'Defense';
    message: string;
    details?: string;
    level: 'info' | 'warning' | 'action';
}

export interface ThreatEvent {
    id: string;
    timestamp: string;
    sourceIp: string;
    targetIp: string;
    attackType: string;
    severity: ThreatLevel;
    actionTaken: string;
}