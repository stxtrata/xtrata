import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Soundbite, SfxType } from "../types";
import { getAudioContext, playSfx, startSynthwaveMusic, stopSynthwaveMusic } from "../utils/audio";
import { 
  Play, Square, Volume2, Trash2, Mic, Plus, Radio, 
  Sparkles, Sliders, Music, Activity, Check, Loader2, AlertCircle 
} from "lucide-react";

interface SoundboardProps {
  soundbites: Soundbite[];
  onDeleteSoundbite: (id: string) => void;
  onAddSoundbite: (bite: Soundbite) => void;
  onSelectForTimeline: (bite: Soundbite) => void;
}

export default function Soundboard({ 
  soundbites, 
  onDeleteSoundbite, 
  onAddSoundbite,
  onSelectForTimeline 
}: SoundboardProps) {
  // Navigation & Category Filters
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  // Custom manual soundbite form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<any>("Promo");
  const [newSfx, setNewSfx] = useState<SfxType>(SfxType.NONE);

  // Audio & Voice Playback State
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.12);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);
  const [premiumLoadingId, setPremiumLoadingId] = useState<string | null>(null);
  const [voiceType, setVoiceType] = useState<"browser" | "premium">("browser");
  
  // Browser Voice settings
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>("");
  const [speechRate, setSpeechRate] = useState<number>(1.15); // slightly faster for DJ hype!
  const [speechPitch, setSpeechPitch] = useState<number>(1.0);

  // Premium Voice settings (Gemini TTS voices)
  const [premiumVoice, setPremiumVoice] = useState<string>("Zephyr"); // 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
  
  // Visualizer Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Load standard speech voices
  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
        // Default to a US/UK English male/female voice if available
        const defaultVoice = voices.find(
          (v) => v.lang.includes("en-US") || v.lang.includes("en-GB")
        ) || voices[0];
        if (defaultVoice) {
          setSelectedVoiceName(defaultVoice.name);
        }
      }
    };
    loadVoices();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Set up visualizer canvas & AnalyserNode
  useEffect(() => {
    const ctx = getAudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.connect(ctx.destination);
    analyserRef.current = analyser;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!canvasRef.current) return;
      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = "rgba(10, 15, 30, 0.4)";
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 1.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        // Draw double spectral curves or neon bars
        const r = 99 + (i * 2);
        const g = 102;
        const b = 241 + (i * 0.5);

        canvasCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        // Center-symmetric drawing
        canvasCtx.fillRect(
          canvas.width / 2 + x,
          canvas.height - barHeight / 2.5,
          barWidth - 1,
          barHeight / 2.5
        );
        canvasCtx.fillRect(
          canvas.width / 2 - x - barWidth,
          canvas.height - barHeight / 2.5,
          barWidth - 1,
          barHeight / 2.5
        );

        // Add a secondary subtle line
        canvasCtx.fillStyle = `rgba(139, 92, 246, 0.5)`;
        canvasCtx.fillRect(
          canvas.width / 2 + x,
          0,
          barWidth - 1,
          barHeight / 5
        );
        canvasCtx.fillRect(
          canvas.width / 2 - x - barWidth,
          0,
          barWidth - 1,
          barHeight / 5
        );

        x += barWidth;
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      stopSynthwaveMusic();
    };
  }, []);

  // Update Synthwave Music volume when slider is dragged
  useEffect(() => {
    if (musicPlaying) {
      const ctx = getAudioContext();
      if (analyserRef.current) {
        startSynthwaveMusic(ctx, analyserRef.current, musicVolume);
      }
    }
  }, [musicVolume, musicPlaying]);

  // Play Sound Effect Pad
  const handlePlaySfx = (type: SfxType) => {
    const ctx = getAudioContext();
    if (analyserRef.current) {
      playSfx(type, ctx, analyserRef.current);
    }
  };

  // Play Synthwave Backbeat Toggle
  const handleToggleMusic = () => {
    const ctx = getAudioContext();
    if (musicPlaying) {
      stopSynthwaveMusic();
      setMusicPlaying(false);
    } else {
      if (analyserRef.current) {
        startSynthwaveMusic(ctx, analyserRef.current, musicVolume);
        setMusicPlaying(true);
      }
    }
  };

  // Stop any active spoken audio (browser or premium)
  const handleStopAllSpeech = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
      } catch (e) {}
      audioSourceRef.current = null;
    }
    setActiveSpeechId(null);
  };

  // Play Speech (Browser TTS or Premium Gemini TTS)
  const handlePlaySpeech = async (bite: Soundbite) => {
    handleStopAllSpeech();
    
    // Auto trigger sound effect if assigned
    if (bite.suggestedSfx !== SfxType.NONE) {
      handlePlaySfx(bite.suggestedSfx);
    }

    if (voiceType === "browser") {
      if (typeof window === "undefined" || !window.speechSynthesis) return;

      const utterance = new SpeechSynthesisUtterance(bite.content);
      
      // Look up selected voice
      const voiceObj = availableVoices.find((v) => v.name === selectedVoiceName);
      if (voiceObj) {
        utterance.voice = voiceObj;
      }

      utterance.rate = speechRate;
      utterance.pitch = speechPitch;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        setActiveSpeechId(bite.id);
      };

      utterance.onend = () => {
        setActiveSpeechId(null);
      };

      utterance.onerror = () => {
        setActiveSpeechId(null);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // Premium Gemini TTS Voice Generation
      setPremiumLoadingId(bite.id);
      try {
        const response = await fetch("/api/synthesize-speech", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: bite.content, voice: premiumVoice }),
        });

        if (!response.ok) {
          throw new Error("Premium voice synthesis failed");
        }

        const data = await response.json();
        const base64Audio = data.audio;

        if (base64Audio) {
          const ctx = getAudioContext();
          
          // Decode Base64 audio into ArrayBuffer
          const binaryString = window.atob(base64Audio);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          // Use Web Audio API to decode PCM/Audio stream
          ctx.decodeAudioData(bytes.buffer, (buffer) => {
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            
            if (analyserRef.current) {
              source.connect(analyserRef.current);
            } else {
              source.connect(ctx.destination);
            }

            source.onended = () => {
              setActiveSpeechId(null);
            };

            audioSourceRef.current = source;
            setActiveSpeechId(bite.id);
            source.start(0);
          }, (err) => {
            console.error("Decoding audio failed:", err);
            // Fallback to browser TTS if decoding fails
            alert("Audio decoding failed. Falling back to browser Speech synthesis.");
            setVoiceType("browser");
          });
        }
      } catch (err) {
        console.error(err);
        alert("Gemini premium TTS is unavailable or your API key is invalid. Using browser TTS as fallback!");
        setVoiceType("browser");
      } finally {
        setPremiumLoadingId(null);
      }
    }
  };

  const handleManualAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const manualBite: Soundbite = {
      id: `manual-${Date.now()}`,
      title: newTitle,
      content: newContent,
      category: newCategory,
      suggestedSfx: newSfx,
      durationSec: Math.ceil(newContent.split(" ").length / 3) // approximation
    };

    onAddSoundbite(manualBite);
    setNewTitle("");
    setNewContent("");
    setShowAddForm(false);
  };

  const categories = ["All", "Promo", "Educational", "Hype", "Banter", "Station ID"];
  const filteredBites = selectedCategory === "All" 
    ? soundbites 
    : soundbites.filter((b) => b.category === selectedCategory);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Visual Waveform & Audio Controllers Column */}
      <div className="lg:col-span-4 space-y-6">
        {/* Audio Visualizer Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-hidden relative shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-widest">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>Live Monitor</span>
            </div>
            {activeSpeechId && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
          </div>
          
          <canvas 
            ref={canvasRef} 
            width={400} 
            height={130} 
            className="w-full h-28 bg-slate-950 rounded-xl border border-slate-900 shadow-inner"
          />

          <div className="flex justify-between items-center mt-3 text-[10px] font-mono text-slate-500">
            <span>20Hz</span>
            <span>XTRATA RADIO MIXER</span>
            <span>20kHz</span>
          </div>
        </div>

        {/* Backbeat & SFX Pads */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-slate-100 font-sans tracking-tight">FM Station Controllers</h3>
            </div>
          </div>

          {/* Procedural Synth Backbeat */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className={`w-4 h-4 ${musicPlaying ? 'text-green-400 animate-spin' : 'text-slate-500'}`} />
                <div>
                  <div className="text-xs font-semibold text-slate-200">Xtrata Backbeat Loop</div>
                  <div className="text-[10px] text-slate-500 font-mono">Synthesized live at 110 BPM</div>
                </div>
              </div>
              <button
                onClick={handleToggleMusic}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                  musicPlaying 
                    ? "bg-red-500/20 text-red-300 border border-red-500/30" 
                    : "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                }`}
              >
                {musicPlaying ? "STOP BACKBEAT" : "START BACKBEAT"}
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Loop Volume</span>
                <span>{Math.round(musicVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.4"
                step="0.01"
                value={musicVolume}
                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-900 h-1 rounded-full cursor-pointer"
              />
            </div>
          </div>

          {/* Sound Effect Pads Grid */}
          <div className="space-y-2">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Instant SFX Launchpad</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: SfxType.AIRHORN, label: "📯 Airhorn", color: "hover:bg-amber-500/10 hover:border-amber-500/30 text-amber-300" },
                { type: SfxType.BASS_DROP, label: "🔊 Bass Drop", color: "hover:bg-blue-500/10 hover:border-blue-500/30 text-blue-300" },
                { type: SfxType.LASER_SIREN, label: "🚨 Laser Siren", color: "hover:bg-red-500/10 hover:border-red-500/30 text-red-300" },
                { type: SfxType.RECORD_SCRATCH, label: "💿 DJ Scratch", color: "hover:bg-emerald-500/10 hover:border-emerald-500/30 text-emerald-300" },
                { type: SfxType.RADIO_STATIC, label: "📻 Radio Sweep", color: "hover:bg-cyan-500/10 hover:border-cyan-500/30 text-cyan-300" },
                { type: SfxType.ELECTRONIC_PING, label: "💎 Tech Ping", color: "hover:bg-indigo-500/10 hover:border-indigo-500/30 text-indigo-300" }
              ].map((pad) => (
                <button
                  key={pad.type}
                  onClick={() => handlePlaySfx(pad.type)}
                  className={`py-2 text-xs font-semibold bg-slate-950/40 border border-slate-800/80 rounded-xl cursor-pointer transition-all active:scale-95 ${pad.color}`}
                >
                  {pad.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Voice Configs */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800/60">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100 font-sans tracking-tight">DJ Vocal Synthesizer</h3>
          </div>

          <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => { handleStopAllSpeech(); setVoiceType("browser"); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                voiceType === "browser"
                  ? "bg-slate-800 text-slate-100"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              🚀 Fast Browser Speech
            </button>
            <button
              onClick={() => { handleStopAllSpeech(); setVoiceType("premium"); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1 ${
                voiceType === "premium"
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="w-3 h-3 text-indigo-400" /> Premium AI TTS
            </button>
          </div>

          {voiceType === "browser" ? (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Voice Select</label>
                <select
                  value={selectedVoiceName}
                  onChange={(e) => setSelectedVoiceName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300 focus:outline-none focus:border-slate-700"
                >
                  {availableVoices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Speed Rate</span>
                    <span>{speechRate}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.6"
                    max="1.8"
                    step="0.05"
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-950 h-1 rounded-full cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Vocal Pitch</span>
                    <span>{speechPitch}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.05"
                    value={speechPitch}
                    onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-950 h-1 rounded-full cursor-pointer"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-1.5 text-[11px] text-indigo-300 bg-indigo-500/5 border border-indigo-500/10 px-2 py-1.5 rounded-lg mb-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Renders lifelike radio vocals using Gemini 3.1 speech synthesis.</span>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Prebuilt Host Voice</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {["Zephyr", "Fenrir", "Kore", "Puck"].map((voice) => (
                    <button
                      key={voice}
                      onClick={() => setPremiumVoice(voice)}
                      className={`py-1.5 text-xs font-semibold border rounded-lg transition-all ${
                        premiumVoice === voice
                          ? "bg-indigo-600/15 border-indigo-500/35 text-indigo-300"
                          : "bg-slate-950/60 border-slate-850 text-slate-400 hover:border-slate-800 hover:text-slate-300"
                      }`}
                    >
                      {voice} {voice === "Zephyr" && "🎙️"} {voice === "Fenrir" && "🪐"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Soundboard Clips Deck Column */}
      <div className="lg:col-span-8 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          {/* Deck Header & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-100 font-sans tracking-tight flex items-center gap-2">
                <Radio className="w-5 h-5 text-indigo-400 animate-pulse" /> Live Soundboard Clips Deck
              </h2>
              <p className="text-xs text-slate-400">Play, queue, or manage your on-air verbal snippets</p>
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3.5 py-1.5 bg-indigo-600/15 border border-indigo-500/35 text-indigo-300 hover:bg-indigo-600/20 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Custom Clip
            </button>
          </div>

          {/* Add custom form overlay */}
          <AnimatePresence>
            {showAddForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleManualAddSubmit}
                className="bg-slate-950 border border-slate-850 rounded-xl p-4 mb-6 space-y-3 overflow-hidden text-xs"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-semibold uppercase text-[10px]">Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BTC Security Drop"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-semibold uppercase text-[10px]">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none"
                    >
                      {categories.filter(c => c !== "All").map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold uppercase text-[10px]">Content / Spoken Text</label>
                  <textarea
                    required
                    placeholder="Type the exact script for the radio host to speak..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full h-16 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <label className="text-slate-400 font-semibold uppercase text-[10px]">Auto SFX Pad</label>
                    <select
                      value={newSfx}
                      onChange={(e) => setNewSfx(e.target.value as SfxType)}
                      className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300 focus:outline-none"
                    >
                      {Object.values(SfxType).map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-3 py-1 bg-slate-900 text-slate-400 rounded hover:bg-slate-850"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1 bg-indigo-600 text-slate-100 rounded hover:bg-indigo-500 font-bold"
                    >
                      Add Clip
                    </button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-semibold rounded-full border cursor-pointer transition-all ${
                  selectedCategory === cat
                    ? "bg-indigo-500/10 border-indigo-400 text-indigo-300 shadow-sm"
                    : "bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-800 hover:text-slate-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Soundbites Grid Deck */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[480px] overflow-y-auto pr-1">
            <AnimatePresence mode="popLayout">
              {filteredBites.map((bite) => {
                const isActive = activeSpeechId === bite.id;
                const isPremiumLoading = premiumLoadingId === bite.id;

                return (
                  <motion.div
                    key={bite.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`p-4 bg-slate-950/60 border rounded-xl flex flex-col justify-between transition-all group ${
                      isActive 
                        ? "border-emerald-500 shadow-lg shadow-emerald-500/5 bg-slate-900/60" 
                        : "border-slate-800 hover:border-slate-700 hover:bg-slate-950"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="px-2 py-0.5 bg-slate-900 text-slate-400 font-bold rounded">
                          {bite.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-500 font-mono">
                          {bite.suggestedSfx !== SfxType.NONE && (
                            <span className="text-amber-400 font-sans">
                              🔔 {bite.suggestedSfx.replace("_", " ")}
                            </span>
                          )}
                          <span>~{bite.durationSec}s</span>
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-slate-200 font-sans tracking-tight">{bite.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed italic">
                        "{bite.content}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-900">
                      <button
                        onClick={() => handlePlaySpeech(bite)}
                        disabled={isPremiumLoading}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                          isActive
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : "bg-indigo-600 hover:bg-indigo-500 text-slate-100 shadow-md"
                        }`}
                      >
                        {isPremiumLoading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Rendering...</span>
                          </>
                        ) : isActive ? (
                          <>
                            <Square className="w-3.5 h-3.5 fill-red-400/30" />
                            <span>Stop On-Air</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-slate-100" />
                            <span>Play On-Air</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => onSelectForTimeline(bite)}
                        title="Add to Radio Mix Playlist"
                        className="p-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-indigo-400 rounded-lg text-xs flex items-center justify-center cursor-pointer transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Mix Track
                      </button>

                      <button
                        onClick={() => onDeleteSoundbite(bite.id)}
                        className="p-1.5 hover:bg-red-950/20 text-slate-600 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                        title="Delete soundbite"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredBites.length === 0 && (
              <div className="col-span-2 py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                <Radio className="w-8 h-8 mx-auto text-slate-700 mb-2" />
                <p className="text-xs font-semibold">No sound clips found in this category.</p>
                <p className="text-[10px] text-slate-600 mt-1">Generate some using the AI Script panel above!</p>
              </div>
            )}
          </div>
        </div>

        {activeSpeechId && (
          <div className="mt-4 p-2.5 bg-red-950/20 border border-red-900/40 rounded-xl flex items-center justify-between text-xs text-red-300">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span><strong>ON-AIR BROADCAST LIVE:</strong> DJ is currently speaking. Ambient music mixed.</span>
            </div>
            <button
              onClick={handleStopAllSpeech}
              className="text-[10px] font-bold text-red-400 hover:text-red-300 bg-red-900/30 px-2 py-1 rounded cursor-pointer"
            >
              MUTE TRANSMISSION
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
