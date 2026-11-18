import { subscribeSaveStatus, listSavedProjects, restoreSavedProject, autosave } from "./persistence.js";

export function initProjectLibrary({ confirmReplace = () => true } = {}) {
  const $ = selector => document.querySelector(selector);
  const modal = $("#modal-projects");
  const list = $("#project-library-list");
  subscribeSaveStatus(status => {
    const label = $("#save-state");
    label.dataset.state = status.state;
    label.textContent = ({ saved: "Saved in browser", dirty: "Changes pending", saving: "Saving…", error: "Save failed", disabled: "Autosave off" })[status.state] || "Changes pending";
    label.title = status.message || label.textContent;
  });
  const render = async () => {
    list.textContent = "Loading saved projects…";
    try {
      const saved = await listSavedProjects();
      list.replaceChildren();
      if (!saved.length) { list.textContent = "No saved projects yet. Your edits will appear here after autosave."; return; }
      for (const record of saved) {
        const row = document.createElement("div"); row.className = "project-recovery-row";
        const description = document.createElement("div");
        const name = document.createElement("strong"); name.textContent = record.projectName || "Untitled project";
        const date = document.createElement("small"); date.textContent = `${new Date(record.updatedAt).toLocaleString()} · ${record.isLatest ? "Latest save" : "Recovery version"}`;
        description.append(name, date);
        const open = document.createElement("button"); open.textContent = record.isLatest ? "Open" : "Recover";
        open.addEventListener("click", async () => {
          if (!confirmReplace()) return;
          open.disabled = true;
          try {
            await restoreSavedProject(record.id);
            modal.classList.add("hidden");
          } catch (error) {
            $("#projects-status").textContent = `Could not open that version: ${error.message}`;
            open.disabled = false;
          }
        });
        row.append(description, open); list.append(row);
      }
    } catch (error) { list.textContent = `Saved projects are unavailable: ${error.message}`; }
  };
  $("#btn-projects").addEventListener("click", async () => {
    modal.classList.remove("hidden");
    $("#projects-status").textContent = "This browser keeps your 12 most recent projects and up to 5 versions of each. Download a project file for a separate backup.";
    await render();
  });
  $("#projects-save").addEventListener("click", async () => {
    const button = $("#projects-save"); button.disabled = true;
    try { await autosave({ force: true }); await render(); }
    catch (error) { $("#projects-status").textContent = `Save failed: ${error.message}`; }
    finally { button.disabled = false; }
  });
  $("#projects-close").addEventListener("click", () => modal.classList.add("hidden"));
}
