/**
 * Converts arg. to array
 */
const asArray = (source) => {
    return Array.prototype.slice.call(source)
}

/**
 * Receiving plain text, then converts first 1,2 or 3 letters' to bold ones.
 */
const makeStrongifiedDOM = (text) => {
    if (!text || !text.length) {
        return text
    }
    const wrapper = document.createElement('span')
    const newElement = document.createElement('strong')
    let texts = ''
    if (text.length < 4) {
        newElement.append(text.substr(0, 1)),
        texts = text.substr(1)
    } else if (text.length === 4) {
        newElement.append(text.substr(0, 2)),
        texts = text.substr(2)
    } else {
        newElement.append(text.substr(0, 3)),
        texts = text.substr(3)
    }
    wrapper.append(newElement)
    wrapper.append(texts + ' ')
    return wrapper
}

/**
 * Main func
 * 
 */
const letsBionic = (element) => {
    for (const node of element.childNodes) {
        let newNode = ''
        if (node.children?.length === undefined) {
            const texts = (node.textContent)?.split(' ')
            const bionicDOMs = []
            if (!!texts?.length) {
                for (const text of texts) {
                    bionicDOMs.push(makeStrongifiedDOM(text))
                }
                const newElement = document.createElement('span')
                for (const bionicSpan of bionicDOMs) {
                    newElement.append(bionicSpan)
                }
                newNode = newElement
            }
        } else {
            newNode = node
        }
        // replace original texts to strongified ones
        element.replaceChild(newNode, node)
    }
}

/**
 * Get all elements on the page, then make bionic-reading-style letters
 */
const retrieve = (elements) => {
    for (const element of elements) {
        const children = asArray(element.children ?? [])
        if (children.length) {
            retrieve(children)
        }
        letsBionic(element)
    }
}

/**
 * Triggers main function
 */
const exec = () => {
    console.info('[Bionic Reading Helper Activated] @', location.host)
    const elements = (document.getElementsByTagName('body'))[0]
    if (!elements) {
        console.log('[WARNING] No valid items found.')
        return
    }
    const elementsAsArray = asArray(elements.children)
    retrieve(asArray(elementsAsArray))
}

/**
 * Listener
 * - receives command from background, then start the main function
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.text == "set-bionic") {
        exec()
        sendResponse({
            message: 'Bionic Reading Applied',
            url: location.href,
            date: new Date(),
        });
    }
});

/**
 * Originally running function
 * - just creating contextMenu
 */
const func = () => {
    console.info('[Bionic Reading Helper is running...]')
    const requestData = {action: 'createContextMenuItem', host: location.host, path: location.pathname}
    chrome.runtime.sendMessage(requestData)
}

func()
