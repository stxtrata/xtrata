import { renderJob } from "./render-job.js";
self.onmessage = ({ data }) => {
  try {
    const value = renderJob(data.job);
    const transfer = [...new Set((value || []).flatMap((layer) => layer.channels.map((channel) => channel.buffer)))];
    self.postMessage({ id: data.id, value }, transfer);
  } catch (error) { self.postMessage({ id: data.id, error: error.message }); }
};
