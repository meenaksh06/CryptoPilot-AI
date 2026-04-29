import React, { useState, useEffect, useRef } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Activity, Wallet, History, Brain, 
  Terminal, ShieldCheck, AlertCircle, RefreshCw 
} from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [portfolio, setPortfolio] = useState({ balance: 10000, total_value: 10000, positions: {}, history: [] });
  const [currentDecision, setCurrentDecision] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [connected, setConnected] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    connectWS();
    return () => ws.current?.close();
  }, []);

  const connectWS = () => {
    ws.current = new WebSocket('ws://localhost:8888/ws');
    
    ws.current.onopen = () => {
      setConnected(true);
      console.log('Connected to CryptoPilot AI');
    };

    ws.current.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      setMarketData(payload.market_data);
      setCurrentDecision(payload.decision);
      setPortfolio(payload.portfolio);
      
      setData(prev => {
        const newData = [...prev, {
          time: new Date(payload.market_data.timestamp).toLocaleTimeString(),
          price: payload.market_data.price,
          rsi: payload.market_data.rsi
        }].slice(-30);
        return newData;
      });
    };

    ws.current.onclose = () => {
      setConnected(false);
      setTimeout(connectWS, 3000);
    };
  };

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold gradient-text tracking-tight">CryptoPilot AI</h1>
          <p className="text-secondary mt-1 flex items-center gap-2">
            <Activity size={16} className={connected ? "text-accent-green" : "text-accent-red"} />
            {connected ? "Agent Online & Monitoring" : "Reconnecting to Agent..."}
          </p>
        </div>
        <div className="glass px-6 py-4 flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs text-secondary uppercase tracking-widest">Total Value</p>
            <p className="text-2xl font-bold font-mono text-accent-green">${portfolio.total_value.toLocaleString()}</p>
          </div>
          <Wallet className="text-accent-cyan" size={32} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart Section */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <section className="glass p-6 h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <TrendingUp size={20} className="text-accent-cyan" />
                Live Market Analysis
              </h2>
              {marketData && (
                <div className="flex gap-4">
                  <div className="text-right">
                    <p className="text-xs text-secondary">Price</p>
                    <p className="font-mono text-accent-cyan">${marketData.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-secondary">RSI</p>
                    <p className={`font-mono ${marketData.rsi < 30 ? 'text-accent-green' : marketData.rsi > 70 ? 'text-accent-red' : 'text-text-primary'}`}>
                      {marketData.rsi}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="h-[300px] w-full" style={{ minHeight: '300px' }}>
              {data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="time" stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis domain={['auto', 'auto']} stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#141417', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#00f2ff' }}
                    />
                    <Area type="monotone" dataKey="price" stroke="#00f2ff" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center text-secondary italic">
                  Initializing market data stream...
                </div>
              )}
            </div>
          </section>

          {/* Reasoning / Terminal Section */}
          <section className="glass p-6 flex-grow min-h-[250px] relative overflow-hidden">
             <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Brain size={20} className="text-accent-magenta" />
                Agent Reasoning
              </h2>
              <Terminal size={18} className="text-secondary" />
            </div>
            
            {currentDecision ? (
              <div className="animate-slide-in">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
                    currentDecision.action === 'BUY' ? 'bg-green-500/20 text-accent-green' : 
                    currentDecision.action === 'SELL' ? 'bg-red-500/20 text-accent-red' : 
                    'bg-white/10 text-secondary'
                  }`}>
                    {currentDecision.action}
                  </span>
                  <span className="text-xs text-secondary font-mono">
                    Strategy: <span className="text-text-primary">{currentDecision.strategy}</span>
                  </span>
                  <span className="text-xs text-secondary font-mono">
                    Confidence: <span className="text-accent-cyan">{(currentDecision.confidence * 100).toFixed(0)}%</span>
                  </span>
                </div>
                <p className="text-lg leading-relaxed text-text-primary font-medium">
                  "{currentDecision.reason}"
                </p>
                <div className="mt-6 flex gap-2">
                  <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent-cyan transition-all duration-1000" 
                      style={{ width: `${currentDecision.confidence * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-secondary opacity-50 italic">
                <RefreshCw className="animate-spin mb-2" size={24} />
                Waiting for agent decision loop...
              </div>
            )}
          </section>
        </div>

        {/* Sidebar: Portfolio & History */}
        <div className="flex flex-col gap-6">
          <section className="glass p-6">
             <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <ShieldCheck size={20} className="text-accent-green" />
                Portfolio Status
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-secondary text-sm">Cash Balance</span>
                  <span className="font-mono text-accent-green">${portfolio.balance.toLocaleString()}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-secondary uppercase tracking-widest mb-2">Open Positions</p>
                  {Object.keys(portfolio.positions).length > 0 ? (
                    Object.entries(portfolio.positions).map(([symbol, pos]) => (
                      <div key={symbol} className="flex justify-between items-center p-3 border border-white/5 rounded-lg">
                        <div>
                          <p className="font-bold">{symbol}</p>
                          <p className="text-xs text-secondary">{pos.amount.toFixed(4)} units</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono">${(pos.amount * (marketData?.price || pos.entry_price)).toFixed(2)}</p>
                          <p className={`text-[10px] ${marketData?.price > pos.entry_price ? 'text-accent-green' : 'text-accent-red'}`}>
                            {marketData?.price > pos.entry_price ? '+' : ''}{((marketData?.price / pos.entry_price - 1) * 100).toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-sm text-secondary border border-dashed border-white/10 rounded-lg">
                      No open positions
                    </div>
                  )}
                </div>
              </div>
          </section>

          <section className="glass p-6 flex-grow">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <History size={20} className="text-accent-cyan" />
              Recent Activity
            </h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {portfolio.history.length > 0 ? (
                [...portfolio.history].reverse().map((trade, i) => (
                  <div key={trade.id} className="trade-item p-3 border border-white/5 rounded-lg flex justify-between items-center bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${trade.action === 'BUY' ? 'bg-accent-green' : 'bg-accent-red'}`} />
                      <div>
                        <p className="text-xs font-bold">{trade.action} {trade.symbol}</p>
                        <p className="text-[10px] text-secondary">{new Date(trade.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono">${trade.price.toLocaleString()}</p>
                      <p className="text-[9px] text-accent-cyan uppercase">{trade.strategy}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-secondary opacity-30">
                  <AlertCircle className="mx-auto mb-2" size={32} />
                  <p>No trades executed yet</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
