const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', function () {
    const button = document.querySelector('button');
    button.addEventListener('click', async function () {
        const videoId = document.getElementById('videoIdInput').value;
        if (!videoId) {
            alert('Please enter a valid Video ID!');
            return;
        }

        try {
            const resultMessage = await ipcRenderer.invoke('fetch-captions', videoId);
            alert(resultMessage);
        } catch (error) {
            alert(`Error fetching captions: ${error}`);
        }
    });
});
