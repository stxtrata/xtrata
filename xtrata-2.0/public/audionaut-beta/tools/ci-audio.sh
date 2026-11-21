#!/usr/bin/env bash
set -euo pipefail

# Hosted Linux runners have no physical output. A real PulseAudio clock keeps
# Web Audio and AudioWorklet capture running; this does not replace rendered data.
sudo apt-get install -y pulseaudio pulseaudio-utils
if ! pulseaudio --check; then
  pulseaudio --start --exit-idle-time=-1
fi
pactl load-module module-null-sink sink_name=audionaut_ci rate=48000 channels=2
pactl set-default-sink audionaut_ci
pactl set-default-source audionaut_ci.monitor
pactl info
pactl list short sinks
pactl list short sources
