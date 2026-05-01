////////////////////////////////////////////////////////////////////////
//NOTE: You need to add a hugging face token in your script properties//
////////////////////////////////////////////////////////////////////////
const HF_TOKEN = PropertiesService.getScriptProperties().getProperty('HF_TOKEN')

function doPost(e) {
  try {
    const content = JSON.parse(e.postData.contents)
    const result = query(content.message)
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify(e)).setMimeType(ContentService.MimeType.JSON);
  }
}

function query(data) {
  const payload = {
    model: "katanemo/Arch-Router-1.5B:hf-inference",
    messages: [{ role: "user", content: data.message }]
  }
  const options = {
    headers: {
      Authorization: "Bearer " + HF_TOKEN,
      "Content-Type": "application/json",
    },
    method: "POST",
    payload: JSON.stringify(payload),
  };

  const response = UrlFetchApp.fetch("https://router.huggingface.co/v1/chat/completions", options);
  return JSON.parse(response.getContentText());
}


function test() {
  const payload = {
    messages: [
      {
        role: "user",
        content: "What is the capital of France?",
      },
    ],
    model: "katanemo/Arch-Router-1.5B:hf-inference",
  };

  const response = query(payload);
  Logger.log(response);
}
