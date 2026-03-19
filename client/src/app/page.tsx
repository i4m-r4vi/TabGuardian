"use client";
import React, { useState, useRef, useEffect } from "react";
import { Plus, CheckCircle, Clock, AlertCircle, Camera, Upload, X, Pill, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tablets, setTablets] = useState<any[]>([]);
  const [todayLogs, setTodayLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Add Tablet Modal State
  const [isAdding, setIsAdding] = useState(false);
  const [newTablet, setNewTablet] = useState({ tabletName: "", scheduleTime: "", frequency: "daily" });

  // Upload Proof State
  const [isUploading, setIsUploading] = useState(false);
  const [selectedTablet, setSelectedTablet] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploadingToCloud, setUploadingToCloud] = useState(false);

  useEffect(() => {
    if (user) fetchData();
    const interval = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(interval);
  }, [user]);

  const fetchData = async () => {
    try {
      const [tabletsRes, logsRes] = await Promise.all([
        api.get('/tablet/list'),
        api.get('/tablet/today-logs')
      ]);
      setTablets(tabletsRes.data);
      setTodayLogs(logsRes.data);
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTablet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/tablet/add', newTablet);
      setTablets([...tablets, res.data]);
      setIsAdding(false);
      setNewTablet({ tabletName: "", scheduleTime: "", frequency: "daily" });
      toast.success("Tablet added permanently!");
    } catch (err) {
      toast.error("Failed to add tablet");
    }
  };

  const handleDeleteTablet = async (id: string) => {
    if (!window.confirm("Delete this tablet reminder permanently?")) return;
    try {
      await api.delete(`/tablet/${id}`);
      setTablets(tablets.filter(t => t._id !== id));
      toast.success("Tablet deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const submitProof = async () => {
    if (!fileToUpload) return toast.error("Please take a photo first");
    setUploadingToCloud(true);
    const formData = new FormData();
    formData.append('image', fileToUpload);
    formData.append('tabletId', selectedTablet._id);
    formData.append('tabletName', selectedTablet.tabletName);

    try {
      const res = await api.post('/tablet/upload-proof', formData);
      setTodayLogs([...todayLogs, res.data]);
      setIsUploading(false);
      toast.success(`Proof for ${selectedTablet.tabletName} submitted!`);
    } catch (err) {
      toast.error("Failed to upload proof");
    } finally {
      setUploadingToCloud(false);
    }
  };

  const getTabletStatus = (tablet: any) => {
    const isTaken = todayLogs.find(log => log.tabletId === tablet._id);
    if (isTaken) return 'taken';

    // Parse tablet time
    const [hours, minutes] = tablet.scheduleTime.split(':').map(Number);
    const scheduledDate = new Date();
    scheduledDate.setHours(hours, minutes, 0, 0);

    const gracePeriodMinutes = 30;
    const deadline = new Date(scheduledDate.getTime() + gracePeriodMinutes * 60000);

    if (currentTime > deadline) return 'missed';
    return 'pending';
  };

  const stats = {
    taken: tablets.filter(t => getTabletStatus(t) === 'taken').length,
    pending: tablets.filter(t => getTabletStatus(t) === 'pending').length,
    missed: tablets.filter(t => getTabletStatus(t) === 'missed').length,
  };

  if (!user) return null;

  return (
    <div className="space-y-8 bg-white min-h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            {user.name.split(' ')[0]}'s Daily Meds
          </h1>
          <p className="text-gray-500 font-bold mt-1 uppercase text-xs tracking-widest">{currentTime.toDateString()}</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white px-6 py-3.5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 font-black flex items-center space-x-2"
        >
          <Plus className="h-5 w-5 stroke-[3]" />
          <span>New Tablet</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50/50 p-6 rounded-[2rem] border-2 border-green-100 flex items-center space-x-4">
          <div className="bg-green-100 p-4 rounded-2xl text-green-600"><CheckCircle className="h-7 w-7" /></div>
          <div><p className="text-xs font-black text-green-600/60 uppercase tracking-widest">Taken</p><p className="text-3xl font-black text-green-700">{stats.taken}</p></div>
        </div>
        <div className="bg-blue-50/50 p-6 rounded-[2rem] border-2 border-blue-100 flex items-center space-x-4">
          <div className="bg-blue-100 p-4 rounded-2xl text-blue-600"><Clock className="h-7 w-7" /></div>
          <div><p className="text-xs font-black text-blue-600/60 uppercase tracking-widest">Pending</p><p className="text-3xl font-black text-blue-700">{stats.pending}</p></div>
        </div>
        <div className="bg-red-50/50 p-6 rounded-[2rem] border-2 border-red-100 flex items-center space-x-4">
          <div className="bg-red-100 p-4 rounded-2xl text-red-600"><AlertCircle className="h-7 w-7" /></div>
          <div><p className="text-xs font-black text-red-600/60 uppercase tracking-widest">Missed</p><p className="text-3xl font-black text-red-700">{stats.missed}</p></div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-500/5 overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
          <h2 className="text-2xl font-black text-gray-900">Your Schedule</h2>
          <span className="bg-white px-4 py-1.5 rounded-full border border-gray-100 text-xs font-black text-gray-400 uppercase tracking-widest">Reset Daily</span>
        </div>
        {loading ? (
          <div className="p-20 text-center text-gray-400 font-black animate-pulse">Syncing...</div>
        ) : tablets.length === 0 ? (
          <div className="p-20 text-center">
            <div className="bg-gray-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
               <Pill className="h-12 w-12 text-gray-200" />
            </div>
            <p className="text-gray-900 font-black text-2xl">Clean Slate</p>
            <p className="text-gray-400 font-bold mt-2">Add a tablet to start tracking</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {tablets.map((tablet) => {
              const status = getTabletStatus(tablet);
              return (
                <li key={tablet._id} className="px-10 py-8 flex items-center justify-between hover:bg-gray-50/30 transition-all group">
                  <div className="flex items-center space-x-8">
                    <div className={`p-5 rounded-3xl transition-colors ${
                      status === 'taken' ? 'bg-green-100 text-green-600' : 
                      status === 'missed' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {status === 'taken' ? <CheckCircle className="h-8 w-8" /> : <Clock className="h-8 w-8" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900">{tablet.tabletName}</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-sm font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-lg">{tablet.scheduleTime}</span>
                        {status === 'missed' && <span className="text-xs font-black text-red-500 uppercase tracking-widest">30m Grace Passed</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {status === 'taken' ? (
                      <div className="bg-green-600 text-white px-6 py-2.5 rounded-2xl text-sm font-black flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 stroke-[3]" />
                        <span>Taken</span>
                      </div>
                    ) : status === 'missed' ? (
                      <div className="bg-red-600 text-white px-6 py-2.5 rounded-2xl text-sm font-black flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 stroke-[3]" />
                        <span>Missed</span>
                      </div>
                    ) : (
                      <button 
                        onClick={() => { setSelectedTablet(tablet); setIsUploading(true); }}
                        className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95 text-sm font-black"
                      >
                        Log Proof
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteTablet(tablet._id)}
                      className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Add Tablet Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-md w-full p-12 relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setIsAdding(false)} className="absolute top-10 right-10 text-gray-400 hover:text-gray-900"><X className="h-8 w-8" /></button>
            <h3 className="text-3xl font-black text-gray-900 mb-2">New Reminder</h3>
            <p className="text-gray-500 mb-10 font-bold">This tablet will be tracked daily.</p>
            <form onSubmit={handleAddTablet} className="space-y-8">
              <div>
                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-3">Medicine Name</label>
                <input 
                  type="text" required
                  className="w-full rounded-2xl border-2 border-gray-50 bg-gray-50 px-6 py-4 font-bold text-gray-900 focus:border-blue-500 focus:bg-white transition-all text-lg"
                  placeholder="e.g. Vitamin D3"
                  value={newTablet.tabletName}
                  onChange={(e) => setNewTablet({...newTablet, tabletName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-3">Daily Time</label>
                <input 
                  type="time" required
                  className="w-full rounded-2xl border-2 border-gray-50 bg-gray-50 px-6 py-4 font-bold text-gray-900 focus:border-blue-500 focus:bg-white transition-all text-lg"
                  value={newTablet.scheduleTime}
                  onChange={(e) => setNewTablet({...newTablet, scheduleTime: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 active:scale-[0.98]"
              >
                Create Permanent Reminder
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Proof Modal */}
      {isUploading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-md w-full p-12 animate-in fade-in zoom-in duration-200">
            <h3 className="text-3xl font-black text-gray-900 mb-2">Proof Check</h3>
            <p className="text-gray-500 mb-10 font-bold">Take a photo of {selectedTablet?.tabletName}</p>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-square border-4 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all bg-gray-50/50 overflow-hidden group"
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <div className="bg-blue-100 p-6 rounded-3xl mb-4 group-hover:scale-110 transition-transform"><Camera className="h-12 w-12 text-blue-600" /></div>
                  <p className="text-xl font-black text-gray-900">Open Camera</p>
                </>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" capture="environment" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFileToUpload(file);
                  const reader = new FileReader();
                  reader.onloadend = () => setPreviewUrl(reader.result as string);
                  reader.readAsDataURL(file);
                }
              }} />
            </div>
            <div className="mt-10 grid grid-cols-2 gap-6">
              <button onClick={() => setIsUploading(false)} className="py-5 text-lg font-black text-gray-400 hover:text-gray-900 transition-colors">Cancel</button>
              <button 
                onClick={submitProof} 
                disabled={uploadingToCloud}
                className="bg-blue-600 text-white py-5 rounded-[2rem] font-black hover:bg-blue-700 shadow-2xl shadow-blue-100 flex items-center justify-center space-x-3 disabled:opacity-50"
              >
                <Upload className="h-5 w-5 stroke-[3]" />
                <span>{uploadingToCloud ? "Saving..." : "Done"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
