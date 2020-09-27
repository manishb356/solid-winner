document.getElementById("share-button").addEventListener("click", getURL);

function getURL() {
  const c_url = window.location.href;
  copyToClipboard(c_url);
  alert("url copied to clipboard");
}

function copyToClipboard(text) {
  var copiedText = document.createElement("textarea");
  document.body.appendChild(copiedText);
  copiedText.value = text;
  copiedText.select();
  document.execCommand("copy");
  document.body.removeChild(copiedText);
}

function getInputValue() {
  var url = document.getElementById("invite-link-input").value;
  var code = url.split("/");
  window.open(code);
}
