export enum DJPersona {
  DEGEN_TRADER = "DEGEN_TRADER",
  TECH_BUILDER = "TECH_BUILDER",
  SYNTHWAVE_CLASSIC = "SYNTHWAVE_CLASSIC",
  RADIO_LEGEND = "RADIO_LEGEND"
}

export enum SfxType {
  AIRHORN = "airhorn",
  BASS_DROP = "bass_drop",
  LASER_SIREN = "laser_siren",
  RECORD_SCRATCH = "record_scratch",
  RADIO_STATIC = "radio_static",
  ELECTRONIC_PING = "electronic_ping",
  NONE = "none"
}

export interface Soundbite {
  id: string;
  title: string;
  content: string;
  category: "Promo" | "Educational" | "Hype" | "Banter" | "Station ID";
  suggestedSfx: SfxType;
  durationSec: number;
}

export interface BroadcastTrack {
  id: string;
  soundbiteId: string;
  title: string;
  content: string;
  suggestedSfx: SfxType;
  delayBeforeSec: number; // gap/transition time before playing this bite
}

export interface ScriptGenerationRequest {
  persona: DJPersona;
  topic: string;
  bitesCount: number;
}
