const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const OpenAI = require("openai");
const fs = require('fs');
require('dotenv').config();

const openai = new OpenAI(
  organization=process.env.ORGANIZATION_ID,
  project=process.env.PROJECT_ID,
);

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL('http://localhost:3000');
}

app.on('ready', createWindow);

ipcMain.handle('analyze-image', async (event, base64, userPrompt) => {
  console.log(userPrompt)
  const completion = await openai.chat.completions.create({
    messages: [
      { 
        role: "system", 
        content: "You describe images in great detail. Replace periods with commas. Do not start sentences in uppercase." 
      },
      {
        role: "user",
        content:  [
          {type: "text", text: userPrompt},
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64}`,
              detail: "high"
            },
          },
        ],
      }],
    model: "gpt-4o",
  });

  console.log(completion.choices[0]);

  const result = completion.choices[0];
  return result;
});

ipcMain.handle('save-caption', async (event, caption, filename, tag) => {
  // const {caption, filename, tag} = arg;
  const caption_no_comma = caption.replace(/\./g, ',');
  const fname = path.parse(filename).name + '.txt';
  const new_dir = path.join(__dirname, 'captions');
  if (!fs.existsSync(new_dir)) {
    fs.mkdirSync(new_dir, true);
  }
  const filePath = path.join(new_dir, fname);
  var content = '';
  var status = '';
  if (caption_no_comma.charAt(caption_no_comma.length - 1) === ',') {
    if(tag === ''){
      content = caption_no_comma.slice(0, -1);
    }else{
      content = caption_no_comma + ' ' + tag;
    }
  }else{
    if(tag === ''){
      content = caption_no_comma;
    }else{
      content = caption_no_comma + ', ' + tag;
    }
  }

  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.error('Failed to save file:', err);
      status = fname + ' failed to save';
      //event.reply('save-text-file-response', 'failure');
    } else {
      console.log('File saved successfully');
      status = fname + ' saved successfully';
      //event.reply('save-text-file-response', 'success');
    }
  });

  return status;

});