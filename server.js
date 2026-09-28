const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

const Message = require("./models/message");
const pageRoutes = require("./routes/pages");

dotenv.config();

const app = express();
const server = http.createServer(app);


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST"]
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// =====================================================
// EJS SETUP
// =====================================================

app.set("view engine", "ejs");

app.set(
    "views",
    path.join(__dirname, "views")
);


// =====================================================
// PUBLIC FOLDER
// =====================================================

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// =====================================================
// PAGE ROUTES
// =====================================================

app.use("/", pageRoutes);


// =====================================================
// SOCKET.IO
// =====================================================

const io = new Server(server, {

    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }

});


// =====================================================
// MONGODB
// =====================================================

mongoose
    .connect(process.env.MONGODB_URI)

    .then(() => {

        console.log(
            "MongoDB Connected Successfully"
        );

    })

    .catch((error) => {

        console.log(
            "MongoDB Error:",
            error.message
        );

    });


// =====================================================
// TEST API
// =====================================================

app.get("/api", (req, res) => {

    res.json({
        message: "Alumni Connect API is running"
    });

});


// =====================================================
// GET CHAT HISTORY
// =====================================================

app.get(
    "/api/messages/:user1/:user2",
    async (req, res) => {

        try {

            const user1 =
                decodeURIComponent(
                    req.params.user1
                );

            const user2 =
                decodeURIComponent(
                    req.params.user2
                );


            console.log(
                "Loading messages:",
                user1,
                "<->",
                user2
            );


            const messages =
                await Message.find({

                    $or: [

                        {
                            sender: user1,
                            receiver: user2
                        },

                        {
                            sender: user2,
                            receiver: user1
                        }

                    ]

                }).sort({

                    time: 1

                });


            res.json(messages);

        }

        catch (error) {

            console.log(
                "GET MESSAGE ERROR:",
                error.message
            );


            res.status(500).json({

                error: error.message

            });

        }

    }
);


// =====================================================
// SOCKET CONNECTION
// =====================================================

io.on(
    "connection",
    (socket) => {

        console.log(
            "Socket connected:",
            socket.id
        );


        // =================================================
        // JOIN USER ROOM
        // =================================================

        socket.on(
            "joinUser",
            (username) => {

                if (!username) {

                    console.log(
                        "Username missing"
                    );

                    return;

                }


                const cleanUsername =
                    String(username).trim();


                console.log(
                    "User joining room:",
                    cleanUsername
                );


                socket.join(
                    cleanUsername
                );


                console.log(
                    `Socket ${socket.id} joined room ${cleanUsername}`
                );

            }
        );


        // =================================================
        // SEND MESSAGE
        // =================================================

        socket.on(
            "sendMessage",
            async (data) => {

                console.log(
                    "--------------------------------"
                );

                console.log(
                    "MESSAGE RECEIVED:"
                );

                console.log(data);


                try {

                    // ==============================
                    // VALIDATION
                    // ==============================

                    if (
                        !data ||
                        !data.sender ||
                        !data.receiver ||
                        !data.message
                    ) {

                        console.log(
                            "Invalid message data"
                        );

                        return;

                    }


                    const sender =
                        String(
                            data.sender
                        ).trim();


                    const receiver =
                        String(
                            data.receiver
                        ).trim();


                    const messageText =
                        String(
                            data.message
                        ).trim();


                    if (!messageText) {

                        console.log(
                            "Empty message"
                        );

                        return;

                    }


                    // ==============================
                    // SAVE MESSAGE IN MONGODB
                    // ==============================

                    const newMessage =
                        new Message({

                            sender: sender,

                            receiver: receiver,

                            message: messageText

                        });


                    const savedMessage =
                        await newMessage.save();


                    console.log(
                        "MESSAGE SAVED:"
                    );

                    console.log(
                        savedMessage
                    );


                    // ==============================
                    // SEND TO RECEIVER
                    // ==============================

                    io.to(receiver).emit(
                        "receiveMessage",
                        savedMessage
                    );


                    console.log(
                        "Message sent to receiver:",
                        receiver
                    );


                    // ==============================
                    // SEND CONFIRMATION TO SENDER
                    // ==============================

                    io.to(sender).emit(
                        "messageSent",
                        savedMessage
                    );


                    console.log(
                        "Message confirmation sent to sender:",
                        sender
                    );


                    console.log(
                        "--------------------------------"
                    );

                }

                catch (error) {

                    console.log(
                        "MESSAGE ERROR:",
                        error.message
                    );


                    socket.emit(
                        "messageError",
                        {
                            error: error.message
                        }
                    );

                }

            }
        );


        // =================================================
        // DISCONNECT
        // =================================================

        socket.on(
            "disconnect",
            () => {

                console.log(
                    "Socket disconnected:",
                    socket.id
                );

            }
        );

    }
);


// =====================================================
// SERVER
// =====================================================

const PORT =
    process.env.PORT || 3000;


server.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );

    }
);