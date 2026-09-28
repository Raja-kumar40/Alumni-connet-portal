// ==========================================
// ALUMNI CONNECT PORTAL
// FINAL SCRIPT
// ==========================================


// =================================================
// NAVIGATION
// =================================================

function scrollToSection(sectionId) {

    const section = document.getElementById(sectionId);

    if (section) {
        section.scrollIntoView({
            behavior: "smooth"
        });
    }
}


// =================================================
// LOGIN MODAL
// =================================================

function openLogin() {

    const loginModal = document.getElementById("loginModal");

    if (loginModal) {
        loginModal.style.display = "flex";
    }
}


function closeLogin() {

    // Login nahi hua hai to popup close nahi hoga
    if (sessionStorage.getItem("isLoggedIn") !== "true") {
        return;
    }

    const loginModal = document.getElementById("loginModal");

    if (loginModal) {
        loginModal.style.display = "none";
    }
}


// =================================================
// REGISTER MODAL
// =================================================

function openRegister() {

    const registerModal =
        document.getElementById("registerModal");

    if (registerModal) {
        registerModal.style.display = "flex";
    }
}


function closeRegister() {

    const registerModal =
        document.getElementById("registerModal");

    if (registerModal) {
        registerModal.style.display = "none";
    }
}


// =================================================
// SWITCH LOGIN / REGISTER
// =================================================

function switchToRegister() {

    const loginModal =
        document.getElementById("loginModal");

    if (loginModal) {
        loginModal.style.display = "none";
    }

    openRegister();
}


function switchToLogin() {

    closeRegister();

    openLogin();
}


// =================================================
// REGISTER
// =================================================

function setupRegister() {

    const registerForm =
        document.getElementById("registerForm");

    if (!registerForm) {
        return;
    }


    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const nameElement =
                document.getElementById("registerName");

            const emailElement =
                document.getElementById("registerEmail");

            const passwordElement =
                document.getElementById("registerPassword");

            const roleElement =
                document.getElementById("registerRole");


            const name =
                nameElement
                    ? nameElement.value.trim()
                    : "";


            const email =
                emailElement
                    ? emailElement.value.trim().toLowerCase()
                    : "";


            const password =
                passwordElement
                    ? passwordElement.value
                    : "";


            const role =
                roleElement
                    ? roleElement.value
                    : "Alumni";


            // ================= VALIDATION =================

            if (!name) {

                alert("Please enter your name.");

                return;
            }


            if (!email) {

                alert("Please enter your email.");

                return;
            }


            if (!password) {

                alert("Please enter your password.");

                return;
            }


            if (password.length < 6) {

                alert(
                    "Password must be at least 6 characters."
                );

                return;
            }


            // ================= CREATE USER =================

            const user = {

                name: name,

                email: email,

                password: password,

                role: role || "Alumni"

            };


            // Save registered user

            localStorage.setItem(
                "alumniUser",
                JSON.stringify(user)
            );


            // New registration means not logged in

            sessionStorage.removeItem(
                "isLoggedIn"
            );


            sessionStorage.removeItem(
                "currentUser"
            );


            alert(
                "Registration successful! Please login."
            );


            // Close register modal

            closeRegister();


            // Open login modal

            openLogin();


            // Automatically fill email

            const loginEmail =
                document.getElementById(
                    "loginEmail"
                );


            if (loginEmail) {

                loginEmail.value = email;

            }


            // Password empty

            const loginPassword =
                document.getElementById(
                    "loginPassword"
                );


            if (loginPassword) {

                loginPassword.value = "";

            }


            // Reset registration form

            registerForm.reset();

        }
    );
}


// =================================================
// LOGIN
// =================================================

function setupLogin() {

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
                document.getElementById("loginEmail");

            const passwordElement =
                document.getElementById("loginPassword");


            const email =
                emailElement
                    ? emailElement.value.trim().toLowerCase()
                    : "";


            const password =
                passwordElement
                    ? passwordElement.value
                    : "";


            // Get registered user

            const savedUser =
                localStorage.getItem(
                    "alumniUser"
                );


            if (!savedUser) {

                alert(
                    "Account not found. Please register first."
                );

                return;
            }


            let user;


            try {

                user = JSON.parse(savedUser);

            }

            catch (error) {

                alert(
                    "User data is corrupted. Please register again."
                );


                localStorage.removeItem(
                    "alumniUser"
                );


                return;
            }


            // ================= COMPARE EMAIL =================

            const savedEmail =
                String(user.email)
                    .trim()
                    .toLowerCase();


            const emailMatch =
                email === savedEmail;


            // ================= COMPARE PASSWORD =================

            const savedPassword =
                String(user.password);


            const passwordMatch =
                password === savedPassword;


            console.log(
                "Entered Email:",
                email
            );


            console.log(
                "Saved Email:",
                savedEmail
            );


            // ================= LOGIN SUCCESS =================

            if (emailMatch && passwordMatch) {


                // Login status

                sessionStorage.setItem(
                    "isLoggedIn",
                    "true"
                );


                // Current user

                sessionStorage.setItem(
                    "currentUser",
                    JSON.stringify(user)
                );


                // Remove login lock

                document.body.classList.remove(
                    "authentication-required"
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


                // Clear login form

                loginForm.reset();


                alert(
                    "Login successful! Welcome " +
                    user.name
                );

            }

            else {

                alert(
                    "Invalid Email or Password."
                );

            }

        }
    );
}


// =================================================
// MODAL OUTSIDE CLICK
// =================================================

function setupModalClick() {

    window.addEventListener(
        "click",
        function (event) {


            const loginModal =
                document.getElementById(
                    "loginModal"
                );


            const registerModal =
                document.getElementById(
                    "registerModal"
                );


            // Login modal

            if (
                event.target === loginModal &&
                sessionStorage.getItem(
                    "isLoggedIn"
                ) === "true"
            ) {

                closeLogin();

            }


            // Register modal

            if (
                event.target === registerModal
            ) {

                closeRegister();

            }

        }
    );
}


// =================================================
// ALUMNI SEARCH
// =================================================

function setupAlumniSearch() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "keyup",
        function () {


            const searchValue =
                searchInput.value
                    .toLowerCase()
                    .trim();


            const alumniCards =
                document.querySelectorAll(
                    ".alumni-card"
                );


            alumniCards.forEach(
                function (card) {


                    const text =
                        card.innerText
                            .toLowerCase();


                    if (
                        text.includes(
                            searchValue
                        )
                    ) {

                        card.style.display =
                            "";

                    }

                    else {

                        card.style.display =
                            "none";

                    }

                }
            );

        }
    );
}


// =================================================
// CONNECT ALUMNI
// =================================================

function connectAlumni(name) {

    alert(
        "Connection request sent to " +
        name
    );
}


// =================================================
// EVENT REGISTRATION
// =================================================

function registerEvent(eventName) {

    alert(
        "You have successfully registered for " +
        eventName
    );
}


// =================================================
// JOB APPLICATION
// =================================================

function applyJob(jobName) {

    alert(
        "Application started for " +
        jobName
    );
}


// =================================================
// CONTACT FORM
// =================================================

function setupContactForm() {

    const contactForm =
        document.getElementById(
            "contactForm"
        );


    if (!contactForm) {
        return;
    }


    contactForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const nameElement =
                document.getElementById(
                    "name"
                );


            const name =
                nameElement
                    ? nameElement.value
                    : "User";


            alert(
                "Thank you " +
                name +
                "! Your message has been sent."
            );


            contactForm.reset();

        }
    );
}


// =================================================
// OPEN MESSAGE
// =================================================

function openMessage(name) {

    // Node.js / Express route
    window.location.href =
        "/messages?user=" +
        encodeURIComponent(name);
}


// =================================================
// NAVBAR SEARCH
// =================================================

function searchWebsite() {

    const navSearch =
        document.getElementById(
            "navSearch"
        );


    if (!navSearch) {
        return;
    }


    const searchValue =
        navSearch.value
            .trim()
            .toLowerCase();


    if (!searchValue) {

        alert(
            "Please enter something to search."
        );

        return;
    }


    const sections =
        document.querySelectorAll(
            "section"
        );


    let found = false;


    sections.forEach(
        function (section) {


            if (found) {
                return;
            }


            const text =
                section.innerText
                    .toLowerCase();


            if (
                text.includes(
                    searchValue
                )
            ) {

                section.scrollIntoView({
                    behavior: "smooth"
                });


                found = true;

            }

        }
    );


    if (!found) {

        alert(
            "No result found for: " +
            searchValue
        );

    }
}


// =================================================
// LOGIN REQUIRED
// =================================================

function checkLogin() {

    const isLoggedIn =
        sessionStorage.getItem(
            "isLoggedIn"
        );


    if (isLoggedIn === "true") {

        document.body.classList.remove(
            "authentication-required"
        );

    }

    else {

        document.body.classList.add(
            "authentication-required"
        );


        // Page open hote hi login popup

        openLogin();

    }
}


// =================================================
// PLACEMENT SLIDER
// =================================================

let placementIndex = 0;

let placementCards = [];


function initializePlacementSlider() {

    placementCards =
        document.querySelectorAll(
            ".placement-card"
        );


    // Agar placement cards nahi hain
    // to function yahin stop ho jayega

    if (!placementCards.length) {
        return;
    }


    updatePlacement();
}


function updatePlacement() {

    if (!placementCards.length) {
        return;
    }


    placementCards.forEach(
        function (card) {

            card.classList.remove(
                "active"
            );

        }
    );


    placementCards[
        placementIndex
    ].classList.add(
        "active"
    );
}


// =================================================
// NEXT PLACEMENT
// =================================================

function nextPlacement() {

    if (!placementCards.length) {
        return;
    }


    placementIndex++;


    if (
        placementIndex >=
        placementCards.length
    ) {

        placementIndex = 0;

    }


    updatePlacement();
}


// =================================================
// PREVIOUS PLACEMENT
// =================================================

function prevPlacement() {

    if (!placementCards.length) {
        return;
    }


    placementIndex--;


    if (placementIndex < 0) {

        placementIndex =
            placementCards.length - 1;

    }


    updatePlacement();
}


// =================================================
// AUTO PLACEMENT MOVEMENT
// =================================================

function startPlacementSlider() {

    if (!placementCards.length) {
        return;
    }


    setInterval(
        function () {

            nextPlacement();

        },
        3000
    );
}


// =================================================
// DROPDOWN SHOW / HIDE FUNCTIONS
// =================================================

function showDropdown(element) {

    // Dropdown ke andar ka content dhundhein

    if (!element) {
        return;
    }


    const content =
        element.querySelector(
            ".dropdown-content"
        );


    if (content) {

        content.style.display = "flex";

        content.style.flexDirection =
            "column";

        content.style.position =
            "absolute";

        content.style.top =
            "100%";

        content.style.left =
            "0";

        content.style.backgroundColor =
            "#fdfae7";

        content.style.minWidth =
            "220px";

        content.style.boxShadow =
            "0px 8px 16px rgba(0,0,0,0.2)";

        content.style.zIndex =
            "999999";

        content.style.border =
            "1px solid #e0e0e0";

        content.style.borderRadius =
            "4px";

        content.style.padding =
            "0";

        content.style.margin =
            "0";

    }
}


// =================================================
// HIDE DROPDOWN
// =================================================

function hideDropdown(element) {

    if (!element) {
        return;
    }


    const content =
        element.querySelector(
            ".dropdown-content"
        );


    if (content) {

        content.style.display =
            "none";

    }
}


// =================================================
// PAGE LOAD
// =================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        console.log(
            "ALUMNI CONNECT PORTAL LOADED"
        );


        // Login / Register

        setupRegister();

        setupLogin();

        setupModalClick();


        // Alumni

        setupAlumniSearch();


        // Contact

        setupContactForm();


        // Login protection

        checkLogin();


        // Placement slider

        initializePlacementSlider();

        startPlacementSlider();

    }
);