import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Soundbite, BroadcastTrack, DJPersona, SfxType } from "./types";
import { SEED_SOUNDBITES } from "./utils/seeds";
import Soundboard from "./components/Soundboard";
import ScriptGenerator from "./components/ScriptGenerator";
import BroadcastTimeline from "./components/BroadcastTimeline";
import { Radio, Sparkles, Activity, FileText, LayoutGrid, Info, Check, Coins } from "lucide-react";

export default function App() {
  // Primary state holding all active soundboard clips
  const [soundbites, setSoundbites] = useState<Soundbite[]>([]);
  
  // State for the broadcast playlist/timeline
  const [timelineTracks, setTimelineTracks] = useState<BroadcastTrack[]>([]);

  // Selected tab for the main dashboard ("soundboard" or "script-generator")
  const [activeTab, setActiveTab] = useState<"soundboard" | "generator">("soundboard");

  // Load seeds on mount
  useEffect(() => {
    const saved = localStorage.getItem("xtrata_soundbites");
    if (saved) {
      try {
        setSoundbites(JSON.parse(saved));
      } catch (e) {
        setSoundbites(SEED_SOUNDBITES);
      }
    } else {
      setSoundbites(SEED_SOUNDBITES);
    }

    const savedTimeline = localStorage.getItem("xtrata_timeline");
    if (savedTimeline) {
      try {
        setTimelineTracks(JSON.parse(savedTimeline));
      } catch (e) {}
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (soundbites.length > 0) {
      localStorage.setItem("xtrata_soundbites", JSON.stringify(soundbites));
    }
  }, [soundbites]);

  useEffect(() => {
    localStorage.setItem("xtrata_timeline", JSON.stringify(timelineTracks));
  }, [timelineTracks]);

  // Handler to delete a soundbite from the deck
  const handleDeleteSoundbite = (id: string) => {
    setSoundbites((prev) => prev.filter((b) => b.id !== id));
    // Also remove from timeline if it was there
    setTimelineTracks((prev) => prev.filter((t) => t.soundbiteId !== id));
  };

  // Handler to add a soundbite to the deck
  const handleAddSoundbite = (bite: Soundbite) => {
    setSoundbites((prev) => [bite, ...prev]);
  };

  // Handler to queue a soundbite to the broadcast playlist/timeline
  const handleSelectForTimeline = (bite: Soundbite) => {
    const newTrack: BroadcastTrack = {
      id: `track-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      soundbiteId: bite.id,
      title: bite.title,
      content: bite.content,
      suggestedSfx: bite.suggestedSfx,
      delayBeforeSec: timelineTracks.length === 0 ? 3 : 5 // default gaps
    };
    setTimelineTracks((prev) => [...prev, newTrack]);
  };

  const handleClearTimeline = () => {
    setTimelineTracks([]);
  };

  return (
    <div className="min-h-screen bg-[#050811] bg-radial-at-t from-[#0d1527] via-[#050811] to-[#030408] text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Top Header / Broadcast Banner */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-4 py-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-slate-100 shadow-lg shadow-indigo-500/10">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight font-sans text-slate-100 uppercase">
                  Xtrata FM
                </h1>
                <span className="text-[9px] font-bold bg-indigo-500/10 border border-indigo-500/35 text-indigo-300 px-2 py-0.5 rounded-full font-mono uppercase">
                  Stacks L2 Radio
                </span>
              </div>
              <p className="text-[10px] text-slate-400">On-Chain Inscription Soundboard & Broadcast Mixer</p>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="hidden md:flex items-center gap-6 text-[10px] font-mono text-slate-400 bg-slate-900/40 border border-slate-850 rounded-xl px-4 py-2">
            <div className="flex items-center gap-2 border-r border-slate-800 pr-4">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span>Network: <strong className="text-slate-200">Stacks L2 (sBTC)</strong></span>
            </div>
            <div className="flex items-center gap-2 border-r border-slate-800 pr-4">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fees: <strong className="text-emerald-400">&lt; $0.01 / Mint</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Status: <strong className="text-slate-200">Transmitting</strong></span>
            </div>
          </div>

          {/* Navigation Tabs for Client View */}
          <div className="flex rounded-xl bg-slate-950 border border-slate-850 p-1">
            <button
              onClick={() => setActiveTab("soundboard")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "soundboard"
                  ? "bg-slate-850 text-slate-100 shadow-inner"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <LayoutGrid className="w-4 h-4 text-indigo-400" />
              <span>Soundboard Deck</span>
            </button>
            <button
              onClick={() => setActiveTab("generator")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "generator"
                  ? "bg-slate-850 text-slate-100 shadow-inner"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-4 h-4 text-purple-400" />
              <span>AI Script Workshop</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Stage */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-8 flex-1 w-full space-y-8">
        
        {/* Intro Mission Card */}
        <div className="p-4 bg-slate-900/30 border border-slate-850 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between text-xs text-slate-400 shadow-sm leading-relaxed">
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
            <div>
              <strong className="text-slate-200 block mb-0.5">Xtrata FM DJ Controller Room</strong>
              Xtrata is a lightning-fast, ultra-cheap data inscription service built on the Stacks layer-2 blockchain. This console is your workspace: generate voiceovers using Gemini models, launch sound effects, trigger real-time loops, and record custom 5-minute radio mixes complete with backbeats.
            </div>
          </div>
          <a
            href="#broadcast-timeline"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold shrink-0 border border-indigo-500/20 px-3 py-1.5 rounded-lg bg-indigo-500/5 hover:bg-indigo-500/10 transition-colors"
          >
            Jump to Mixer 🎛️
          </a>
        </div>

        {/* Tab-driven Dashboard view */}
        <div className="space-y-8">
          {activeTab === "soundboard" ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Soundboard 
                soundbites={soundbites}
                onDeleteSoundbite={handleDeleteSoundbite}
                onAddSoundbite={handleAddSoundbite}
                onSelectForTimeline={handleSelectForTimeline}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ScriptGenerator 
                onAddSoundbite={handleAddSoundbite}
              />
            </motion.div>
          )}

          {/* Persistent Show Mixer & Timeline (essential for continuous file export goals) */}
          <BroadcastTimeline 
            timelineTracks={timelineTracks}
            soundbites={soundbites}
            onUpdateTimeline={setTimelineTracks}
            onClearTimeline={handleClearTimeline}
          />
        </div>

      </main>

      {/* Footer Branding */}
      <footer className="border-t border-slate-950 py-6 text-center text-[10px] text-slate-500 bg-slate-950/20">
        <p>© 2026 Xtrata FM on Stacks Blockchain. Secured by Proof-of-Transfer & Bitcoin.</p>
        <p className="mt-1">Designed for professional on-air broadcasting, NFT creators, and Stacks degens.</p>
      </footer>
    </div>
  );
}
