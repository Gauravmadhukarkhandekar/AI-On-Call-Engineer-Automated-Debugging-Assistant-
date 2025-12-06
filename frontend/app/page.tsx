'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, AlertCircle, CheckCircle2, Clock, Loader2, Sparkles, Zap, Brain, Rocket, Star, X, Send } from 'lucide-react';
import { uploadLog, getIncidents, type Incident } from '@/lib/api';
import { format } from 'date-fns';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

export default function Home() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadIncidents();
    // Poll for updates every 5 seconds
    const interval = setInterval(loadIncidents, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Auto-select first incident if none selected
    if (!selectedIncident && incidents.length > 0) {
      setSelectedIncident(incidents[0]);
    }
    // Update selected incident if it changed
    if (selectedIncident) {
      const updated = incidents.find(i => i.id === selectedIncident.id);
      if (updated) setSelectedIncident(updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incidents]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedIncident]);

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
      const response = await uploadLog(selectedFile);
      setSelectedFile(null);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      // Reload incidents and select the new one
      await loadIncidents();
      // Find the newly created incident
      const updatedIncidents = await getIncidents();
      const newIncident = updatedIncidents.find(i => i.id === response.incidentId);
      if (newIncident) {
        setSelectedIncident(newIncident);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload log file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleNewChat = () => {
    setSelectedIncident(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };


  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        incidents={incidents}
        selectedIncident={selectedIncident}
        onSelectIncident={setSelectedIncident}
        onNewChat={handleNewChat}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Navbar */}
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto">
          {!selectedIncident && !selectedFile ? (
            /* Welcome Screen */
            <div className="flex flex-col items-center justify-center h-full px-4">
              <div className="max-w-2xl w-full text-center animate-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 mb-6">
                  <Image 
                    src="/Ailogo.png" 
                    alt="AI On-Call Engineer Logo" 
                    width={80} 
                    height={80}
                    className="object-contain"
                  />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  AI On-Call Engineer
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Upload your production logs and get instant AI-powered analysis
                </p>

                {/* Upload Zone */}
                <Card className="border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors">
                  <CardContent className="p-12">
                    <div
                      ref={dropZoneRef}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`
                        text-center cursor-pointer transition-all
                        ${isDragging ? 'scale-105' : ''}
                      `}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".log,.txt,.json"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="hidden"
                      />
                      {selectedFile ? (
                        <div className="space-y-4">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{(selectedFile as File).name}</p>
                            <p className="text-sm text-gray-500">{((selectedFile as File).size / 1024).toFixed(2)} KB</p>
                          </div>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpload();
                            }}
                            disabled={uploading}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                          >
                            {uploading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing...
                              </>
                            ) : (
                              <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Analyze with AI
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100">
                            <Upload className="h-8 w-8 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-gray-700 mb-1">
                              Drop your log file here
                            </p>
                            <p className="text-sm text-gray-500">or click to browse</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : selectedIncident ? (
            /* Incident View */
            <div className="max-w-4xl mx-auto px-4 py-8">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedIncident.fileName}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {format(new Date(selectedIncident.createdAt), 'PPp')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedIncident.status === 'completed' && (
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                        Completed
                      </span>
                    )}
                    {selectedIncident.status === 'analyzing' && (
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Analyzing
                      </span>
                    )}
                    {selectedIncident.status === 'failed' && (
                      <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                        Failed
                      </span>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-4">
                  {/* User Message */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-indigo-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                        <p className="text-gray-900">Uploaded log file: <strong>{selectedIncident.fileName}</strong></p>
                      </div>
                    </div>
                  </div>

                  {/* AI Response */}
                  {selectedIncident.status === 'completed' && (
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-4">
                        {selectedIncident.summary && (
                          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center gap-2 mb-3">
                              <FileText className="h-5 w-5 text-indigo-600" />
                              <h3 className="font-semibold text-gray-900">Summary</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{selectedIncident.summary}</p>
                          </div>
                        )}
                        {selectedIncident.rootCause && (
                          <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-200">
                            <div className="flex items-center gap-2 mb-3">
                              <AlertCircle className="h-5 w-5 text-orange-600" />
                              <h3 className="font-semibold text-gray-900">Root Cause</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{selectedIncident.rootCause}</p>
                          </div>
                        )}
                        {selectedIncident.suggestedFix && (
                          <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-200">
                            <div className="flex items-center gap-2 mb-3">
                              <Zap className="h-5 w-5 text-green-600" />
                              <h3 className="font-semibold text-gray-900">Suggested Fix</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedIncident.suggestedFix}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedIncident.status === 'analyzing' && (
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                          <div className="flex items-center gap-3">
                            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                            <p className="text-gray-700">AI is analyzing your log file. This may take a few moments...</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedIncident.status === 'failed' && selectedIncident.errorMessage && (
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="bg-red-50 rounded-2xl p-6 shadow-sm border border-red-200">
                          <p className="text-red-800 font-medium mb-1">Analysis Failed</p>
                          <p className="text-red-700">{selectedIncident.errorMessage}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>
          ) : (
            /* File Selected but not uploaded */
            <div className="flex items-center justify-center h-full">
              <Card className="max-w-md w-full mx-4">
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-indigo-600" />
                  <h3 className="text-xl font-semibold mb-2">{selectedFile?.name}</h3>
                  <p className="text-sm text-gray-500 mb-6">{(selectedFile?.size || 0) / 1024} KB</p>
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Analyze with AI
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
