async function loginUser(event) {

    event.preventDefault();


    // Get email and password

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    // Login button

    const loginButton =
        document.querySelector(".login-button");


    // Check fields

    if (!email || !password) {

        alert("Please enter email and password.");

        return;
    }


    // Show loading

    loginButton.innerText = "Logging in...";

    loginButton.disabled = true;


    try {

        /* =========================================
           SEND LOGIN REQUEST TO BACKEND
        ========================================= */

        const response = await fetch(
            "http://localhost:5000/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );


        const data = await response.json();


        /* =========================================
           CHECK BACKEND RESPONSE
        ========================================= */

        if (!response.ok) {

            alert(
                data.message ||
                "Login failed."
            );

            loginButton.innerText = "Login →";

            loginButton.disabled = false;

            return;
        }


        /* =========================================
           CHECK SELECTED ROLE
        ========================================= */

        if (data.user.role !== selectedRole) {

            alert(
                "Role mismatch.\n\n" +
                "This account is registered as " +
                data.user.role +
                "."
            );

            loginButton.innerText = "Login →";

            loginButton.disabled = false;

            return;
        }


        /* =========================================
           SAVE LOGIN DATA
        ========================================= */

        localStorage.setItem(
            "token",
            data.token
        );


        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );


        /* =========================================
           REDIRECT USER
        ========================================= */

        if (data.user.role === "student") {

            window.location.href =
                "student/dashboard.html";

        }


        else if (data.user.role === "staff") {

            window.location.href =
                "staff/dashboard.html";

        }

    }


    catch (error) {

        console.error(error);


        alert(
            "Unable to connect to server.\n\n" +
            "Make sure your backend is running."
        );


        loginButton.innerText =
            "Login →";


        loginButton.disabled =
            false;
    }

}