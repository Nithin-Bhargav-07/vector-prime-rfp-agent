import React, { useState } from 'react';
import axios from 'axios';
import { 
  Upload, FileText, Zap, DollarSign, Loader2, BarChart3, 
  ShieldCheck, ChevronRight, LayoutDashboard, Inbox, PieChart, 
  TrendingUp, Clock, CheckCircle2, AlertCircle,
  MessageSquare, X, Send, Bot 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, LineChart, Line, AreaChart, Area 
} from 'recharts';

// --- MOCK DATA FOR ANALYTICS ---
const winRateData = [
  { month: 'Jan', manual: 15, ai: 40 },
  { month: 'Feb', manual: 18, ai: 55 },
  { month: 'Mar', manual: 16, ai: 68 },
  { month: 'Apr', manual: 14, ai: 85 },
];

const processingTimeData = [
  { name: 'Manual', hours: 480, fill: '#ef4444' }, // 20 days
  { name: 'Vector Prime', hours: 18, fill: '#22c55e' }, // 18 hours
];

// --- MOCK DATA FOR INBOX ---
const recentRFPs = [
  { id: 'RFP-2025-001', client: 'Metro Rail Corp', value: '₹4.5 Cr', status: 'Qualified', date: '2 hrs ago', match: '92%' },
  { id: 'RFP-2025-002', client: 'Greenfield Airport', value: '₹12.0 Cr', status: 'Processing', date: '4 hrs ago', match: 'Pending' },
  { id: 'RFP-2025-003', client: 'City Hospital Ext', value: '₹85 L', status: 'Action Required', date: '1 day ago', match: '95%' },
  { id: 'RFP-2025-004', client: 'Tech Park Facade', value: '₹2.1 Cr', status: 'Rejected', date: '2 days ago', match: '15%' },
];

function App() {
  const [activeTab, setActiveTab] = useState('analyze'); 
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // --- CHATBOT STATE ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can i help you today?", sender: 'bot' }
  ]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/analyze-rfp", formData);
      setResult(response.data);
    } catch (error) {
      console.error("Error", error);
      alert("Backend not reachable. Ensure uvicorn is running.");
    } finally {
      setLoading(false);
    }
  };

  // --- UPDATED CHAT LOGIC ---
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { id: Date.now(), text: chatInput, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setChatInput("");

    setTimeout(() => {
      let botResponse = "I can help with 'active counts', 'expired listings', 'pricing', or 'technical specs'.";
      const lowerInput = userMsg.text.toLowerCase();

      // --- LOGIC: DATABASE QUERIES ---
      if (lowerInput.includes('active') || lowerInput.includes('current') || lowerInput.includes('open')) {
        botResponse = "There are currently **12 Active RFPs** in the pipeline:\n• 4 Qualified (High Priority)\n• 3 Processing\n• 5 Pending Review.";
      } 
      else if (lowerInput.includes('expired') || lowerInput.includes('old') || lowerInput.includes('closed')) {
        botResponse = "I found **8 Expired RFPs** from the last quarter. Would you like me to archive them or generate a 'Loss Analysis' report?";
      }
      else if (lowerInput.includes('total') || lowerInput.includes('how many')) {
        botResponse = "Total Database Count: **342 RFPs** processed this year. We have bid on 150 of them.";
      }
      
      // --- LOGIC: SPECIFIC RFP DETAILS ---
      else if (lowerInput.includes('summary') || lowerInput.includes('about')) {
        botResponse = "This is a tender for the Blue Horizon Corporate Extension. It requires painting ~85,000 sq ft with specific waterproofing and high-gloss finishes.";
      } else if (lowerInput.includes('warranty') || lowerInput.includes('guarantee')) {
        botResponse = "Critical Requirement: The client mandates a **10-year performance warranty** for all exterior coatings (Section 2.A).";
      } else if (lowerInput.includes('water') || lowerInput.includes('rain')) {
        botResponse = "Yes, the site is in a high-rainfall zone. I have prioritized **Apex Ultima Protek** because it has superior crack-bridging and anti-algal properties.";
      } else if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('value')) {
        botResponse = "The total estimated project value is **₹9.8 Crores**. This includes a healthy 22% margin based on our current distributor pricing.";
      } else if (lowerInput.includes('sku') || lowerInput.includes('product')) {
        botResponse = "I recommend 3 core products: Apex Ultima (Exterior), Royale Aspira (Interior), and Apcolite Enamel (Metal Structures).";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
    }, 800);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-300 font-sans overflow-hidden relative">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-slate-900 border-r border-white/5 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-2 border-b border-white/5">
          <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Vector<span className="text-slate-500">Prime</span></span>
        </div>

        <nav className="p-4 space-y-2 flex-1">
          <SidebarItem icon={<Inbox size={20} />} label="RFP Inbox" active={activeTab === 'inbox'} onClick={() => setActiveTab('inbox')} />
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Analyze New" active={activeTab === 'analyze'} onClick={() => setActiveTab('analyze')} />
          <SidebarItem icon={<PieChart size={20} />} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="bg-gradient-to-br from-cyan-900/30 to-purple-900/30 rounded-xl p-4 border border-white/5">
            <p className="text-xs text-cyan-400 font-bold mb-1">SYSTEM STATUS</p>
            <div className="flex items-center gap-2 text-sm text-green-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Agents Online
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        <div className="p-8 max-w-7xl mx-auto">
          
          <AnimatePresence mode='wait'>
            
            {/* TAB 1: INBOX */}
            {activeTab === 'inbox' && (
              <motion.div 
                key="inbox"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <header className="mb-8">
                  <h1 className="text-3xl font-bold text-white">RFP Inbox</h1>
                  <p className="text-slate-500">Real-time monitoring from 50+ portals (Gem, TendersInfo, etc.)</p>
                </header>

                <div className="bg-slate-900/50 backdrop-blur border border-white/10 rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <th className="p-6">RFP ID / Client</th>
                        <th className="p-6">Value</th>
                        <th className="p-6">Status</th>
                        <th className="p-6">Match Score</th>
                        <th className="p-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {recentRFPs.map((rfp) => (
                        <tr key={rfp.id} className="hover:bg-white/5 transition group">
                          <td className="p-6">
                            <div className="font-bold text-white">{rfp.client}</div>
                            <div className="text-xs text-slate-500">{rfp.id} • {rfp.date}</div>
                          </td>
                          <td className="p-6 text-white font-mono">{rfp.value}</td>
                          <td className="p-6">
                            <StatusBadge status={rfp.status} />
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${rfp.match.includes('9') ? 'bg-green-500' : 'bg-slate-600'}`} 
                                  style={{ width: rfp.match !== 'Pending' ? rfp.match : '0%' }}
                                ></div>
                              </div>
                              <span className="text-sm font-bold text-slate-400">{rfp.match}</span>
                            </div>
                          </td>
                          <td className="p-6 text-right">
                            <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium opacity-0 group-hover:opacity-100 transition">
                              Review &rarr;
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* TAB 2: ANALYTICS */}
            {activeTab === 'analytics' && (
              <motion.div 
                key="analytics"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-6"
              >
                <header className="mb-8">
                  <h1 className="text-3xl font-bold text-white">Performance Analytics</h1>
                  <p className="text-slate-500">Impact metrics since deployment</p>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricCard title="Win Rate" value="85%" change="+70%" icon={<TrendingUp className="text-green-500" />} />
                  <MetricCard title="Processing Time" value="18 Hrs" change="-95%" icon={<Clock className="text-cyan-500" />} />
                  <MetricCard title="Est. Revenue" value="₹98 Cr" change="+2.5x" icon={<DollarSign className="text-purple-500" />} />
                  <MetricCard title="RFPs Processed" value="342" change="Year to Date" icon={<FileText className="text-orange-500" />} />
                </div>

                <div className="grid lg:grid-cols-2 gap-6 mt-6">
                  {/* Win Rate Graph */}
                  <div className="bg-slate-900/50 border border-white/10 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-6">Win Rate Transformation</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={winRateData}>
                          <defs>
                            <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                          <XAxis dataKey="month" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} 
                            itemStyle={{ color: '#fff' }}
                          />
                          <Area type="monotone" dataKey="ai" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorAi)" name="With AI Agent" />
                          <Area type="monotone" dataKey="manual" stroke="#94a3b8" fillOpacity={0.1} fill="#94a3b8" name="Manual Process" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Processing Time Graph */}
                  <div className="bg-slate-900/50 border border-white/10 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-6">Time Savings per RFP (Hours)</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={processingTimeData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                          <XAxis type="number" stroke="#94a3b8" />
                          <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
                          <RechartsTooltip cursor={{fill: '#ffffff10'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                          <Bar dataKey="hours" radius={[0, 4, 4, 0]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: ANALYZE */}
            {activeTab === 'analyze' && (
              <motion.div 
                key="analyze"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-4xl mx-auto"
              >
                {!result && !loading && (
                  <div className="text-center py-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Start New Analysis</h1>
                    <p className="text-slate-400 mb-12">Upload a Tender Document (PDF) to initiate the swarm.</p>
                    
                    <div className="relative group w-full max-w-lg mx-auto">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                      <div className="relative bg-slate-900 rounded-2xl border border-white/10 p-12 flex flex-col items-center justify-center hover:bg-slate-800/80 transition cursor-pointer">
                        <input type="file" accept=".pdf" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
                          <Upload className="w-6 h-6 text-cyan-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Upload RFP PDF</h3>
                        <p className="text-sm text-slate-500">AI Auto-Extraction & Matching</p>
                      </div>
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="text-center py-20">
                     <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-6" />
                     <h2 className="text-2xl font-bold text-white">Swarm Agents Active</h2>
                     <p className="text-slate-400 mt-2">Extracting Specs &bull; Querying Vector DB &bull; Calculating Margins</p>
                  </div>
                )}

                {result && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
                      <button onClick={() => setResult(null)} className="text-sm text-slate-400 hover:text-white">Start Over</button>
                    </div>
                    
                    {/* Summary & Tags */}
                    <div className="bg-slate-900/50 border border-white/10 p-6 rounded-2xl">
                       <h3 className="text-white font-bold mb-2 flex items-center gap-2"><FileText size={18} className="text-purple-400"/> Executive Summary</h3>
                       <p className="text-slate-400 leading-relaxed mb-4">{result.summary}</p>
                       <div className="flex flex-wrap gap-2">
                         {result.requirements.map((req, i) => (
                           <span key={i} className="px-3 py-1 bg-cyan-900/20 text-cyan-300 border border-cyan-500/20 rounded-full text-xs font-bold uppercase">{req}</span>
                         ))}
                       </div>
                    </div>

                    {/* Products & Cost */}
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 space-y-4">
                        {result.recommended_products.map((prod, i) => (
                          <div key={i} className="bg-slate-900/50 border border-white/10 p-4 rounded-xl flex justify-between items-center hover:bg-white/5 transition">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-slate-500">{i+1}</div>
                              <div>
                                <h4 className="text-white font-bold">{prod.name}</h4>
                                <p className="text-xs text-slate-500">{prod.sku_id}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-green-400 font-bold">{prod.match_score} Match</div>
                              <div className="text-xs text-slate-500">₹{prod.unit_price}/unit</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-white/10 p-6 rounded-2xl flex flex-col justify-center text-center">
                        <div className="mx-auto w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                          <DollarSign className="text-white" />
                        </div>
                        <div className="text-slate-400 text-sm mb-1">Total Estimated Value</div>
                        <div className="text-3xl font-bold text-white">₹{result.total_estimated_cost.toLocaleString()}</div>
                        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-xs">
                           <span className="text-slate-400">Margin</span>
                           <span className="text-green-400 font-bold">22% Verified</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* --- FLOATING CHAT WIDGET --- */}
      <AnimatePresence>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full shadow-lg shadow-cyan-500/20 flex items-center justify-center z-50 transition-colors"
        >
          {isChatOpen ? <X /> : <MessageSquare />}
        </motion.button>

        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-8 w-80 md:w-96 h-[500px] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col backdrop-blur-xl"
          >
            {/* Chat Header */}
            <div className="p-4 bg-slate-800/50 border-b border-white/5 flex items-center gap-3">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">RFP Copilot</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs text-slate-400">Online & Ready</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/30">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-cyan-600 text-white rounded-tr-none' 
                        : 'bg-slate-800 border border-white/5 text-slate-300 rounded-tl-none'
                    }`}
                    style={{ whiteSpace: 'pre-line' }} // Allows line breaks in bot responses
                    dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} 
                  />
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-white/5 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask 'How many active' or 'expired'..."
                className="flex-1 bg-slate-950 border border-white/10 text-white text-sm rounded-xl px-4 focus:outline-none focus:border-cyan-500/50 transition"
              />
              <button 
                type="submit"
                className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// --- HELPER COMPONENTS ---
function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${active ? 'bg-gradient-to-r from-cyan-900/50 to-purple-900/50 text-white border border-white/10' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
}

function StatusBadge({ status }) {
  const styles = {
    'Qualified': 'bg-green-500/20 text-green-400 border-green-500/20',
    'Processing': 'bg-blue-500/20 text-blue-400 border-blue-500/20',
    'Action Required': 'bg-orange-500/20 text-orange-400 border-orange-500/20',
    'Rejected': 'bg-red-500/20 text-red-400 border-red-500/20',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles['Qualified']}`}>
      {status}
    </span>
  );
}

function MetricCard({ title, value, change, icon }) {
  return (
    <div className="bg-slate-900/50 border border-white/10 p-5 rounded-xl">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
        <span className="text-xs font-mono text-green-400 bg-green-900/20 px-2 py-1 rounded">{change}</span>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-slate-500">{title}</div>
    </div>
  );
}

export default App;
