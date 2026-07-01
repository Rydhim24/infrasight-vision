import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, Server, ShieldAlert, Coins, FileText, Loader2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState('architecture');

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:8000/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysis(res.data);
      setActiveTab('architecture');
    } catch (err) {
      console.error(err);
      setError('Failed to analyze the diagram. Ensure the backend is running and Gemini API key is set.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans">
      {/* Navbar */}
      <header className="border-b bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 sticky top-0 z-10 box-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Server className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold tracking-tight">InfraSight AI</h1>
        </div>
        <div className="text-sm font-medium text-slate-500">Cloud Infrastructure Vision Assistant</div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Upload State */}
        {!analysis && (
          <div className="flex flex-col items-center justify-center pt-16">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Analyze Your Cloud Architecture</h2>
            <p className="text-slate-500 mb-8 max-w-lg text-center">
              Upload an AWS, Azure, or GCP diagram to instantly receive an architecture summary, cost optimization tips, and security insights.
            </p>
            
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-2xl p-12 w-full max-w-2xl flex flex-col items-center justify-center transition-colors hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer"
              onClick={() => document.getElementById('fileUpload').click()}
            >
              <input 
                id="fileUpload" 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])} 
              />
              <UploadCloud className="h-12 w-12 text-slate-400 mb-4" />
              <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                {file ? file.name : 'Drag & drop your diagram here'}
              </p>
              <p className="text-sm text-slate-500 mt-2">or click to browse native files</p>
            </div>

            <Button 
              size="lg" 
              className="mt-8 px-8 py-6 text-lg w-full max-w-xs"
              onClick={(e) => { e.stopPropagation(); handleUpload(); }}
              disabled={!file || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing Diagram...
                </>
              ) : 'Generate Insights'}
            </Button>
          </div>
        )}

        {/* Dashboard State */}
        {analysis && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in zoom-in duration-500">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 space-y-1 bg-white border border-slate-200 rounded-xl p-4 h-fit sticky top-24">
              <Button 
                variant={activeTab === 'architecture' ? 'default' : 'ghost'} 
                className="w-full justify-start h-10 px-4"
                onClick={() => setActiveTab('architecture')}
              >
                <Server className="mr-2 h-4 w-4" /> Architecture
              </Button>
              <Button 
                variant={activeTab === 'resources' ? 'default' : 'ghost'} 
                className="w-full justify-start h-10 px-4"
                onClick={() => setActiveTab('resources')}
              >
                <FileText className="mr-2 h-4 w-4" /> Detected Resources
              </Button>
              <Button 
                variant={activeTab === 'security' ? 'default' : 'ghost'} 
                className="w-full justify-start h-10 px-4"
                onClick={() => setActiveTab('security')}
              >
                <ShieldAlert className="mr-2 h-4 w-4" /> Security Risks
              </Button>
              <Button 
                variant={activeTab === 'cost' ? 'default' : 'ghost'} 
                className="w-full justify-start h-10 px-4"
                onClick={() => setActiveTab('cost')}
              >
                <Coins className="mr-2 h-4 w-4" /> Cost Optimization
              </Button>
              
              <div className="pt-6 mt-6 border-t border-slate-100">
                <Button variant="outline" className="w-full" onClick={() => { setAnalysis(null); setFile(null); }}>
                  Analyze New Diagram
                </Button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-6">
              {activeTab === 'architecture' && (
                <Card className="border-slate-200">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                    <CardTitle className="text-xl flex items-center gap-2">
                       Architecture Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
                      <p>{analysis.insights?.summary}</p>
                      
                      <h4 className="mt-8 mb-4 font-semibold text-slate-900 border-b pb-2">Topology Relationships</h4>
                      <ul className="space-y-2">
                        {analysis.graph?.relationships?.map((rel, i) => (
                          <li key={i} className="flex gap-2 items-start">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0"></span>
                            <span>{rel}</span>
                          </li>
                        )) || <li className="text-slate-500 italic">No relationships detected.</li>}
                      </ul>
                      
                      <h4 className="mt-8 mb-4 font-semibold text-slate-900 border-b pb-2">Scalability Guidelines</h4>
                      <ul className="space-y-2">
                        {analysis.insights?.scalability_recommendations?.map((rec, i) => (
                          <li key={i} className="flex gap-2 items-start">
                             <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-500 shrink-0"></span>
                             <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'resources' && (
                <Card className="border-slate-200">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                    <CardTitle className="text-xl">Detected Components</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {analysis.graph?.resources?.map((res, i) => (
                        <div key={i} className="bg-slate-50 border border-slate-100 rounded-lg p-4 flex items-center gap-3">
                          <Server className="h-5 w-5 text-indigo-500" />
                          <span className="font-medium text-slate-700">{res}</span>
                        </div>
                      )) || <div className="text-slate-500 italic">No resources detected.</div>}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'security' && (
                <Card className="border-red-100 bg-red-50/10">
                  <CardHeader className="bg-red-50 border-b border-red-100 pb-4">
                     <CardTitle className="text-xl text-red-700 flex items-center gap-2">
                       <ShieldAlert className="h-5 w-5" /> Threat Analysis
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                     <ul className="space-y-4">
                        {analysis.insights?.security_risks?.map((risk, i) => (
                          <li key={i} className="flex gap-3">
                            <div className="mt-0.5 bg-red-100 text-red-600 rounded-full h-6 w-6 flex items-center justify-center shrink-0 text-xs font-bold">{i+1}</div>
                            <div className="text-slate-700 pt-0.5">{risk}</div>
                          </li>
                        ))}
                     </ul>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'cost' && (
                <Card className="border-emerald-100 bg-emerald-50/10">
                  <CardHeader className="bg-emerald-50 border-b border-emerald-100 pb-4">
                    <CardTitle className="text-xl text-emerald-700 flex items-center gap-2">
                      <Coins className="h-5 w-5" /> Cost Optimization
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="mb-8">
                       <h4 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Estimated Monthly Savings</h4>
                       <div className="h-64 w-full">
                         <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={[
                             { name: 'Architecture Cost', Current: 1450, Optimized: 850 },
                           ]}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} />
                             <XAxis dataKey="name" axisLine={false} tickLine={false} />
                             <YAxis tickFormatter={(value) => `$${value}`} axisLine={false} tickLine={false} />
                             <Tooltip formatter={(value) => `$${value}`} cursor={{fill: 'transparent'}} />
                             <Legend />
                             <Bar dataKey="Current" fill="#ef4444" radius={[4, 4, 0, 0]} />
                             <Bar dataKey="Optimized" fill="#10b981" radius={[4, 4, 0, 0]} />
                           </BarChart>
                         </ResponsiveContainer>
                       </div>
                    </div>
                    
                    <h4 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Actionable Steps</h4>
                    <ul className="space-y-4">
                        {analysis.insights?.cost_optimization?.map((tip, i) => (
                          <li key={i} className="flex gap-3">
                            <div className="mt-0.5 bg-emerald-100 text-emerald-600 rounded-full h-6 w-6 flex items-center justify-center shrink-0 text-xs font-bold">$</div>
                            <div className="text-slate-700 pt-0.5">{tip}</div>
                          </li>
                        ))}
                     </ul>
                  </CardContent>
                </Card>
              )}
            </div>
            
          </div>
        )}
      </main>
    </div>
  );
}