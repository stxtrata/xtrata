import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DJPersona, Soundbite, SfxType } from "../types";
import { Sparkles, Loader2, Volume2, Plus, Edit2, Check, RefreshCw } from "lucide-react";

interface ScriptGeneratorProps {
  onAddSoundbite: (bite: Soundbite) => void;
}

export default function ScriptGenerator({ onAddSoundbite }: ScriptGeneratorProps) {
  const [persona, setPersona] = useState<DJPersona>(DJPersona.RADIO_LEGEND);
  const [topic, setTopic] = useState("Why Xtrata is better than L1 Bitcoin Ordinals");
  const [bitesCount, setBitesCount] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedBites, setGeneratedBites] = useState<Soundbite[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const topicTemplates = [
    "Why Xtrata is better than L1 Bitcoin Ordinals",
    "Introducing Xtrata's layer 2 speed and low gas fees",
    "Xtrata FM late night chill & the Stacks Nakamoto upgrade",
    "GM Stacks builders! Apes, degens, and sat-stackers assemble",
    "On-chain Stacks inscriptions security explained"
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona, topic, bitesCount }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate script. Check your API key or server status.");
      }

      const data = await response.json();
      
      // Ensure each bite has a unique ID
      const bitesWithIds: Soundbite[] = data.map((item: any, idx: number) => ({
        ...item,
        id: `gen-${Date.now()}-${idx}`,
        // Safety checks for parsed values
        category: item.category || "Hype",
        suggestedSfx: Object.values(SfxType).includes(item.suggestedSfx) ? item.suggestedSfx : SfxType.NONE
      }));

      setGeneratedBites(bitesWithIds);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditField = (id: string, field: keyof Soundbite, value: any) => {
    setGeneratedBites((prev) =>
      prev.map((bite) => (bite.id === id ? { ...bite, [field]: value } : bite))
    );
  };

  const handlePushToSoundboard = (bite: Soundbite) => {
    onAddSoundbite(bite);
    // Remove from generated list or show a visual check
    setGeneratedBites((prev) => prev.filter((b) => b.id !== bite.id));
  };

  const handlePushAllToSoundboard = () => {
    generatedBites.forEach((bite) => onAddSoundbite(bite));
    setGeneratedBites([]);
  };

  return (
    <div id="script-generator" className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100 font-sans tracking-tight">AI Radio DJ Script Generator</h2>
          <p className="text-sm text-slate-400">Use Gemini to generate customized, high-energy scripts for Xtrata FM</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        {/* Settings column */}
        <div className="md:col-span-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">DJ Persona / Tone</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(DJPersona).map((p) => (
                <button
                  key={p}
                  onClick={() => setPersona(p)}
                  className={`px-3 py-2 text-xs rounded-lg font-medium border text-left transition-all duration-200 ${
                    persona === p
                      ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-lg shadow-indigo-500/5"
                      : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                  }`}
                >
                  <div className="font-bold">
                    {p.replace("_", " ")}
                  </div>
                  <span className="text-[10px] opacity-75">
                    {p === DJPersona.DEGEN_TRADER && "🚀 GM, LFG, High Hype"}
                    {p === DJPersona.TECH_BUILDER && "💻 Decentralized & Smart"}
                    {p === DJPersona.SYNTHWAVE_CLASSIC && "🌌 Late Night Retro Chill"}
                    {p === DJPersona.RADIO_LEGEND && "🎙️ High-Energy Traditional DJ"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Bites Count</label>
            <div className="flex gap-2">
              {[3, 4, 5, 8].map((count) => (
                <button
                  key={count}
                  onClick={() => setBitesCount(count)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    bitesCount === count
                      ? "bg-slate-800 border-slate-600 text-slate-100"
                      : "bg-slate-950/40 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-400"
                  }`}
                >
                  {count} Segment{count > 1 ? "s" : ""}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Quick Templates</label>
            <div className="space-y-1.5">
              {topicTemplates.map((t) => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors border ${
                    topic === t
                      ? "bg-slate-800 border-slate-700 text-indigo-400"
                      : "bg-slate-950/20 border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input & Generate Column */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
          <div className="flex-1 flex flex-col">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Custom Topic / Angle</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What should the radio DJ talk about? E.g., 'Apeing into Xtrata NFT mints on Stacks L2' or 'Explaining how Stacks connects to Bitcoin'..."
              className="w-full flex-1 min-h-[140px] px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-600 transition-colors resize-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !topic.trim()}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-800 disabled:to-slate-800 text-slate-100 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-500/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Broadcasting Prompt to Gemini...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Generate Radio Scripts</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-950/30 border border-red-900/50 rounded-xl text-red-400 text-xs">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Generated Scripts Feed */}
      <AnimatePresence mode="popLayout">
        {generatedBites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-4 pt-4 border-t border-slate-800"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Generated Sound Bites Feed</h3>
              <button
                onClick={handlePushAllToSoundboard}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add All to Soundboard
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedBites.map((bite) => (
                <motion.div
                  key={bite.id}
                  layout
                  className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-bold rounded">
                        {bite.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        ~{bite.durationSec}s
                      </span>
                    </div>

                    {editingId === bite.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={bite.title}
                          onChange={(e) => handleEditField(bite.id, "title", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-100 rounded px-2 py-1 font-semibold focus:outline-none"
                        />
                        <textarea
                          value={bite.content}
                          onChange={(e) => handleEditField(bite.id, "content", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded px-2 py-1 h-20 resize-none focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <select
                            value={bite.suggestedSfx}
                            onChange={(e) => handleEditField(bite.id, "suggestedSfx", e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-[10px] text-slate-300 rounded px-1.5 py-0.5 focus:outline-none"
                          >
                            {Object.values(SfxType).map((t) => (
                              <option key={t} value={t}>SFX: {t}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 bg-green-950/30 border border-green-800/50 rounded text-green-400 text-xs flex items-center gap-1 px-2"
                          >
                            <Check className="w-3 h-3" /> Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h4 className="text-sm font-semibold text-slate-200">{bite.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed italic">"{bite.content}"</p>
                        {bite.suggestedSfx !== SfxType.NONE && (
                          <div className="flex items-center gap-1.5 text-[10px] text-amber-400 bg-amber-500/5 border border-amber-500/10 px-2 py-0.5 rounded-full w-fit">
                            <Volume2 className="w-3 h-3" /> Auto SFX: {bite.suggestedSfx.replace("_", " ")}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {editingId !== bite.id && (
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-900">
                      <button
                        onClick={() => setEditingId(bite.id)}
                        className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-300 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => handlePushToSoundboard(bite)}
                        className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-slate-100 font-bold rounded-lg text-xs flex items-center justify-center gap-1 shadow-lg shadow-indigo-600/5 active:scale-95 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add to Soundboard
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
