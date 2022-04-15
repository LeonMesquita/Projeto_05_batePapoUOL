let currentUser

function enterUser(){
    let name = prompt("Qual seu nome de usuário?")
    const newUser = {name: name.toString()}
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", newUser);
    promise.then(
    currentUser = name,
        getMessages()

    )
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
    let scrollMessage
    messagesList.innerHTML = ""
    messagesList.scrollIntoView();
    for (let count = 0; count < message.data.length; count++){
        if (message.data[count].type === "message"){
            messagesList.innerHTML += `
            <div class="message-div normal-message" id="${count}">
            <h3>(${message.data[count].time})</h3>
            <span><b>${message.data[count].from}</b> para ${message.data[count].to}: ${message.data[count].text}</span>
            </div>
            `
            scrollMessage = document.getElementById(count).scrollIntoView();

        }
        else if (message.data[count].type === "status"){
            messagesList.innerHTML += `
            <div class="message-div status" id="${count}">
            <h3>(${message.data[count].time})</h3>
            <span><b>${message.data[count].from}</b> para ${message.data[count].to}: ${message.data[count].text}</span>
            </div>
            ` 
            scrollMessage = document.getElementById(count).scrollIntoView();

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
        to: "Todos",
        text: message,
        type: "message"
    }
    
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", newMessage);
    promise.then(function(){
        document.querySelector("input").value = ""
        getMessages();
    });

    promise.catch(function(){
        window.location.reload()
    })
}


function keepConnection(){
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", {name: currentUser})
    promise.then(function(){
        console.log("checkado, usuário on")
    })

    promise.catch(function(){
        window.location.reload()
    })
}



enterUser()
let idMessagesInterval = setInterval(getMessages, 3000)
let idConnectionInterval = setInterval(keepConnection, 5000)