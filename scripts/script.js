let currentUser
let listOfUsers = []
let messageType = "message"
let messageDestination = "Todos"
let messageVisibility = "público"
let id1
let id2
let id3

//Função de login e entrar no chat
function enterUser(){
    let name = document.querySelector(".login-screen input").value
    const newUser = {name: name.toString()}
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", newUser);

    promise.then(
        currentUser = name,
        document.querySelector(".loading").classList.toggle("hidden"),
        document.querySelector(".login-screen input").classList.toggle("hidden"),
        document.querySelector(".login-screen button").classList.toggle("hidden"),
        getMessages(),
        getUsers(),
        id1 = setInterval(getMessages, 3000),
        id2 = setInterval(keepConnection, 5000),
        id3 = setInterval(getUsers, 1000*10),
    )
   promise.catch(treatUserError)
}

//Função que é chamada caso o nome de usuário já exista
function treatUserError(error){
    if (error.response.status === 400){
        clearInterval(id1)
        clearInterval(id2)
        clearInterval(id3)

       let loginInput = document.querySelector(".login-input");
       document.querySelector(".loading").classList.toggle("hidden"),
       document.querySelector(".login-screen input").classList.toggle("hidden"),
       document.querySelector(".login-screen button").classList.toggle("hidden"),
       loginInput.parentNode.classList.toggle("hidden");
       loginInput.classList.add("login-error");
       loginInput.value = "";
       loginInput.placeholder = "Este nome de usuário já existe!";

    }
}


function getMessages(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(function(response){
        addMessage(response);
        document.querySelector(".login-screen").classList.add("hidden")
    })

}


function getUsers(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promise.then(function(response){
        listOfUsers = response
    })

}


//Função que carrega as mensagens na tela
function addMessage(message){
    let messagesList = document.querySelector(".messages")
    let scrollMessage
    let messageClass
    let res = ""
    messagesList.innerHTML = ""


    for (let count = 0; count < message.data.length; count++){
        if (message.data[count].type === "message"){
            messageClass = `class="message-div normal-message" id="${count}"`;
            printMessage();
        }
        else if (message.data[count].type === "status"){
             messagesList.innerHTML += `
             <div class="message-div status" id="${count}">
             <h3>(${message.data[count].time})</h3>
             <span><b>${message.data[count].from}</b> entrou na sala...</span>
             </div>
             `
             scrollMessage = document.getElementById(count).scrollIntoView();
        }
        else if (message.data[count].type === "private_message" && (message.data[count].from === currentUser || message.data[count].to === currentUser)){
            messageClass = `class="message-div privately-message" id="${count}"`;
            res = "reservadamente"
            printMessage();
        }

        function printMessage(){
            messagesList.innerHTML += `
            <div ${messageClass}>
            <h3>(${message.data[count].time})</h3>
            <span><b>${message.data[count].from}</b> ${res} para <b>${message.data[count].to}</b>: ${message.data[count].text}</span>
            </div>
            `
            scrollMessage = document.getElementById(count).scrollIntoView();
            res = ""
        }

    }     
}



function sendMessage(){
    const message = document.querySelector(".type-box input").value
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
        <input type="text" placeholder=" Escreva aqui..." onkeydown="keyCode(event)">
        `
        messageDestination = "Todos"
        messageType = "message"
        getMessages();
    });

    promise.catch(function(){
      window.location.reload()
    })
}


// Verificar se o usuário está online
function keepConnection(){
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", {name: currentUser})
    promise.then(function(){

    })

    promise.catch(function(){
        window.location.reload()
    })
}


// Função que ativa e desativa o menu lateral
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



// Selecionar destinatário
function selectContact(contact){
    let selectedContact = contact.parentNode.querySelector(".selected")
   if (selectedContact !== null){
        selectedContact.classList.remove("selected")
        selectedContact.querySelector(".check-icon").classList.toggle("hidden");
   }

    contact.querySelector(".check-icon").classList.toggle("hidden");
    contact.classList.add("selected")


    messageDestination = contact.querySelector("h2").innerHTML
    if (messageDestination === "Todos")
        messageVisibility = "público"
    else{
         messageVisibility = "reservadamente"
         messageType = "private_message"
    }


    changeTypeBox()
}

// Selecionar visibilidade
function selectVisibility(visibility){

    let selectedVisibility = visibility.parentNode.querySelector(".selected")
   if (selectedVisibility !== null){
    selectedVisibility.classList.remove("selected")
    selectedVisibility.querySelector(".check-icon").classList.toggle("hidden");
   }


   visibility.querySelector(".check-icon").classList.toggle("hidden");
   visibility.classList.add("selected")

   if( visibility.querySelector("h2").innerHTML === "Público" || messageDestination === "Todos"){
        messageType = "message"
        messageVisibility = "público"
   }
   else{
    messageType = "private_message"
    messageVisibility = "reservadamente"

   }
   changeTypeBox()

}



// Função que muda a caixa de texto quando o usuário escolhe o destinatário e a visibilidade
function changeTypeBox(){
    let inputElement = document.querySelector(".type-box div")
    inputElement.innerHTML = ""
    inputElement.innerHTML += `
    <input type="text" placeholder=" Escreva aqui..." onkeydown="keyCode(event)">
        <span>Enviando para ${messageDestination} (${messageVisibility})</span>  
    `
}




// Enviar mensagem ao pressionar enter
function keyCode(event){
    if (event.keyCode == 13){
        document.querySelector(".type-box button").click();
    }
}

