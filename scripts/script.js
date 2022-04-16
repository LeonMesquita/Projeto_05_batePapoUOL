let currentUser
let listOfUsers = []
let messageType = "message"
let messageDestination = "Todos"
let messageVisibility = "público"

function enterUser(){
    let name = prompt("Qual seu nome de usuário?")
    const newUser = {name: name.toString()}
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", newUser);
    promise.then(
    currentUser = name,
        getMessages(),
        getUsers()
    )
    promise.catch(treatError)
}



function getUsers(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promise.then(function(response){
        listOfUsers = response
    })

}


function getMessages(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(function(response){
        addMessage(response);

    })

}


function addMessage(message){
    let messagesList = document.querySelector(".messages")
    let scrollMessage
    let messageClass
    messagesList.innerHTML = ""


    for (let count = 0; count < message.data.length; count++){
        if (message.data[count].type === "message"){
            messageClass = `class="message-div normal-message" id="${count}"`;
        }
        else if (message.data[count].type === "status")
            messageClass = `class="message-div status" id="${count}"`;
           else if (message.data[count].type === "private_message")
           {
            messageClass = `class="message-div privately-message" id="${count}"`;

           }


        messagesList.innerHTML += `
        <div ${messageClass}>
        <h3>(${message.data[count].time})</h3>
        <span><b>${message.data[count].from}</b> para ${message.data[count].to}: ${message.data[count].text}</span>
        </div>
        `
        scrollMessage = document.getElementById(count).scrollIntoView();
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
        to: messageDestination,
        text: message,
        type: messageType
    }
    
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", newMessage);
    promise.then(function(){
        document.querySelector("input").value = ""
        document.querySelector(".type-box div").innerHTML = `
            <input type="text" placeholder=" Escreva aqui..."> `
        messageDestination = "Todos"
        messageType = "message"
        getMessages();
    });

    promise.catch(function(){
        window.location.reload()
    })
}


function keepConnection(){
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", {name: currentUser})
    promise.then(function(){
    })

    promise.catch(function(){
        window.location.reload()
    })
}



function changeSideMenu(){
    let contactsElement = document.querySelector(".contact");
    contactsElement.innerHTML = `
    <div class="contacts-div" onclick="selectContact(this)">
    <div>
        <img src="images/people-outline.svg"/>
        <h2>Todos</h2>
    </div>
    <img src="images/check.svg" class="check-icon hidden" />

   </div>
    `
        for (let count = 0; count < listOfUsers.data.length; count++){
        contactsElement.innerHTML += `
        <div class="contacts-div" onclick="selectContact(this)">
        <div>
            <img src="images/profile.svg"/>
            <h2>${listOfUsers.data[count].name}</h2>
        </div>
        <img src="images/check.svg" class="check-icon hidden" />

       </div>
        `
    }
    document.querySelector(".side-menu").classList.toggle("hidden");


}

function changeTypeBox(){
    let inputElement = document.querySelector(".type-box div")
    inputElement.innerHTML = ""
    inputElement.innerHTML += `
        <input type="text" placeholder=" Escreva aqui...">
        <span>Enviando para ${messageDestination} (${messageVisibility})</span>  
    `
}

function selectContact(contact){
    let selectedContact = contact.parentNode.querySelector(".selected")
   if (selectedContact !== null){
        selectedContact.classList.remove("selected")
        selectedContact.querySelector(".check-icon").classList.toggle("hidden");
   }

    contact.querySelector(".check-icon").classList.toggle("hidden");
    contact.classList.add("selected")


    messageDestination = contact.querySelector("h2").innerHTML

    changeTypeBox()
}

function selectVisibility(visibility){

    let selectedVisibility = visibility.parentNode.querySelector(".selected")
   if (selectedVisibility !== null){
    selectedVisibility.classList.remove("selected")
    selectedVisibility.querySelector(".check-icon").classList.toggle("hidden");
   }


   visibility.querySelector(".check-icon").classList.toggle("hidden");
   visibility.classList.add("selected")

   if( visibility.querySelector("h2").innerHTML === "Público"){
        messageType = "message"
        messageVisibility = "público"
   }
   else{
    messageType = "private_message"
    messageVisibility = "reservadamente"

   }
   changeTypeBox()

}




enterUser()
let idMessagesInterval = setInterval(getMessages, 3000);
let idConnectionInterval = setInterval(keepConnection, 5000);
let idUsersInterval = setInterval(getUsers, 1000*10);