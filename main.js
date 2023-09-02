const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const os = require('os');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const { getSubtitles } = require('youtube-captions-scraper');
const logger = require('./config/log4js-setup');

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

ipcMain.handle('fetch-captions', async (event, totalUrl) => {
    try {
        logger.info(`totalUrl ${totalUrl}`)

        const videoId = extractVideoId(totalUrl)
        const videoTitle = await fetchVideoTitle(totalUrl);
        const sanitizedTitle = videoTitle.replace(/[\\/:*?"<>|]/g, "");
        const captions = await getSubtitles({ videoID: videoId, lang: 'ko' });

        const textToSave = captions.map(caption => caption.text).join('\n');

        const userDownloadsPath = path.join(os.homedir(), 'Downloads');
        const savePath = path.join(userDownloadsPath, `${sanitizedTitle}.txt`);

        fs.writeFileSync(savePath, textToSave, 'utf8');
        return 'Captions saved successfully!';

    } catch (error) {
        console.error(error);
        return `Error fetching captions: ${error.message}`;
    }
});

function extractVideoId(input) {
    const videoIdMatch = input.match(/v=([a-zA-Z0-9_-]+)/);
    return videoIdMatch ? videoIdMatch[1] : input;
}

async function fetchVideoTitle(totalUrl) {

    const response = await axios.get(totalUrl);
    const match = response.data.match(/<title>(.*?)<\/title>/);
    return match && match[1] ? match[1].replace(" - YouTube", "").trim() : videoId;
}
