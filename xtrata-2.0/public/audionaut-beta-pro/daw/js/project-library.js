import { subscribeSaveStatus, listSavedProjects, restoreSavedProject, autosave, pinSavedVersion, deleteSavedProject } from "./persistence.js";

export function initProjectLibrary({ confirmReplace = () => true } = {}) {
  const $ = selector => document.querySelector(selector);
  const modal = $("#modal-projects");
  const list = $("#project-library-list");
  subscribeSaveStatus(status => {
    const label = $("#save-state");
    label.dataset.state = status.state;
    label.textContent = status.conflict ? 'Conflict copy preserved' : ({ saved: "Saved in browser", dirty: "Changes pending", saving: "Saving…", error: "Save failed", disabled: "Autosave off" })[status.state] || "Changes pending";
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
        const date = document.createElement("small"); date.textContent = `${new Date(record.updatedAt).toLocaleString()} · ${record.pinned ? 'Pinned: '+(record.name||'Named version') : record.isLatest ? "Latest save" : "Recovery version"}${record.conflictOf?' · Preserved conflicting session':''}`;
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
        const pin=document.createElement('button');pin.textContent=record.pinned?'Unpin':'Name & pin';
        pin.addEventListener('click',async()=>{
          const name=record.pinned?record.name:prompt('Name this version:',record.name||'Approved mix');if(name===null)return;
          try{await pinSavedVersion(record.id,name,!record.pinned);await render();}catch(error){$('#projects-status').textContent=error.message;}
        });
        row.append(description, open,pin);
        if(record.isLatest){const remove=document.createElement('button');remove.textContent='Delete saves';remove.addEventListener('click',async()=>{
          if(!confirm(`Delete every browser save of “${record.projectName}”, including pinned versions? Download a project file first to keep a separate backup.`))return;
          try{await deleteSavedProject(record.projectId);await render();}catch(error){$('#projects-status').textContent=error.message;}
        });row.append(remove);}
        list.append(row);
      }
    } catch (error) { list.textContent = `Saved projects are unavailable: ${error.message}`; }
  };
  $("#btn-projects").addEventListener("click", async () => {
    modal.classList.remove("hidden");
    $("#projects-status").textContent = "Rolling recovery keeps 12 recent projects and 5 versions each. Named/pinned versions and conflict copies are preserved until you explicitly unpin or delete them. Download project files for independent backups.";
    await render();
  });
  $("#projects-save").addEventListener("click", async () => {
    const button = $("#projects-save"); button.disabled = true;
    try { await autosave({ force: true }); await render(); }
    catch (error) { $("#projects-status").textContent = `Save failed: ${error.message}`; }
    finally { button.disabled = false; }
  });
  $("#projects-close").addEventListener("click", () => modal.classList.add("hidden"));
  const named=document.createElement('button');named.id='projects-pin';named.textContent='Save named version';
  named.addEventListener('click',async()=>{const name=prompt('Version name:','Approved mix');if(!name)return;named.disabled=true;
    try{await autosave({force:true,pin:true,name});await render();}catch(error){$('#projects-status').textContent=error.message;}finally{named.disabled=false;}
  });$('#projects-save').after(named);
}
