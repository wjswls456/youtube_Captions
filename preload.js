const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', function () {

    // youtube 대본 다운로드
    const downloadCaptionsId_button = document.getElementById('downloadCaptionsId');
    const videoListTotalUrlList = document.getElementById('videoListTotalUrl');


    


    downloadCaptionsId_button.addEventListener('click', async function () {
        const urlItems = document.querySelectorAll('.url-item');
        // 첫 번째 child node (텍스트 노드)의 값만 가져옵니다.
        const liTextArray = Array.from(urlItems).map(li => li.childNodes[0].nodeValue.trim());
        
        if (liTextArray.length == 0) {
            alert('Please check youtube Title');
            return;
        }
        try {
            let successCount = 0;
            for(const totalUrl of liTextArray){
                const resultMessage = await ipcRenderer.invoke('fetch-captions', totalUrl);
                if(resultMessage == "Captions saved successfully!"){
                    successCount++;
                }
            }
            
            alert("Captions saved successfully!");
        } catch (error) {
            alert(`Error fetching captions: ${error}`);
        }
    });

    const displayUrlTitleId_button = document.getElementById('displayUrlTitleId');
    displayUrlTitleId_button.addEventListener('click', async function () {
        const totalUrl = document.getElementById('urlInput').value;
        // 빈 값 체크
        if (!totalUrl) {
            alert('Please enter a valid Youtube_URL!!');
            return;
        }



        let title = "";
        try {
             title = await ipcRenderer.invoke('fetch-video-title',totalUrl);    
        } catch (error) {
            alert('Please enter a valid Youtube_URL!!');
            return;
        }

        const titleItems = document.querySelectorAll('.title-item');
        // 첫 번째 child node (텍스트 노드)의 값만 가져옵니다.
        const titleTextArray = Array.from(titleItems).map(li => li.childNodes[0].nodeValue.trim());

        
        if(titleTextArray.includes(title)){
            alert('Please duplication Youtube title')
            return;
        }
        


        const listItem = document.createElement('li');
        listItem.classList.add('title-item');  // title-item 클래스 추가
        listItem.textContent = title;

        const addButton = document.createElement('button');
        addButton.textContent = "Add";

        const urlListItem = document.createElement('li');
        urlListItem.classList.add('url-item');  // url-item 클래스 추가
        urlListItem.textContent = totalUrl;
        

        addButton.onclick = function() {
            
            // urlArray.push(totalUrl);
            listItem.style.color = "green";  // 예를 들어, 녹색으로 변경
            listItem.removeChild(addButton);  // Remove the add button once added
            videoListTotalUrlList.appendChild(urlListItem);
        };
        listItem.appendChild(addButton);
        

        const minusButton = document.createElement('button');
        minusButton.textContent = "minus";

        minusButton.onclick = function() {
            
             videoList.removeChild(listItem);
             videoListTotalUrlList.removeChild(urlListItem)

        }
        
        listItem.appendChild(minusButton);
        videoList.appendChild(listItem);
        
    });

});
