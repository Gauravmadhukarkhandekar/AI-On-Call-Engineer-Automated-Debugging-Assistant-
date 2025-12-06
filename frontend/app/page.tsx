'use client';

import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, AlertCircle, CheckCircle2, Clock, Loader2, Sparkles, Zap, Shield, TrendingUp } from 'lucide-react';
import { uploadLog, getIncidents, type Incident } from '@/lib/api';
import { format } from 'date-fns';

export default function Home() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadIncidents();
    // Poll for updates every 5 seconds
    const interval = setInterval(loadIncidents, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadIncidents = async () => {
    try {
      const data = await getIncidents();
      setIncidents(data);
    } catch (error) {
      console.error('Failed to load incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      await uploadLog(selectedFile);
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('log-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      await loadIncidents();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload log file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = (status: Incident['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'analyzing':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Incident['status']) => {
    switch (status) {
      case 'completed':
        return 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50';
      case 'failed':
        return 'border-red-300 bg-gradient-to-br from-red-50 to-rose-50';
      case 'analyzing':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50';
      default:
        return 'border-gray-300 bg-gradient-to-br from-gray-50 to-slate-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 gradient-mesh">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Header */}
        <div className="mb-12 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-lg shadow-indigo-500/50">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            AI On-Call Engineer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Automated Debugging Assistant powered by AI to identify root causes and suggest fixes
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700">Production Ready</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Real-time Analysis</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm p-1.5">
            <TabsTrigger 
              value="upload"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Logs
            </TabsTrigger>
            <TabsTrigger 
              value="dashboard"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              <FileText className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="animate-slide-up">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Upload className="h-6 w-6 text-indigo-600" />
                  Upload Production Logs
                </CardTitle>
                <CardDescription className="text-base">
                  Drag and drop your log files or click to browse. Supports .log, .txt, and .json files
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Drag and Drop Zone */}
                <div
                  ref={dropZoneRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
                    transition-all duration-300
                    ${isDragging 
                      ? 'border-indigo-500 bg-indigo-50 scale-105' 
                      : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50'
                    }
                    ${selectedFile ? 'border-green-400 bg-green-50/50' : ''}
                  `}
                >
                  <input
                    ref={fileInputRef}
                    id="log-file"
                    type="file"
                    accept=".log,.txt,.json"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="hidden"
                  />
                  
                  {selectedFile ? (
                    <div className="space-y-3">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <p className="text-xs text-gray-400">Click to select a different file</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100">
                        <Upload className="h-8 w-8 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-700">
                          Drop your log file here
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          or click to browse files
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  size="lg"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Upload and Analyze with AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard" className="animate-slide-up">
            <div className="space-y-6">
              {/* Stats Cards */}
              {incidents.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Completed</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {incidents.filter(i => i.status === 'completed').length}
                          </p>
                        </div>
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Analyzing</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {incidents.filter(i => i.status === 'analyzing').length}
                          </p>
                        </div>
                        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Failed</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {incidents.filter(i => i.status === 'failed').length}
                          </p>
                        </div>
                        <AlertCircle className="h-8 w-8 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <FileText className="h-6 w-6 text-indigo-600" />
                    Incident Dashboard
                  </CardTitle>
                  <CardDescription className="text-base">
                    Track all analyzed incidents and their AI-generated insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
                      <p className="text-gray-600">Loading incidents...</p>
                    </div>
                  ) : incidents.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 mb-6">
                        <FileText className="h-10 w-10 text-indigo-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No incidents yet
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Upload a log file to get started with AI-powered analysis
                      </p>
                      <Button
                        onClick={() => {
                          const uploadTab = document.querySelector('[value="upload"]') as HTMLElement;
                          uploadTab?.click();
                        }}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Your First Log
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {incidents.map((incident, index) => (
                        <Card
                          key={incident.id}
                          className={`
                            ${getStatusColor(incident.status)} 
                            transition-all duration-300 
                            hover:shadow-lg hover:scale-[1.01]
                            border-2
                            animate-slide-up
                          `}
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="p-2 rounded-lg bg-white/80">
                                    {getStatusIcon(incident.status)}
                                  </div>
                                  <CardTitle className="text-xl">{incident.fileName}</CardTitle>
                                </div>
                                <CardDescription className="flex items-center gap-4 flex-wrap">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {format(new Date(incident.createdAt), 'PPp')}
                                  </span>
                                  {incident.analyzedAt && (
                                    <span className="flex items-center gap-1">
                                      <Sparkles className="h-4 w-4" />
                                      Analyzed {format(new Date(incident.analyzedAt), 'PPp')}
                                    </span>
                                  )}
                                </CardDescription>
                              </div>
                              <span className={`
                                px-4 py-1.5 text-xs font-bold rounded-full
                                ${incident.status === 'completed' ? 'bg-green-100 text-green-700' : ''}
                                ${incident.status === 'analyzing' ? 'bg-blue-100 text-blue-700' : ''}
                                ${incident.status === 'failed' ? 'bg-red-100 text-red-700' : ''}
                                ${incident.status === 'pending' ? 'bg-gray-100 text-gray-700' : ''}
                              `}>
                                {incident.status.toUpperCase()}
                              </span>
                            </div>
                          </CardHeader>
                          {incident.status === 'completed' && (
                            <CardContent className="space-y-4 pt-0">
                              {incident.summary && (
                                <div className="p-4 rounded-lg bg-white/80 border border-gray-200">
                                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-indigo-600" />
                                    Summary
                                  </h4>
                                  <p className="text-sm text-gray-700 leading-relaxed">
                                    {incident.summary}
                                  </p>
                                </div>
                              )}
                              {incident.rootCause && (
                                <div className="p-4 rounded-lg bg-white/80 border border-orange-200">
                                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-orange-600" />
                                    Root Cause
                                  </h4>
                                  <p className="text-sm text-gray-700 leading-relaxed">
                                    {incident.rootCause}
                                  </p>
                                </div>
                              )}
                              {incident.suggestedFix && (
                                <div className="p-4 rounded-lg bg-white/80 border border-green-200">
                                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-green-600" />
                                    Suggested Fix
                                  </h4>
                                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {incident.suggestedFix}
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          )}
                          {incident.status === 'failed' && incident.errorMessage && (
                            <CardContent>
                              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                                <div className="flex items-start gap-2">
                                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                                  <div>
                                    <strong className="text-red-900">Error:</strong>
                                    <p className="text-sm text-red-700 mt-1">{incident.errorMessage}</p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          )}
                          {incident.status === 'analyzing' && (
                            <CardContent>
                              <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
                                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                                <p className="text-sm text-blue-700 font-medium">
                                  AI is analyzing your log file. This may take a few moments...
                                </p>
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

