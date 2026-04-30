# CryptoPilot AI: System Architecture

The following diagram illustrates the agentic pipeline and data flow of the CryptoPilot AI system.

```mermaid
graph TD
    subgraph Frontend [React Dashboard]
        UI[Dashboard UI]
        WS_Client[WebSocket Client]
        Charts[Real-time Charts]
    end

    subgraph Backend [FastAPI Server]
        API[FastAPI Routes]
        WS_Server[WebSocket Server]
        
        subgraph AgentCore [Agentic Pipeline]
            DataService[Market Data Service]
            Indicators[Indicator Engine]
            DecisionAgent[Decision Agent]
            StrategyEngine[Strategy Selector]
        end
        
        subgraph ExecutionLayer [Execution & Memory]
            SimEngine[Execution Engine]
            Memory[Memory Store]
        end
    end

    DataService -->|Prices| Indicators
    Indicators -->|Signals| DecisionAgent
    DecisionAgent -->|Selected Strategy| StrategyEngine
    StrategyEngine -->|Trade Action| SimEngine
    SimEngine -->|Trade Result| Memory
    Memory -->|Feedback| DecisionAgent
    
    DataService -.->|Broadcast| WS_Server
    DecisionAgent -.->|Reasoning| WS_Server
    SimEngine -.->|Updates| WS_Server
    WS_Server <==>|Real-time Stream| WS_Client
    WS_Client --> UI
    WS_Client --> Charts
```

## Component Breakdown

### 1. Agentic Pipeline
- **Market Data Service**: Simulates or fetches live crypto prices.
- **Indicator Engine**: Extracts technical features like RSI, MACD, and Volatility.
- **Decision Agent**: The brain of the system. Evaluates indicators and selects the optimal strategy.
- **Strategy Selector**: Executes specific logic (RSI-based, DCA, or Trend Following).

### 2. Execution & Memory
- **Execution Engine**: Manages virtual wallet, calculates PnL, and handles order simulation.
- **Memory Store**: Persists trade history and provides the data necessary for the agent's feedback loop.

### 3. Frontend Dashboard
- A high-fidelity React interface that visualizes the agent's "thought process" and portfolio performance in real-time.
