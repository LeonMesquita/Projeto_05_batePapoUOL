let currentUser

function enterUser(){
    let name = prompt("Qual seu nome de usuário?")
    const newUser = {name: name.toString()}
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", newUser);
    promise.then(function(response){
        currentUser = name
        getMessages()
    });

    promise.catch(treatError)


}





function getMessages(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    console.log("atualiado")
    promise.then(function(response){
        addMessage(response);
    })

}


function addMessage(message){
    let messagesList = document.querySelector(".messages")
    messagesList.innerHTML = ""
    for (let count = 0; count < message.data.length; count++){
        if (message.data[count].type === "message"){
            messagesList.innerHTML += `
            <div class="message-div normal-message">
            <h3>(${message.data[count].time})</h3>
            <span><b>${message.data[count].from}</b> para Todos: ${message.data[count].text}</span>
            </div>
            ` 
        }
        else if (message.data[count].type === "status"){
            messagesList.innerHTML += `
            <div class="message-div status">
            <h3>(${message.data[count].time})</h3>
            <span><b>${message.data[count].from}</b> para Todos: ${message.data[count].text}</span>
            </div>
            ` 
        }
    }

        
}

function treatError(error){
    if (error.response.status === 400){
        alert("usuário já existente")
        enterUser()
    }
}


function sendMessage(){
    const message = document.querySelector("input").value
    const newMessage = {
        from: currentUser,
        to: "Fulano",
        text: message,
        type: "message"
    }
    
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", newMessage);
    promise.then(function(){
        getMessages();
    });
}

        //document.querySelector("input").value = ""


enterUser()
let idInterval = setInterval(getMessages, 3000)