const onRequest = () => {
    chrome.contextMenus.create({
        title: 'Bionic Reading',
        type: 'normal',
        contexts: ['page'],
        onclick: setBionic,
    })
}

const setBionic = (elm, tab) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { text: "set-bionic" }, function (response) {
            console.log(response);
        });
    });
}

chrome.runtime.onMessage.addListener(onRequest)
