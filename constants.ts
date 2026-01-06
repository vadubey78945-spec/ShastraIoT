import { Device, DeviceType, AgentLog, ThreatEvent, ThreatLevel } from './types';

export const INITIAL_DEVICES: Device[] = [
    { 
        id: '1', 
        name: 'Aeon-Shield Gateway', 
        ip: '192.168.1.1', 
        mac: '00:1A:2B:3C:4D:5E', 
        type: DeviceType.SERVER, 
        status: 'online', 
        riskScore: 0, 
        lastSeen: 'Now', 
        manufacturer: 'Aeon Corp',
        firmwareVersion: 'v2.4.0',
        firmwareStatus: 'up-to-date',
        openPorts: [80, 443, 22],
        vulnerabilities: []
    },
    { 
        id: '2', 
        name: 'Philips Hue Bridge', 
        ip: '192.168.1.10', 
        mac: '00:17:88:01:02:03', 
        type: DeviceType.IOT, 
        status: 'online', 
        riskScore: 12, 
        lastSeen: '2m ago', 
        manufacturer: 'Signify',
        firmwareVersion: '1.50.19',
        firmwareStatus: 'up-to-date',
        openPorts: [80, 443],
        vulnerabilities: []
    },
    { 
        id: '3', 
        name: 'Samsung Smart TV', 
        ip: '192.168.1.14', 
        mac: 'D0:03:4B:01:02:03', 
        type: DeviceType.IOT, 
        status: 'online', 
        riskScore: 25, 
        lastSeen: '5m ago', 
        manufacturer: 'Samsung',
        firmwareVersion: 'T-HKMAKUC-1200',
        firmwareStatus: 'outdated',
        openPorts: [80, 443, 8080],
        vulnerabilities: ['UPnP Enabled']
    },
    { 
        id: '4', 
        name: 'MacBook Pro', 
        ip: '192.168.1.20', 
        mac: 'F0:18:98:01:02:03', 
        type: DeviceType.PC, 
        status: 'online', 
        riskScore: 5, 
        lastSeen: '1m ago', 
        manufacturer: 'Apple',
        firmwareVersion: 'macOS 14.2',
        firmwareStatus: 'up-to-date',
        openPorts: [],
        vulnerabilities: []
    },
    { 
        id: '5', 
        name: 'Unknown Camera', 
        ip: '192.168.1.45', 
        mac: 'A1:B2:C3:D4:E5:F6', 
        type: DeviceType.IOT, 
        status: 'quarantined', 
        riskScore: 92, 
        lastSeen: '10m ago', 
        manufacturer: 'Generic',
        firmwareVersion: 'v1.0.0 (2019)',
        firmwareStatus: 'outdated',
        openPorts: [23, 80, 554],
        vulnerabilities: ['Default Admin/Admin', 'Telnet Exposed', 'Weak RTSP Auth']
    },
    { 
        id: '6', 
        name: 'Decoy IP Camera', 
        ip: '192.168.1.200', 
        mac: 'DE:AD:BE:EF:00:01', 
        type: DeviceType.HONEYPOT, 
        status: 'online', 
        riskScore: 0, 
        lastSeen: 'Now', 
        manufacturer: 'Aeon Deception',
        firmwareVersion: 'Simulated v2.1',
        firmwareStatus: 'up-to-date',
        openPorts: [80, 554],
        vulnerabilities: ['Intentional Weak Creds (Honeytoken)']
    },
];

export const MOCK_LOGS: AgentLog[] = [
    { id: '1', timestamp: '10:00:01', agent: 'Discovery', message: 'Scanning subnet 192.168.1.0/24', level: 'info' },
    { id: '2', timestamp: '10:00:05', agent: 'Discovery', message: 'New device identified: 192.168.1.45 (Generic Camera)', level: 'warning' },
    { id: '3', timestamp: '10:00:12', agent: 'Profiling', message: 'Fetching MUD profile for Samsung Smart TV', level: 'info' },
    { id: '4', timestamp: '10:00:15', agent: 'Profiling', message: 'CRITICAL: Device 192.168.1.45 has open Telnet (Port 23)', level: 'action' },
    { id: '5', timestamp: '10:00:45', agent: 'Profiling', message: 'Anomaly: Device 192.168.1.45 attempting SSH to 192.168.1.20', level: 'action' },
    { id: '6', timestamp: '10:00:46', agent: 'Defense', message: 'Quarantine rule applied to 192.168.1.45 via Edge Firewall', level: 'action' },
    { id: '7', timestamp: '10:01:00', agent: 'Deception', message: 'Deploying Honeytoken: fake_admin_creds.txt', level: 'info' },
];

export const PYTHON_DISCOVERY_CODE = `
import nmap
import json
from scapy.all import ARP, Ether, srp

class DiscoveryAgent:
    def __init__(self, target_ip="192.168.1.0/24"):
        self.target_ip = target_ip
        self.nm = nmap.PortScanner()

    def scan_network(self):
        print(f"[*] Discovery Agent: Scanning {self.target_ip}...")
        
        # Fast ARP Scan with Scapy
        arp = ARP(pdst=self.target_ip)
        ether = Ether(dst="ff:ff:ff:ff:ff:ff")
        packet = ether/arp
        result = srp(packet, timeout=3, verbose=0)[0]

        devices = []
        for sent, received in result:
            devices.append({'ip': received.psrc, 'mac': received.hwsrc})

        # Deep Fingerprinting with Nmap
        for device in devices:
            try:
                # -O: OS Detection, -sV: Service/Version Detection (Firmware)
                self.nm.scan(device['ip'], arguments='-O -sV --script vuln')
                if device['ip'] in self.nm.all_hosts():
                    host = self.nm[device['ip']]
                    device['os'] = host['osmatch'][0]['name'] if host.get('osmatch') else "Unknown"
                    device['ports'] = list(host['tcp'].keys()) if 'tcp' in host else []
                    # Logic to extract firmware version from service banners
            except Exception as e:
                device['error'] = str(e)

        return devices
`;

export const PYTHON_DECEPTION_CODE = `
import socket
import threading
import time

class DeceptionAgent:
    def __init__(self, bind_ip="0.0.0.0", bind_port=22):
        self.bind_ip = bind_ip
        self.bind_port = bind_port
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

    def start_honeypot(self):
        self.sock.bind((self.bind_ip, self.bind_port))
        self.sock.listen(5)
        print(f"[*] Deception Agent: Low-Interaction SSH Honeypot active on {self.bind_port}")

        while True:
            client, addr = self.sock.accept()
            print(f"[!] ALERT: Unauthorized connection from {addr[0]}")
            
            # Log the intrusion attempt for the Defense Agent
            self.log_intrusion(addr[0], "SSH_Connection_Attempt")
            
            # Fake banner to confuse attacker
            client.send(b"SSH-2.0-OpenSSH_8.2p1 Ubuntu-4ubuntu0.1\\r\\n")
            client.close()

    def log_intrusion(self, ip, event_type):
        # In a real system, this pushes to a message queue (Redis/Kafka)
        with open("security_events.log", "a") as f:
            f.write(f"{time.ctime()} | TRIGGER | {ip} | {event_type}\\n")

if __name__ == "__main__":
    agent = DeceptionAgent(bind_port=2222) # Running on high port for safety
    agent.start_honeypot()
`;

export const ARCHITECTURE_MERMAID = `
graph TD
    subgraph "Home Network (LAN)"
        IoT[Smart Bulb/TV]
        PC[User Laptop]
        Attacker[Compromised Device]
    end

    subgraph "Aeon-Shield Appliance"
        subgraph "Network Layer"
            NF[NetFilter / OPNsense]
            Sniffer[Traffic Analyzer]
        end
        
        subgraph "Agentic Core (Local LLM)"
            DA[Discovery Agent]
            PA[Profiling Agent]
            DecA[Deception Agent]
            DefA[Defense Agent]
            Orch[LangGraph Orchestrator]
        end
        
        DB[(Vector DB & Logs)]
    end

    IoT --> NF
    PC --> NF
    Attacker --> NF
    
    NF --> Sniffer
    Sniffer --> PA
    
    Orch --> DA
    DA -- "Nmap/ARP" --> IoT
    
    Orch --> PA
    PA -- "Compare MUD/Firmware" --> DB
    
    Orch --> DecA
    DecA -- "Deploy Honeypot" --> NF
    
    Attacker -- "Attacks Honeypot" --> DecA
    DecA -- "Alert Trigger" --> Orch
    
    Orch --> DefA
    DefA -- "Update IPTables" --> NF
`;

export const ROADMAP_MD = `
### Phase 1: Foundation (Weeks 1-4)
- **Hardware Setup**: Configure Raspberry Pi 5 with Ubuntu Server.
- **Network Layer**: Setup OPNsense or configure IPTables as a bridge.
- **Discovery Agent**: Implement Python/Scapy scripts for continuous ARP scanning.
- **Dashboard V1**: Basic React UI to show connected IPs.

### Phase 2: Intelligence (Weeks 5-8)
- **Local LLM Integration**: Deploy Ollama (Mistral-7B) on the edge device.
- **Profiling Agent**: Ingest MUD profiles and baseline normal traffic patterns.
- **Orchestrator**: Use LangChain/LangGraph to route tasks between agents.

### Phase 3: Defense & Deception (Weeks 9-12)
- **Deception Agent**: Build low-interaction Python honeypots (SSH/Telnet/HTTP).
- **Defense Agent**: API hooks into the firewall to block IPs dynamically.
- **Autonomous Loops**: Test scenarios where a honeypot touch triggers a block.

### Phase 4: Polish & UX (Weeks 13-16)
- **Mobile App/Web Dashboard**: Full React implementation with real-time sockets.
- **Notification System**: Push alerts via Signal/Telegram.
- **Hardening**: Secure the appliance itself against tampering.
`;