async function downloadCaptions() {
    const videoId = document.getElementById('videoIdInput').value;
    if (!videoId) {
        alert('Please enter a valid Video ID!');
        return;
    }

    const message = await window.electron.fetchCaptions(videoId);
    alert(message);
}

document.querySelector('button').addEventListener('click', downloadCaptions);
