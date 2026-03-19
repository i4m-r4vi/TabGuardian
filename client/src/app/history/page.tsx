"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle, Calendar, Pill, ExternalLink, Search, Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";
import toast from "react-hot-toast";

interface LogEntry {
  _id: string;
  tabletName: string;
  date: string;
  imageUrl: string;
  createdAt: string;
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/tablet/list-history');
      setHistory(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const handleReportAndClear = async () => {
    if (!confirm("Are you sure? This will send a report to your parent and clear all history logs.")) return;
    
    setIsClearing(true);
    try {
      await api.delete('/tablet/history/report-and-clear');
      toast.success("Report sent and history cleared!");
      setHistory([]);
    } catch (err: unknown) {
      const message = (err as any)?.response?.data?.message || "Failed to clear history";
      toast.error(message);
    } finally {
      setIsClearing(false);
    }
  };

  const filteredHistory = history.filter(log => 
    log.tabletName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Medication History</h1>
          <p className="text-gray-500 font-bold mt-2 uppercase text-xs tracking-[0.2em]">Archive of your completed doses</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search tablets..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-blue-500 transition-all outline-none shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={handleReportAndClear}
            disabled={isClearing || history.length === 0}
            className="flex items-center justify-center space-x-3 bg-red-50 text-red-600 border-2 border-red-100 px-6 py-4 rounded-2xl font-black hover:bg-red-600 hover:text-white hover:border-red-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 whitespace-nowrap"
          >
            {isClearing ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Clear & Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-500/5 overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 bg-gray-50/30">
          <h2 className="text-2xl font-black text-gray-900">Past Records</h2>
        </div>

        {loading ? (
          <div className="p-20 text-center text-gray-400 font-black animate-pulse">Retrieving archives...</div>
        ) : filteredHistory.length === 0 ? (
          <div className="p-20 text-center">
            <div className="bg-gray-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
               <Calendar className="h-12 w-12 text-gray-200" />
            </div>
            <p className="text-gray-900 font-black text-2xl">No Records Found</p>
            <p className="text-gray-400 font-bold mt-2">Your dose history will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredHistory.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((log) => (
              <div key={log._id} className="px-10 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50/30 transition-all group">
                <div className="flex items-center space-x-8">
                  <div className="p-5 rounded-3xl bg-green-100 text-green-600">
                    <CheckCircle className="h-8 w-8 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">{log.tabletName}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <span className="text-sm font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-lg flex items-center">
                        <Calendar className="h-3 w-3 mr-2" />
                        {log.date}
                      </span>
                      <span className="text-xs font-black text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-lg">Verified Taken</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 pl-16 md:pl-0">
                  <a 
                    href={log.imageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-white border-2 border-gray-100 px-5 py-2.5 rounded-xl text-sm font-black text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-all active:scale-95 group/btn shadow-sm"
                  >
                    <span>View Proof</span>
                    <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {!loading && filteredHistory.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Logs</p>
              <p className="text-3xl font-black text-gray-900">{filteredHistory.length}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600"><Pill className="h-8 w-8" /></div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Verified Proofs</p>
              <p className="text-3xl font-black text-green-600">{filteredHistory.filter(l => l.imageUrl).length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-2xl text-green-600"><CheckCircle className="h-8 w-8" /></div>
          </div>
        </div>
      )}
    </div>
  );
}
