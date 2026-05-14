# CryptoPilot AI 

An agentic cryptocurrency trading AI assistant that autonomously analyzes market data, selects strategies, and executes simulated trades.

## Features
- **Agentic Pipeline**: Autonomous decision-making loop.
- **Dynamic Strategy Selection**: Switches between RSI, DCA,  based on market conditions.
- **Explainable AI**: Provides human-readable reasoning for every action.
- **Simulated Execution**: Virtual portfolio management with real-time balance updates.
- **Premium Dashboard**: High-fidelity React UI with live charts and reasoning logs.

## Tech Stack
- **Backend**: FastAPI (Python)
- **Frontend**: React + Vite
- **Data**: Simulated Market Stream (MarketDataService)
- **Styling**: Vanilla CSS (Premium Design)

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Project Structure
- `backend/app/agent`: Core decision-making logic.
- `backend/app/strategies`: Trading algorithms (RSI, DCA).
- `backend/app/execution`: Simulated trade engine.
- `backend/app/memory`: Performance tracking and feedback data.
- `frontend/src/App.jsx`: Main dashboard UI generating live stats.

## How it Works
1. **Fetch**: The `MarketDataService` generates/fetches live price on live data.
2. **Think**: The `DecisionAgent` analyzes indicators and selects the best strategy.
3. **Execute**: If a signal is generated, the `ExecutionEngine` updates the virtual portfolio.
4. **Learn**: The `MemoryStore` tracks trade success for future strategy adjustments.
5. **Stream**: All updates are sent via WebSocket to the frontend in real-time.
