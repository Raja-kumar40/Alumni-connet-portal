/* =====================================================
   ALUMNI CONNECT - LOGIN / SIGNUP PROTECTION
===================================================== */

(function () {

    const USERS_KEY = "alumniUsers";
    const LOGIN_KEY = "alumniLoggedInUser";


    // =====================================================
    // GET USERS
    // =====================================================

    function getUsers() {

        return JSON.parse(
            localStorage.getItem(USERS_KEY) || "[]"
        );

    }


    // =====================================================
    // SAVE USERS
    // =====================================================

    function saveUsers(users) {

        localStorage.setItem(
            USERS_KEY,
            JSON.stringify(users)
        );

    }


    // =====================================================
    // GET LOGGED-IN USER
    // =====================================================

    function getLoggedInUser() {

        return JSON.parse(
            localStorage.getItem(LOGIN_KEY) || "null"
        );

    }


    // =====================================================
    // CHECK LOGIN
    // =====================================================

    function isLoggedIn() {

        return !!getLoggedInUser();

    }


    // =====================================================
    // INDEX PAGE PROTECTION
    // =====================================================

    function protectHomePage() {

        const loginModal =
            document.getElementById("loginModal");

        const registerModal =
            document.getElementById("registerModal");


        // Login/Register modal page par nahi hai

        if (!loginModal || !registerModal) {
            return;
        }


        // User login nahi hai

        if (!isLoggedIn()) {

            document.body.classList.add(
                "authentication-required"
            );


            // Login modal open

            setTimeout(function () {

                loginModal.style.display = "flex";

            }, 100);

        }

        else {

            // User already logged in

            document.body.classList.remove(
                "authentication-required"
            );


            loginModal.style.display = "none";

            registerModal.style.display = "none";


            updateLoginButtons();

        }

    }


    // =====================================================
    // LOGIN
    // =====================================================

    function setupAuthLogin() {

        const loginForm =
            document.getElementById("loginForm");


        if (!loginForm) {
            return;
        }


        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const emailElement =
                    document.getElementById(
                        "loginEmail"
                    );


                const passwordElement =
                    document.getElementById(
                        "loginPassword"
                    );


                const email =
                    emailElement
                        ? emailElement.value
                            .trim()
                            .toLowerCase()
                        : "";


                const password =
                    passwordElement
                        ? passwordElement.value
                        : "";


                const users =
                    getUsers();


                const user =
                    users.find(
                        function (item) {

                            return (
                                item.email === email &&
                                item.password === password
                            );

                        }
                    );


                // Invalid login

                if (!user) {

                    alert(
                        "Invalid Email or Password!"
                    );

                    return;
                }


                // =================================================
                // LOGIN SAVE
                // =================================================

                localStorage.setItem(
                    LOGIN_KEY,
                    JSON.stringify({

                        name: user.name,

                        email: user.email,

                        role: user.role

                    })
                );


                alert(
                    "Login Successful! Welcome " +
                    user.name
                );


                // Close login modal

                const loginModal =
                    document.getElementById(
                        "loginModal"
                    );


                if (loginModal) {

                    loginModal.style.display =
                        "none";

                }


                // Unlock page

                document.body.classList.remove(
                    "authentication-required"
                );


                // Update navbar

                updateLoginButtons();

            }
        );

    }


    // =====================================================
    // SIGNUP / REGISTER
    // =====================================================

    function setupAuthRegister() {

        const registerForm =
            document.getElementById(
                "registerForm"
            );


        if (!registerForm) {
            return;
        }


        registerForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const nameElement =
                    document.getElementById(
                        "registerName"
                    );


                const emailElement =
                    document.getElementById(
                        "registerEmail"
                    );


                const passwordElement =
                    document.getElementById(
                        "registerPassword"
                    );


                const roleElement =
                    document.getElementById(
                        "registerRole"
                    );


                const name =
                    nameElement
                        ? nameElement.value.trim()
                        : "";


                const email =
                    emailElement
                        ? emailElement.value
                            .trim()
                            .toLowerCase()
                        : "";


                const password =
                    passwordElement
                        ? passwordElement.value
                        : "";


                const role =
                    roleElement
                        ? roleElement.value
                        : "Alumni";


                // =================================================
                // VALIDATION
                // =================================================

                if (
                    !name ||
                    !email ||
                    !password
                ) {

                    alert(
                        "Please fill all required fields."
                    );

                    return;
                }


                if (password.length < 6) {

                    alert(
                        "Password must be at least 6 characters."
                    );

                    return;
                }


                // Get existing users

                const users =
                    getUsers();


                // Check existing email

                const existingUser =
                    users.find(
                        function (item) {

                            return item.email === email;

                        }
                    );


                if (existingUser) {

                    alert(
                        "This email is already registered."
                    );

                    return;
                }


                // =================================================
                // CREATE NEW USER
                // =================================================

                const newUser = {

                    name: name,

                    email: email,

                    password: password,

                    role: role || "Alumni"

                };


                users.push(newUser);


                // Save users

                saveUsers(users);


                alert(
                    "Account created successfully! Now login."
                );


                // Close register modal

                const registerModal =
                    document.getElementById(
                        "registerModal"
                    );


                if (registerModal) {

                    registerModal.style.display =
                        "none";

                }


                // Open login modal

                const loginModal =
                    document.getElementById(
                        "loginModal"
                    );


                if (loginModal) {

                    loginModal.style.display =
                        "flex";

                }


                // Automatically fill email

                const loginEmail =
                    document.getElementById(
                        "loginEmail"
                    );


                if (loginEmail) {

                    loginEmail.value =
                        email;

                }


                // Password empty

                const loginPassword =
                    document.getElementById(
                        "loginPassword"
                    );


                if (loginPassword) {

                    loginPassword.value =
                        "";

                }

            }
        );

    }


    // =====================================================
    // LOGOUT
    // =====================================================

    window.logoutUser = function () {

        localStorage.removeItem(
            LOGIN_KEY
        );


        alert(
            "You have been logged out."
        );


        // Node.js route
        window.location.href = "/";

    };


    // =====================================================
    // LOGIN / LOGOUT BUTTON UPDATE
    // =====================================================

    function updateLoginButtons() {

        const navButtons =
            document.querySelector(
                ".nav-buttons"
            );


        if (!navButtons) {
            return;
        }


        if (!isLoggedIn()) {
            return;
        }


        const loggedUser =
            getLoggedInUser();


        if (!loggedUser) {
            return;
        }


        navButtons.innerHTML = `

            <span class="welcome-user">
                Hi, ${loggedUser.name}
            </span>

            <button
                onclick="logoutUser()"
                class="logout-btn"
            >
                Logout
            </button>

        `;

    }


    // =====================================================
    // PROTECT MESSAGES PAGE
    // =====================================================

    function protectMessagesPage() {

        const isMessagesPage =
            window.location.pathname
                .toLowerCase()
                .includes("/messages");


        if (!isMessagesPage) {
            return;
        }


        if (!isLoggedIn()) {

            alert(
                "Please Login or Sign Up first."
            );


            // Node.js route
            window.location.href =
                "/?loginRequired=true";

        }

    }


    // =====================================================
    // PAGE LOAD
    // =====================================================

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            setupAuthLogin();

            setupAuthRegister();

            protectMessagesPage();

            protectHomePage();


            if (isLoggedIn()) {

                updateLoginButtons();

            }

        }
    );


})();