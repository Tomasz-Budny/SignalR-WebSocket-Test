let conversationId = '25C0B0AD-89B4-4062-BAA3-2B43A46A8513';
let authToken = '';
let connection;

document.getElementById("disconnectChat").style.display = 'none';
document.getElementById("chatContainer").style.display = 'none';
document.getElementById("app").style.display = 'none';

document.getElementById("loginButton").addEventListener("click", (event) => {
  const token = document.getElementById("loginInput").value;
  authToken = token;

  // withCredentials false enables to bypass cors policy
  connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5014/chatshub", {
      withCredentials: false,
      accessTokenFactory: () => authToken
    })
    .build();

  connection.on("ReceiveMessage", function (message) {
    const p = document.createElement("p");
    p.classList.add('message')
    p.innerHTML = `<b>Chat:</b> (${conversationId}) <br><b>User:</b> (${message.senderId}) <br><b>Content:</b> (${message.content})`;

    document.getElementById("messagesList").appendChild(p)
  });

  document.getElementById("login").style.display = 'none';
  document.getElementById("app").style.display = 'block';
})

document.getElementById("joinChatButton").addEventListener("click", (event) => {
  const chatId = document.getElementById("chatIdInput").value;

  conversationId = chatId
  document.getElementById("jointChat").style.display = 'none';
  document.getElementById("chatContainer").style.display = 'block';
  document.getElementById("messagesList").style.display = 'block';
  document.getElementById("disconnectChat").style.display = 'block';

  document.getElementById("disconnectChatText").innerText = `Naciśnij aby odłączyć się z chatu o id: ${chatId}`;

  connection.start().then(function () {
    console.log("Connected to SignalR");

    connection.invoke("JoinConversation", conversationId).catch(function (err) {
      return console.error(err.toString());
    });
  }).catch(function (err) {
    return console.error(err.toString());
  });

  event.preventDefault();
})

document.getElementById("disconnectChatButton").addEventListener("click", (event) => {
  connection.invoke("LeaveConversation", conversationId).catch(function (err) {
    return console.error(err.toString());
  });

  document.getElementById("jointChat").style.display = 'block';
  document.getElementById("chatContainer").style.display = 'none';
  document.getElementById("messagesList").style.display = 'none';
  document.getElementById("disconnectChat").style.display = 'none';

  event.preventDefault();
})

document.getElementById("sendButton").addEventListener("click", function (event) {
  const content = document.getElementById("messageInput").value;
  connection.invoke("SendMessage", conversationId, content).catch(function (err) {
    return console.error(err.toString());
  });
  event.preventDefault();
});