// =====================================================
// ALUMNI CONNECT - REAL TIME MESSAGING
// =====================================================

console.log("MESSAGES.JS LOADED");


// =====================================================
// SOCKET.IO
// =====================================================

// Same Node.js server se Socket.IO connection
const socket = io();


// =====================================================
// CURRENT LOGGED-IN USER
// =====================================================

let myName = "";


// Login ke time save hua user
const storedUser =
    localStorage.getItem("alumniUser");


// User ka naam nikalo
if (storedUser) {

    try {

        const userData =
            JSON.parse(storedUser);

        if (userData.name) {

            myName =
                userData.name.trim();

        }

    }

    catch (error) {

        console.error(
            "User data error:",
            error
        );

    }

}


// Agar localStorage me user nahi mila
// to sessionStorage se check karo

if (!myName) {

    const currentUserData =
        sessionStorage.getItem(
            "currentUser"
        );

    if (currentUserData) {

        try {

            const userData =
                JSON.parse(
                    currentUserData
                );

            if (userData.name) {

                myName =
                    userData.name.trim();

            }

        }

        catch (error) {

            console.error(
                "Current user data error:",
                error
            );

        }

    }

}


// Fallback
if (!myName) {

    myName = "Raja Kumar";

}


// =====================================================
// CURRENT CHAT USER
// =====================================================

let currentUser = "";


// =====================================================
// HTML ELEMENTS
// =====================================================

const messageInput =
    document.getElementById(
        "messageInput"
    );


const messagesContainer =
    document.getElementById(
        "messages"
    );


const sendButton =
    document.getElementById(
        "sendButton"
    );


const userSearch =
    document.getElementById(
        "userSearch"
    );


// =====================================================
// SOCKET CONNECT
// =====================================================

socket.on(
    "connect",
    function () {

        console.log(
            "Socket connected:",
            socket.id
        );


        // Current user ko uske naam ke room me join karo

        if (myName) {

            socket.emit(
                "joinUser",
                myName
            );

        }

    }
);


// =====================================================
// SOCKET ERROR
// =====================================================

socket.on(
    "connect_error",
    function (error) {

        console.error(
            "Socket connection error:",
            error
        );


        alert(
            "Backend server se connection nahi ho raha. Server check karo."
        );

    }
);


// =====================================================
// GET USER FROM URL
// =====================================================

const params =
    new URLSearchParams(
        window.location.search
    );


const selectedUser =
    params.get("user");


if (selectedUser) {

    openChat(
        selectedUser
    );

}


// =====================================================
// OPEN CHAT
// =====================================================

function openChat(name) {

    if (!name) {
        return;
    }


    console.log(
        "Opening chat with:",
        name
    );


    currentUser =
        name.trim();


    // Chat name

    const chatName =
        document.getElementById(
            "chatName"
        );


    // Chat avatar

    const chatAvatar =
        document.getElementById(
            "chatAvatar"
        );


    if (chatName) {

        chatName.innerText =
            currentUser;

    }


    // =================================================
    // CREATE INITIALS
    // =================================================

    const words =
        currentUser
            .trim()
            .split(" ");


    let initials = "";


    words.forEach(
        function (word) {

            if (word.length > 0) {

                initials +=
                    word
                        .charAt(0)
                        .toUpperCase();

            }

        }
    );


    if (chatAvatar) {

        chatAvatar.innerText =
            initials;

    }


    // Load old messages

    loadMessages();

}


// =====================================================
// LOAD OLD MESSAGES
// =====================================================

async function loadMessages() {

    if (!messagesContainer) {

        return;

    }


    if (!currentUser) {

        return;

    }


    messagesContainer.innerHTML = "";


    try {

        const url =
            `/api/messages/${encodeURIComponent(myName)}/${encodeURIComponent(currentUser)}`;


        console.log(
            "Loading messages:",
            url
        );


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "HTTP Error: " +
                response.status
            );

        }


        const messages =
            await response.json();


        messages.forEach(
            function (message) {

                const type =
                    message.sender === myName
                        ? "sent"
                        : "received";


                createMessageElement(

                    message.message,

                    type,

                    formatTime(
                        message.time
                    )

                );

            }
        );


        scrollToBottom();

    }


    catch (error) {

        console.error(
            "Error loading messages:",
            error
        );

    }

}


// =====================================================
// CREATE MESSAGE ELEMENT
// =====================================================

function createMessageElement(
    text,
    type,
    time
) {

    if (!messagesContainer) {

        return;

    }


    const message =
        document.createElement(
            "div"
        );


    message.classList.add(
        "message",
        type
    );


    message.innerHTML = `

        <p>${escapeHTML(text)}</p>

        <span>${escapeHTML(time)}</span>

    `;


    messagesContainer.appendChild(
        message
    );

}


// =====================================================
// SEND MESSAGE
// =====================================================

function sendMessage() {

    console.log(
        "SEND MESSAGE FUNCTION CALLED"
    );


    if (!messageInput) {

        console.error(
            "messageInput not found"
        );

        return;

    }


    const text =
        messageInput.value.trim();


    if (text === "") {

        alert(
            "Please type a message."
        );

        return;

    }


    if (!socket.connected) {

        alert(
            "Server se connection nahi hai."
        );

        return;

    }


    if (!currentUser) {

        alert(
            "Pehle kisi alumni ko select karo."
        );

        return;

    }


    if (!myName) {

        alert(
            "Current user nahi mila."
        );

        return;

    }


    // =================================================
    // MESSAGE DATA
    // =================================================

    const messageData = {

        sender:
            myName,

        receiver:
            currentUser,

        message:
            text

    };


    console.log(
        "Sending:",
        messageData
    );


    // Backend ko message bhejo

    socket.emit(
        "sendMessage",
        messageData
    );


    // Input clear

    messageInput.value = "";

}


// =====================================================
// SEND BUTTON
// =====================================================

if (sendButton) {

    sendButton.addEventListener(
        "click",
        function () {

            sendMessage();

        }
    );

}


// =====================================================
// MESSAGE SENT
// =====================================================

socket.on(
    "messageSent",
    function (message) {

        console.log(
            "MESSAGE SENT:",
            message
        );


        if (
            message.sender === myName &&
            message.receiver === currentUser
        ) {

            createMessageElement(

                message.message,

                "sent",

                formatTime(
                    message.time
                )

            );


            scrollToBottom();

        }

    }
);


// =====================================================
// RECEIVE MESSAGE
// =====================================================

socket.on(
    "receiveMessage",
    function (message) {

        console.log(
            "MESSAGE RECEIVED:",
            message
        );


        if (
            message.sender === currentUser &&
            message.receiver === myName
        ) {

            createMessageElement(

                message.message,

                "received",

                formatTime(
                    message.time
                )

            );


            scrollToBottom();

        }

    }
);


// =====================================================
// ENTER KEY
// =====================================================

if (messageInput) {

    messageInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                sendMessage();

            }

        }
    );

}


// =====================================================
// SEARCH ALUMNI
// =====================================================

if (userSearch) {

    userSearch.addEventListener(
        "keyup",
        function () {

            const search =
                this.value
                    .toLowerCase()
                    .trim();


            const users =
                document.querySelectorAll(
                    ".user"
                );


            users.forEach(
                function (user) {

                    const name =
                        (
                            user.dataset.name ||
                            ""
                        )
                        .toLowerCase();


                    if (
                        name.includes(
                            search
                        )
                    ) {

                        user.style.display =
                            "flex";

                    }

                    else {

                        user.style.display =
                            "none";

                    }

                }
            );

        }
    );

}


// =====================================================
// FORMAT TIME
// =====================================================

function formatTime(date) {

    if (!date) {

        return "";

    }


    return new Date(date)
        .toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}


// =====================================================
// SCROLL TO BOTTOM
// =====================================================

function scrollToBottom() {

    if (!messagesContainer) {

        return;

    }


    messagesContainer.scrollTop =
        messagesContainer.scrollHeight;

}


// =====================================================
// SECURITY - ESCAPE HTML
// =====================================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


// =====================================================
// INITIAL LOAD
// =====================================================

// Agar URL me user diya hua hai,
// openChat() already call ho chuka hai.

if (!selectedUser) {

    console.log(
        "No chat user selected."
    );

}