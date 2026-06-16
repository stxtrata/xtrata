// dom-elements.js

// Get references to DOM elements - these will be used globally by other modules
const statusEl = document.getElementById('status');
const progressEl = document.getElementById('progress');
const convertBtn = document.getElementById('convertBtn');
const fileInput = document.getElementById('fileInput');
const batchConvertBtn = document.getElementById('batchConvertBtn');
const downloadBatchZipBtn = document.getElementById('downloadBatchZipBtn'); // NEW
const batchResultEl = document.getElementById('batchResultEl');
const resultEl = document.getElementById('result');
const formatRadios = document.querySelectorAll('input[name="format"]');
const mp3SettingsDiv = document.getElementById('mp3Settings');
const opusSettingsDiv = document.getElementById('opusSettings');
const mp3QualitySlider = document.getElementById('mp3Quality');
const mp3QualityValueSpan = document.getElementById('mp3QualityValue');
const opusBitrateSlider = document.getElementById('opusBitrate');
const opusBitrateValueSpan = document.getElementById('opusBitrateValue');
const opusVbrModeSelect = document.getElementById('opusVbrMode');
const opusCompressionLevelSlider = document.getElementById('opusCompressionLevel');
const opusCompressionLevelValueSpan = document.getElementById('opusCompressionLevelValue');
const opusApplicationSelect = document.getElementById('opusApplication');

// --- NEW: Audio Profile Elements ---
const audioProfileSelect = document.getElementById('audioProfileSelect');
const audioProfileDescriptionEl = document.getElementById('audioProfileDescription');
// --- END NEW: Audio Profile Elements ---

// --- NEW: Output Info Elements ---
const outputInfoSectionEl = document.getElementById('outputInfoSection');
const originalFileInfoEl = document.getElementById('originalFileInfo');
const currentEstimatedOutputSizeEl = document.getElementById('currentEstimatedOutputSize');
const actualOutputFileInfoEl = document.getElementById('actualOutputFileInfo');
const sizeSavingsInfoEl = document.getElementById('sizeSavingsInfo');
// --- END NEW: Output Info Elements ---

// REMOVED: estSizeMp3Span, estSizeOpusSpan, estSizeWebmSpan
// const estSizeMp3Span = document.getElementById('estSizeMp3');
// const estSizeOpusSpan = document.getElementById('estSizeOpus');
// const estSizeWebmSpan = document.getElementById('estSizeWebm');

const base64Container = document.getElementById('base64Container');
const base64Output = document.getElementById('base64Output');
const copyBase64Btn = document.getElementById('copyBase64Btn');
const downloadBase64Btn = document.getElementById('downloadBase64Btn');
const playSampleBtn = document.getElementById('playSampleBtn');

const showAudioInfoBtn = document.getElementById('showAudioInfoBtn');
const audioInfoContainer = document.getElementById('audioInfoContainer');
const audioInfoContent = document.getElementById('audioInfoContent');
const closeAudioInfoBtn = document.getElementById('closeAudioInfoBtn');

const showAudionalInfoBtn = document.getElementById('showAudionalInfoBtn');
const audionalInfoContainer = document.getElementById('audionalInfoContainer');
const audionalInfoContent = document.getElementById('audionalInfoContent');
const closeAudionalInfoBtn = document.getElementById('closeAudionalInfoBtn');

const metadataModal = document.getElementById('metadataModal');
const cancelMetadataBtn = document.getElementById('cancelMetadataBtn');
const metadataForm = document.getElementById('metadataForm');

const generateHtmlButton = document.getElementById('generateHtmlButton');
