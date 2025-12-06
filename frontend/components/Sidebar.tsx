'use client';

import { useState } from 'react';
import { FileText, Plus, Menu, X, CheckCircle2, Loader2, AlertCircle, Clock, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { type Incident } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  incidents: Incident[];
  selectedIncident: Incident | null;
  onSelectIncident: (incident: Incident | null) => void;
  onNewChat: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({
  incidents,
  selectedIncident,
  onSelectIncident,
  onNewChat,
  isOpen,
  onToggle,
}: SidebarProps) {
  const getStatusIcon = (status: Incident['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'analyzing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-64 bg-gray-900 text-white z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={onNewChat}
                className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
              >
                <Plus className="h-4 w-4" />
                <span className="font-medium">New Analysis</span>
              </button>
              <button
                onClick={onToggle}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Incident History */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Recent Analyses
              </div>
              {incidents.length === 0 ? (
                <div className="px-3 py-8 text-center">
                  <FileText className="h-8 w-8 mx-auto mb-3 text-gray-600" />
                  <p className="text-sm text-gray-500">No analyses yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {incidents.map((incident) => (
                    <button
                      key={incident.id}
                      onClick={() => onSelectIncident(incident)}
                      className={cn(
                        'w-full text-left px-3 py-2.5 rounded-lg transition-colors group',
                        'hover:bg-white/10',
                        selectedIncident?.id === incident.id
                          ? 'bg-white/15 border border-white/20'
                          : ''
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5">
                          {getStatusIcon(incident.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white truncate">
                            {incident.fileName}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            {format(new Date(incident.createdAt), 'MMM d, h:mm a')}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Sparkles className="h-3 w-3" />
              <span>AI On-Call Engineer</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

