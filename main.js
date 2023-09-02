const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const { getSubtitles } = require('youtube-captions-scraper');

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 400,
        height: 200,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    });

    win.loadFile('index.html');
    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.handle('fetch-captions', async (event, videoId) => {
    try {
        const videoTitle = await fetchVideoTitle(videoId);
        const sanitizedTitle = videoTitle.replace(/[\\/:*?"<>|]/g, "");
        const captions = await getSubtitles({ videoID: videoId, lang: 'ko' });

        const textToSave = captions.map(caption => caption.text).join('\n');

        const savePath = dialog.showSaveDialogSync(win, {
            defaultPath: `${sanitizedTitle}.txt`
        });

        if (savePath) {
            fs.writeFileSync(savePath, textToSave, 'utf8');
            return 'Captions saved successfully!';
        } else {
            return 'Captions download was cancelled by the user!';
        }
    } catch (error) {
        console.error(error);
        return `Error fetching captions: ${error.message}`;
    }
});

async function fetchVideoTitle(videoId) {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const response = await axios.get(url);
    const match = response.data.match(/<title>(.*?)<\/title>/);
    return match && match[1] ? match[1].replace(" - YouTube", "").trim() : videoId;
}
