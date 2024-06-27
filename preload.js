const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  analyzeImage: (base64, userPrompt) => ipcRenderer.invoke('analyze-image', base64, userPrompt),
  saveCaption: (caption, filename, tag) => ipcRenderer.invoke('save-caption', caption, filename, tag),
});