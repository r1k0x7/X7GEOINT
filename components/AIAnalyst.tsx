'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, MessageSquare, TrendingUp, AlertTriangle, Shield, Globe, Zap, Clock, Send, Loader2, CheckCircle2, XCircle, BarChart3, PieChart, Activity } from 'lucide-react';
import { mockRiskAssessments, mockNews } from '@/lib/mock-data';
import { getThreatLevel } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  confidence?: number;
  sources?: string[];
}

export default function AIAnalyst() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'ai',
      content: 'X7 GEOINT AI Analyst v3.2 initialized. I can analyze global risk patterns, predict conflict escalation, assess military movements, and provide economic risk analysis. What would you like to analyze?',
      timestamp: '2026-06-16T11:04:00Z',
      confidence: 100,
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'predictions' | 'reports'>('chat');

  const sampleQueries = [
    'Analyze Taiwan Strait conflict probability',
    'Predict Ukraine escalation 30 days',
    'Assess Middle East energy risk',
    'Global supply chain vulnerabilities',
  ];

  const predictions = [
    {
      region: 'Taiwan Strait',
      probability: 78,
      riskLevel: 'HIGH',
      timeframe: '30 days',
      indicators: ['Naval exercises increased', 'ADIZ violations up 340%', 'Diplomatic tensions rising'],
      trend: 'increasing',
    },
    {
      region: 'Ukraine',
      probability: 92,
      riskLevel: 'CRITICAL',
      timeframe: '7 days',
      indicators: ['Major offensive detected', 'Artillery activity +500%', 'Casualties increasing'],
      trend: 'increasing',
    },
    {
      region: 'Middle East',
      probability: 85,
      riskLevel: 'CRITICAL',
      timeframe: '14 days',
      indicators: ['Regional alliances shifting', 'Nuclear facility activity', 'Proxy conflicts expanding'],
      trend: 'stable',
    },
    {
      region: 'Arctic',
      probability: 45,
      riskLevel: 'ELEVATED',
      timeframe: '90 days',
      indicators: ['Icebreaker deployments up', 'Submarine patrols increased', 'Territorial disputes'],
      trend: 'increasing',
    },
  ];

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: generateAIResponse(input),
        timestamp: new Date().toISOString(),
        confidence: 87,
        sources: ['ACLED', 'GDELT', 'Satellite Imagery', 'Open Source Intel'],
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 2000);
  };

  const generateAIResponse = (query: string): string => {
    if (query.toLowerCase().includes('taiwan')) {
      return `TAIWAN STRAIT ANALYSIS:

Probability Score: 78/100 (HIGH RISK)

Key Indicators:
• PLA naval exercises increased 340% in past 30 days
• ADIZ violations: 47 sorties in last week
• US naval presence: 2 carrier groups deployed
• Diplomatic channels showing strain

Risk Assessment:
The probability of military escalation in the Taiwan Strait within 30 days is assessed at 78%. Key drivers include increased PLA exercises, diplomatic tensions, and regional alliance shifts.

Recommended Actions:
• Monitor satellite imagery for force buildup
• Track ADIZ violation patterns
• Assess supply chain vulnerabilities`;
    }
    if (query.toLowerCase().includes('ukraine')) {
      return `UKRAINE CONFLICT ANALYSIS:

Probability Score: 92/100 (CRITICAL)

Key Indicators:
• Major offensive operations detected in eastern sector
• Artillery activity increased 500% in past 7 days
• Casualty rates: 1,247 confirmed in 24 hours
• NATO force posture: Alert Level 3

Risk Assessment:
Conflict escalation probability within 7 days is CRITICAL at 92%. Indicators suggest preparation for major offensive operations.

Recommended Actions:
• Monitor border crossings and logistics hubs
• Track refugee flow patterns
• Assess energy infrastructure vulnerability`;
    }
    return `ANALYSIS COMPLETE:

Based on current OSINT feeds, satellite imagery, and geopolitical indicators, the queried region shows elevated risk patterns.

Key Findings:
• Military activity above baseline
• Diplomatic communications showing tension
• Economic indicators suggesting instability
• Regional alliances shifting

Confidence Level: 87%
Data Sources: ACLED, GDELT, Satellite Imagery, Open Source Intelligence

Recommend continuous monitoring for pattern changes.`;
  };

  return (
    <div className="space-y-4">
      {/* AI Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="hud-panel p-3">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-4 h-4 text-x7-military" />
            <span className="text-[10px] font-mono text-x7-text-muted">AI STATUS</span>
          </div>
          <p className="text-lg font-display font-bold text-x7-military">ONLINE</p>
        </div>
        <div className="hud-panel p-3">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-x7-blue" />
            <span className="text-[10px] font-mono text-x7-text-muted">PROCESSING</span>
          </div>
          <p className="text-lg font-display font-bold text-x7-blue">2.4 TFLOPS</p>
        </div>
        <div className="hud-panel p-3">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-x7-orange" />
            <span className="text-[10px] font-mono text-x7-text-muted">ACCURACY</span>
          </div>
          <p className="text-lg font-display font-bold text-x7-orange">87.3%</p>
        </div>
        <div className="hud-panel p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-x7-text-muted" />
            <span className="text-[10px] font-mono text-x7-text-muted">LATENCY</span>
          </div>
          <p className="text-lg font-display font-bold text-x7-text-muted">1.2s</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="hud-panel p-4">
        <div className="hud-title">X7 STRATEGIC AI</div>
        <div className="flex gap-2 mb-4">
          {(['chat', 'predictions', 'reports'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-mono border rounded transition-all ${
                activeTab === tab
                  ? 'bg-x7-military/20 border-x7-military text-x7-military'
                  : 'bg-x7-gray/20 border-x7-border/30 text-x7-text-muted hover:border-x7-military/30'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Chat Messages */}
              <div className="h-[400px] overflow-y-auto space-y-3 p-2 bg-x7-black/50 border border-x7-border/30 rounded">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'ai' ? 'bg-x7-military/20' : 'bg-x7-blue/20'
                    }`}>
                      {msg.role === 'ai' ? <Brain className="w-4 h-4 text-x7-military" /> : <MessageSquare className="w-4 h-4 text-x7-blue" />}
                    </div>
                    <div className={`max-w-[80%] p-3 rounded ${
                      msg.role === 'ai' ? 'bg-x7-gray/20 border border-x7-military/30' : 'bg-x7-blue/10 border border-x7-blue/30'
                    }`}>
                      <p className="text-xs font-mono whitespace-pre-wrap text-x7-text">{msg.content}</p>
                      {msg.confidence && (
                        <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-x7-text-muted">
                          <CheckCircle2 className="w-3 h-3 text-x7-military" />
                          Confidence: {msg.confidence}%
                        </div>
                      )}
                      {msg.sources && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {msg.sources.map((source, i) => (
                            <span key={i} className="px-1.5 py-0.5 text-[9px] font-mono bg-x7-gray/50 text-x7-blue rounded">
                              {source}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex items-center gap-2 text-x7-military">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-xs font-mono">AI ANALYZING...</span>
                  </div>
                )}
              </div>

              {/* Quick Queries */}
              <div className="flex flex-wrap gap-2">
                {sampleQueries.map((query) => (
                  <button
                    key={query}
                    onClick={() => {
                      setInput(query);
                    }}
                    className="px-3 py-1.5 text-[10px] font-mono bg-x7-gray/20 border border-x7-border/30 rounded text-x7-text-muted hover:border-x7-military/30 hover:text-x7-military transition-all"
                  >
                    {query}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask AI Analyst..."
                  className="flex-1 px-4 py-2 bg-x7-gray/20 border border-x7-border/30 rounded text-xs font-mono text-x7-text placeholder:text-x7-text-muted focus:outline-none focus:border-x7-military/50"
                />
                <button
                  onClick={handleSend}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-x7-military/20 border border-x7-military text-x7-military rounded hover:bg-x7-military/30 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'predictions' && (
            <motion.div
              key="predictions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              {predictions.map((pred, i) => {
                const threat = getThreatLevel(pred.probability);
                return (
                  <div key={pred.region} className="p-3 bg-x7-gray/20 border border-x7-border/30 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-x7-text">{pred.region.toUpperCase()}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${threat.className}`}>
                        {pred.riskLevel}
                      </span>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-[10px] font-mono text-x7-text-muted mb-1">
                        <span>PROBABILITY</span>
                        <span>{pred.probability}%</span>
                      </div>
                      <div className="w-full h-2 bg-x7-gray/50 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pred.probability}%`, backgroundColor: threat.color }}
                        />
                      </div>
                    </div>
                    <p className="text-[10px] font-mono text-x7-text-muted mb-1">TIMEFRAME: {pred.timeframe}</p>
                    <div className="space-y-1">
                      {pred.indicators.map((ind, j) => (
                        <div key={j} className="flex items-center gap-1 text-[10px] font-mono text-x7-text-muted">
                          <AlertTriangle className="w-3 h-3 text-x7-orange" />
                          {ind}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div
              key="reports"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {mockNews.slice(0, 3).map((news) => (
                <div key={news.id} className="p-3 bg-x7-gray/20 border border-x7-border/30 rounded">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xs font-mono text-x7-text">{news.title}</h3>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      news.sentiment === 'negative' ? 'bg-x7-red/20 text-x7-red' : 'bg-x7-military/20 text-x7-military'
                    }`}>
                      {news.sentiment.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-x7-text-muted mb-2">{news.summary}</p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-x7-text-muted">
                    <span>{news.source}</span>
                    <span>{news.timestamp.split('T')[1].substring(0, 5)}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
