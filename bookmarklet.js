javascript:(function() {
  function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
  }

  function getModel() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('model') || 'gpt-3.5-turbo';
  }

  function getMessages() {
    const xpath = '//*[@id="__next"]/div[2]/div[2]/div/main/div[2]/div/div/div/div/div/div[2]/div[1]/div';
    const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const messages = [];
    for (let i = 0; i < result.snapshotLength; i++) {
      messages.push(result.snapshotItem(i).textContent.trim());
    }
    return messages;
  }

  function generateFileName(message) {
    const maxLength = 30;
    let fileName = message.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_]/g, '');
    if (fileName.length > maxLength) {
      fileName = fileName.substring(0, maxLength);
    }
    return fileName + '.json';
  }

  const messages = getMessages();

  if (messages.length === 0) {
    alert('No matching XPath found.');
    return;
  }
  if (messages.length % 2 !== 0) {
    alert(`The size of the messages array is ${messages.length} (not even).`);
    return;
  }

  const model = getModel();
  const structuredMessages = [];
  for (let i = 0; i < messages.length; i += 2) {
    structuredMessages.push({ role: 'user', content: messages[i] });
    structuredMessages.push({ role: 'assistant', content: messages[i + 1] });
  }

  const result = {
    model: model,
    messages: structuredMessages,
  };

  const fileName = generateFileName(messages[0]);
  downloadFile(JSON.stringify(result, null, 2), fileName, 'application/json');
})();
