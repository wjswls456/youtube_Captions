const { remote } = require('electron');
const fs = require('fs');
const axios = require('axios');
const { getSubtitles } = require('youtube-captions-scraper');

window.fs = fs;
window.axios = axios;
window.getSubtitles = getSubtitles;

async function fetchVideoTitle(videoId) {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const response = await axios.get(url);
    const match = response.data.match(/<title>(.*?)<\/title>/);
    return match && match[1] ? match[1].replace(" - YouTube", "").trim() : videoId;
}

async function downloadCaptions() {
    const videoId = document.getElementById('videoIdInput').value;
    if (!videoId) {
        alert('Please enter a valid Video ID!');
        return;
    }

    try {
        const videoTitle = await fetchVideoTitle(videoId);
        const sanitizedTitle = videoTitle.replace(/[\\/:*?"<>|]/g, ""); // 파일명으로 사용할 수 없는 문자 제거

        const captions = await getSubtitles({ videoID: videoId, lang: 'ko' });

        const textToSave = captions.map(caption => caption.text).join('\n');

        const savePath = remote.dialog.showSaveDialogSync({
            defaultPath: `${sanitizedTitle}.txt`
        });

        if (savePath) {
            fs.writeFileSync(savePath, textToSave, 'utf8');
            alert('Captions saved successfully!');
        }

    } catch (error) {
        alert(`Error fetching captions: ${error}`);
    }
}

window.downloadCaptions = downloadCaptions;
