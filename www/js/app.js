"use strict";

(function () {
  var form = document.getElementById("commandForm");
  var input = document.getElementById("commandInput");
  var status = document.getElementById("status");
  var response = document.getElementById("response");

  function understandCommand(raw) {
    var text = String(raw || "").trim().replace(/\s+/g, " ");

    if (!text) {
      return { type: "invalid", message: "Enter a command first." };
    }

    var open = text.match(/^open\s+(.+)$/i);
    if (open) {
      return { type: "openApp", appName: open[1].trim() };
    }

    var call = text.match(/^call\s+(.+)$/i);
    if (call) {
      var contact = call[1].trim();
      if (/^(father|papa)$/i.test(contact)) contact = "Dad";
      return { type: "callContact", contact: contact };
    }

    var sms = text.match(/^text\s+([^:]+):\s*(.*)$/i);
    if (sms) {
      var recipient = sms[1].trim();
      var message = sms[2].trim();

      if (!message) {
        return { type: "invalid", message: "Add a message after the colon." };
      }

      if (/^(father|papa)$/i.test(recipient)) recipient = "Dad";

      return {
        type: "prepareSms",
        recipient: recipient,
        message: message
      };
    }

    return { type: "chat", prompt: text };
  }

  function executeCommand(raw) {
    var command = understandCommand(raw);
    status.textContent = "Command understood";

    switch (command.type) {
      case "openApp":
        response.textContent = "App request: " + command.appName +
          ". Android app launching is not connected yet.";
        break;

      case "callContact":
        response.textContent = "Call request: " + command.contact +
          ". Contact access and calling are not connected yet.";
        break;

      case "prepareSms":
        response.textContent = "Text request for " + command.recipient +
          ": " + command.message +
          ". Android messaging is not connected yet.";
        break;

      case "invalid":
        status.textContent = "Command needs attention";
        response.textContent = command.message;
        break;

      case "chat":
        response.textContent = "Message received: " + command.prompt +
          ". The offline AI model is not connected yet.";
        break;
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    executeCommand(input.value);
  });
})();
