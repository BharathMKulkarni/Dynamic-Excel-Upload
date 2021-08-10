
const submitBtn = document.getElementById("submitBtn");
let phone = '';
let otp = '';
let otpTimer = null;

const handleOTPTimeoutModalRetryButton = () => window.location.reload();

const OtpModalResendBtn = document.getElementById("OTPTimeoutModalResendButton");
const OTPTimeoutModalRetryButton = document.getElementById("OTPTimeoutModalRetryButton");
OTPTimeoutModalRetryButton.addEventListener("click",handleOTPTimeoutModalRetryButton,false);

function verifyOtp() {
    event.target.classList.add('loading');

    otp = document.getElementById("textField").value;
    const otpRegEx = new RegExp('[0-9]{6}', 'g');

    if(!otpRegEx.test(otp)) {
        document.getElementById("OTPModalTitle").innerText = "Invalid Credentials!";
        document.getElementById("OTPModalMessage").innerText = "The OTP you've entered is incorrect";
        document.getElementById("OTPTimeoutModalResendButton").style.display = "inline";
        $('#OTPModal').modal('show');

        event.target.classList.remove('loading');
        return;
    }

    // START THE LOADING SPINNER
    var spinner = document.querySelector(".loader");
    spinner.classList.remove("hidden");
    spinner.classList.add("translucent");

    fetch('/login/verify', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({phone, otp})
    })
    .then(res => {
        if(res.status === 403) {
            // remove the loading spinner
            spinner.classList.add("hidden");
            // enable otp submit button
            event.target.classList.remove('loading');

            document.getElementById("OTPModalTitle").innerText = "Invalid Credentials!";
            document.getElementById("OTPModalMessage").innerText = "The OTP you've entered is incorrect";
            document.getElementById("OTPTimeoutModalResendButton").style.display = "inline";
            $('#OTPModal').modal('show');
        }
        else if(res.status === 200) {
            window.location.href = '/home';
        }
    })
    .catch(err => window.location.href = '/home');
}


const requestForOtp = (event) => {
    // disable event source to avoid accidental double clicks
    event.target.classList.add('loading');

    var textInput = document.getElementById("textField");
    if(event.target === submitBtn)
        phone = textInput.value;
    const phoneNoRegEx = new RegExp('[789][0-9]{9}', 'g');

    var elem = document.getElementById("err")
    if(!phoneNoRegEx.test(phone))
    {
        document.getElementById("OTPModalTitle").innerText = "Invalid Phone Number";
        document.getElementById("OTPModalMessage").innerText = "Please enter a valid phone number and try again";
        document.getElementById("OTPTimeoutModalResendButton").style.display = "none";
        $('#OTPModal').modal('show');
    }
    else{
        elem.style.display='none';

        // START THE LOADING SPINNER
        var spinner = document.querySelector(".loader");
        spinner.classList.remove("hidden");
        spinner.classList.add("translucent");
    
        fetch('/login/get-otp', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({ phone })
        })
        .then(res => res.json())
        .then(data => {
            // temporarily logging otp to frontend for testing/dev
            console.log(data);

            // Changing button functionality and text field placeholders
            submitBtn.innerHTML = "Enter OTP";
            submitBtn.onclick = verifyOtp;
            textInput.value = "";
            textInput.placeholder = "Enter the otp";
            submitBtn.value = "Verify";
            textInput.pattern = "[0-9]{6}";

            // Hide modal if showing
            $('#OTPModal').modal('hide');

            // Setting OTP timer
            let timer = 120; // seconds to wait
            if(otpTimer)
                clearInterval(otpTimer);
            otpTimer = setInterval( () => {
                if(timer === -1) {
                    document.getElementById("OTPModalTitle").innerText = "Time Up!";
                    document.getElementById("OTPModalMessage").innerText = "Current OTP has expired, please try again";
                    document.getElementById("OTPTimeoutModalResendButton").style.display = "inline";
                    $('#OTPModal').modal('show');
                    return;
                }
                else if(timer === 100) {
                    document.getElementById("resendBtn").onclick = requestForOtp;
                    document.getElementById("resendBtn").style.opacity = "1";
                }
                document.getElementById("timer").innerHTML = `${timer}`;
                timer--;
            }, 1000);
                        
            document.getElementById("resendBtn").style.display = "block";
            document.getElementById("resendBtn").style.opacity = "0.5";

            // remove the loading spinner and enabling clicked button
            spinner.classList.add("hidden");
            event.target.classList.remove("loading");
        })
        .catch(err => window.location.href = '/home');
    }
}

submitBtn.onclick = requestForOtp;
OtpModalResendBtn.addEventListener('click', requestForOtp, false);



