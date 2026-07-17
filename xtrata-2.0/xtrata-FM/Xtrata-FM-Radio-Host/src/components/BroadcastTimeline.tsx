import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Soundbite, BroadcastTrack, SfxType } from "../types";
import { getAudioContext, playSfx, startSynthwaveMusic, stopSynthwaveMusic } from "../utils/audio";
import { 
  Clock, Play, Square, Download, Trash2, ArrowDownUp, 
  Settings, Radio, Loader2, Sparkles, Volume2, AlertCircle, FileAudio, Check, Copy 
} from "lucide-react";

interface BroadcastTimelineProps {
  timelineTracks: BroadcastTrack[];
  soundbites: Soundbite[];
  onUpdateTimeline: (tracks: BroadcastTrack[]) => void;
  onClearTimeline: () => void;
}

export default function BroadcastTimeline({
  timelineTracks,
  soundbites,
  onUpdateTimeline,
  onClearTimeline
}: BroadcastTimelineProps) {
  const [isPlayingMix, setIsPlayingMix] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPreRendering, setIsPreRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderedAudioBuffers, setRenderedAudioBuffers] = useState<Record<string, AudioBuffer>>({});
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Recording variables
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const currentTimeoutRef = useRef<any>(null);
  const playbackSourcesRef = useRef<AudioNode[]>([]);
  
  // Calculate exact chronological region intervals in seconds
  const calculateRegions = () => {
    let elapsed = 0;
    return timelineTracks.map((track) => {
      const start = elapsed + track.delayBeforeSec;
      // find duration of the actual soundbite
      const originalBite = soundbites.find((b) => b.id === track.soundbiteId);
      const duration = originalBite ? originalBite.durationSec : 15;
      const end = start + duration;
      elapsed = end; // cumulative end is start of next (excluding next's delay)
      return {
        ...track,
        start,
        end,
        duration
      };
    });
  };

  const regions = calculateRegions();
  const totalShowDuration = regions.length > 0 ? regions[regions.length - 1].end : 0;

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Helper to copy region data
  const handleCopyRegions = () => {
    const text = regions.map((r, i) => {
      return `Region ${i + 1}: ${r.title}\nTimestamps: [${formatTime(r.start)} - ${formatTime(r.end)}]\nContent: "${r.content}"\nSFX: ${r.suggestedSfx}\n-------------------\n`;
    }).join("\n");
    navigator.clipboard.writeText(text);
    setCopiedIndex(-99);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleUpdateTrackDelay = (id: string, delay: number) => {
    onUpdateTimeline(
      timelineTracks.map((t) => (t.id === id ? { ...t, delayBeforeSec: delay } : t))
    );
  };

  const handleRemoveTrack = (id: string) => {
    onUpdateTimeline(timelineTracks.filter((t) => t.id !== id));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newTracks = [...timelineTracks];
    const temp = newTracks[index];
    newTracks[index] = newTracks[index - 1];
    newTracks[index - 1] = temp;
    onUpdateTimeline(newTracks);
  };

  const handleMoveDown = (index: number) => {
    if (index === timelineTracks.length - 1) return;
    const newTracks = [...timelineTracks];
    const temp = newTracks[index];
    newTracks[index] = newTracks[index + 1];
    newTracks[index + 1] = temp;
    onUpdateTimeline(newTracks);
  };

  const handleStopMix = () => {
    // Clear timeouts and stop all audio nodes
    if (currentTimeoutRef.current) {
      clearTimeout(currentTimeoutRef.current);
    }
    playbackSourcesRef.current.forEach((src) => {
      try {
        (src as any).stop();
      } catch (e) {}
    });
    playbackSourcesRef.current = [];
    stopSynthwaveMusic();
    
    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    setIsPlayingMix(false);
    setIsRecording(false);
  };

  // Pre-render all tracks using Gemini TTS backend
  const handlePreRenderVocals = async () => {
    if (timelineTracks.length === 0) return;
    setIsPreRendering(true);
    setRenderProgress(0);
    const ctx = getAudioContext();
    const buffers: Record<string, AudioBuffer> = {};

    try {
      for (let i = 0; i < timelineTracks.length; i++) {
        const track = timelineTracks[i];
        
        // Skip if already rendered
        if (renderedAudioBuffers[track.id]) {
          buffers[track.id] = renderedAudioBuffers[track.id];
          setRenderProgress(Math.round(((i + 1) / timelineTracks.length) * 100));
          continue;
        }

        // Render via Gemini TTS API proxy
        const response = await fetch("/api/synthesize-speech", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: track.content, voice: "Zephyr" }),
        });

        if (!response.ok) {
          throw new Error(`Failed to render track: ${track.title}`);
        }

        const data = await response.json();
        const base64Audio = data.audio;

        if (base64Audio) {
          const binaryString = window.atob(base64Audio);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          // Decode into AudioBuffer
          const decodedBuffer = await new Promise<AudioBuffer>((resolve, reject) => {
            ctx.decodeAudioData(bytes.buffer, resolve, reject);
          });

          buffers[track.id] = decodedBuffer;
        }

        setRenderProgress(Math.round(((i + 1) / timelineTracks.length) * 100));
      }

      setRenderedAudioBuffers(buffers);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to render vocal bytes. We will use browser SpeechSynthesis as mix fallback.");
    } finally {
      setIsPreRendering(false);
    }
  };

  // Perform continuous playback or record sequence
  const handlePlayOrRecordMix = async (record = false) => {
    const ctx = getAudioContext();
    handleStopMix();

    let recorderDestination: MediaStreamAudioDestinationNode | null = null;
    let finalDestination: AudioNode = ctx.destination;

    // Set up MediaRecorder if recording is requested
    if (record) {
      recordedChunksRef.current = [];
      recorderDestination = ctx.createMediaStreamDestination();
      
      // Split output so the user can still listen while recording
      const splitter = ctx.createGain();
      splitter.connect(ctx.destination);
      splitter.connect(recorderDestination);
      finalDestination = splitter;

      const mediaRecorder = new MediaRecorder(recorderDestination.stream, {
        mimeType: "audio/webm;codecs=opus"
      });

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Compile recorded chunks into single downloadable audio file
        const blob = new Blob(recordedChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Xtrata_FM_Show_Mix_${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    }

    setIsPlayingMix(true);

    // Start background backbeat loop
    startSynthwaveMusic(ctx, finalDestination, 0.12);

    // Timeline player queue runner
    const playSequencedTrack = (index: number) => {
      if (index >= regions.length) {
        // Complete show mix! Fade out music and stop
        currentTimeoutRef.current = setTimeout(() => {
          handleStopMix();
        }, 3000);
        return;
      }

      const region = regions[index];
      const timeToWait = index === 0 ? region.delayBeforeSec : region.delayBeforeSec;

      // Wait for delay before speaking
      currentTimeoutRef.current = setTimeout(() => {
        // 1. Play custom SFX drop if assigned
        if (region.suggestedSfx !== SfxType.NONE) {
          playSfx(region.suggestedSfx, ctx, finalDestination);
        }

        // 2. Play vocal speech (Gemini high-fidelity pre-rendered, or fallback browser TTS)
        const renderedBuffer = renderedAudioBuffers[region.id];
        if (renderedBuffer) {
          const source = ctx.createBufferSource();
          source.buffer = renderedBuffer;
          source.connect(finalDestination);
          playbackSourcesRef.current.push(source);
          source.start(0);

          source.onended = () => {
            playSequencedTrack(index + 1);
          };
        } else {
          // Fallback to client browser SpeechSynthesis
          const utterance = new SpeechSynthesisUtterance(region.content);
          utterance.rate = 1.15;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;
          
          utterance.onend = () => {
            playSequencedTrack(index + 1);
          };

          utterance.onerror = () => {
            playSequencedTrack(index + 1);
          };

          window.speechSynthesis.speak(utterance);
        }

      }, timeToWait * 1000);
    };

    playSequencedTrack(0);
  };

  return (
    <div id="broadcast-timeline" className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 font-sans tracking-tight">5-Minute Broadcast Show Mixer</h2>
            <p className="text-sm text-slate-400">Assemble segments, mix loops, and export as a single continuous sound file</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {timelineTracks.length > 0 && (
            <button
              onClick={onClearTimeline}
              className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 border border-slate-800 rounded-lg"
            >
              Clear Mix
            </button>
          )}

          <button
            onClick={handlePreRenderVocals}
            disabled={isPreRendering || timelineTracks.length === 0}
            className="px-3.5 py-1.5 bg-indigo-600/15 border border-indigo-500/35 text-indigo-300 hover:bg-indigo-600/20 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isPreRendering ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Pre-rendering Vocals ({renderProgress}%)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Pre-Render AI Host Vocals</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Overview Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-center gap-3.5">
          <div className="p-3 bg-purple-600/10 rounded-xl text-purple-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase">Total Show Run-time</span>
            <span className="text-lg font-bold text-slate-200 font-mono">{formatTime(totalShowDuration)}</span>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-center gap-3.5">
          <div className="p-3 bg-indigo-600/10 rounded-xl text-indigo-400">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase">Total DJ Segments</span>
            <span className="text-lg font-bold text-slate-200 font-mono">{timelineTracks.length} Clips</span>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-center gap-3.5 col-span-2 justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600/10 rounded-xl text-emerald-400">
              <FileAudio className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase">Pre-Render Status</span>
              <span className="text-xs font-semibold text-slate-300">
                {Object.keys(renderedAudioBuffers).length} of {timelineTracks.length} tracks rendered with AI Voice
              </span>
            </div>
          </div>
          <div className="h-2 w-20 bg-slate-900 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-300" 
              style={{ width: `${timelineTracks.length > 0 ? (Object.keys(renderedAudioBuffers).length / timelineTracks.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {timelineTracks.length === 0 ? (
        <div className="py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
          <Radio className="w-10 h-10 mx-auto text-slate-700 mb-3" />
          <h3 className="text-sm font-bold text-slate-300">Your Broadcast Playlist is Empty</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Click the "Mix Track" button on any soundbite in your soundboard card grid to queue it onto the continuous show timeline.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Timeline Cards Grid */}
          <div className="xl:col-span-7 space-y-3 max-h-[400px] overflow-y-auto pr-1">
            <AnimatePresence mode="popLayout">
              {timelineTracks.map((track, idx) => {
                const isRendered = !!renderedAudioBuffers[track.id];

                return (
                  <motion.div
                    key={track.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="p-4 bg-slate-950 border border-slate-850 hover:border-slate-800 rounded-xl flex items-center justify-between gap-4 relative group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Chronological order bubble */}
                      <span className="h-6 w-6 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400 flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-200 truncate font-sans tracking-tight">{track.title}</h4>
                          {isRendered ? (
                            <span className="px-1.5 py-0.2 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[8px] font-bold uppercase rounded">AI Vocal Ready</span>
                          ) : (
                            <span className="px-1.5 py-0.2 bg-slate-800 text-slate-500 text-[8px] font-bold uppercase rounded">SpeechSynthesis Fallback</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 truncate italic">"{track.content}"</p>
                      </div>
                    </div>

                    {/* Transition / Delay Settings */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="space-y-0.5">
                        <span className="block text-[8px] font-bold text-slate-500 uppercase">Transition Gap</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max="60"
                            value={track.delayBeforeSec}
                            onChange={(e) => handleUpdateTrackDelay(track.id, parseInt(e.target.value) || 0)}
                            className="w-12 bg-slate-900 border border-slate-800 text-slate-200 rounded px-1.5 py-0.5 text-center font-mono text-xs focus:outline-none"
                          />
                          <span className="text-[10px] text-slate-500">secs</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleMoveUp(idx)}
                          disabled={idx === 0}
                          className="p-1 hover:bg-slate-900 rounded disabled:opacity-30 text-slate-400 cursor-pointer"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => handleMoveDown(idx)}
                          disabled={idx === timelineTracks.length - 1}
                          className="p-1 hover:bg-slate-900 rounded disabled:opacity-30 text-slate-400 cursor-pointer"
                        >
                          ▼
                        </button>
                        <button
                          onClick={() => handleRemoveTrack(track.id)}
                          className="p-1 hover:bg-red-950/20 text-red-400 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Region Exporter Cutting Board Column */}
          <div className="xl:col-span-5 bg-slate-950 border border-slate-850 rounded-xl p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 text-indigo-400" /> Show Region Markers (Timestamp File Map)
                </span>
                <button
                  onClick={handleCopyRegions}
                  className="p-1 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 font-semibold cursor-pointer"
                  title="Copy region timestamps"
                >
                  {copiedIndex === -99 ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Map</span>
                    </>
                  )}
                </button>
              </div>

              {/* Exact timeline timeline intervals */}
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {regions.map((region, i) => (
                  <div key={region.id} className="p-2 bg-slate-900/40 rounded-lg flex justify-between items-center text-[11px] hover:bg-slate-900 transition-colors">
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-300 truncate">Region {i+1}: {region.title}</div>
                      <div className="text-[10px] text-slate-500 truncate italic">"{region.content}"</div>
                    </div>
                    <span className="font-mono bg-slate-950 px-2 py-0.5 rounded text-indigo-300 shrink-0 border border-slate-850">
                      [{formatTime(region.start)} - {formatTime(region.end)}]
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timed Mix Command deck */}
            <div className="space-y-3 pt-3 border-t border-slate-900">
              <div className="flex gap-2">
                <button
                  onClick={() => handlePlayOrRecordMix(false)}
                  disabled={isPreRendering}
                  className={`flex-1 py-3 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                    isPlayingMix && !isRecording
                      ? "bg-red-500/25 border border-red-500/40 text-red-300"
                      : "bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 shadow"
                  }`}
                >
                  {isPlayingMix && !isRecording ? (
                    <>
                      <Square className="w-4 h-4 fill-red-400/30" />
                      <span>Stop Mix Playback</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-slate-200" />
                      <span>Preview Live Show Mix</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handlePlayOrRecordMix(true)}
                  disabled={isPreRendering}
                  className={`flex-1 py-3 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                    isRecording
                      ? "bg-red-600 hover:bg-red-500 text-slate-100 shadow-lg shadow-red-600/10 animate-pulse"
                      : "bg-indigo-600 hover:bg-indigo-500 text-slate-100 shadow-md shadow-indigo-600/10"
                  }`}
                >
                  {isRecording ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-100" />
                      <span>Recording Live...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-slate-100" />
                      <span>Record & Download Show</span>
                    </>
                  )}
                </button>
              </div>

              {isRecording && (
                <div className="p-2.5 bg-red-950/20 border border-red-900/30 rounded-lg flex items-center gap-2 text-[10px] text-red-400 justify-center">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Stay on this screen. Audio is recording. It will auto-download WAV file upon completion or stop.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
