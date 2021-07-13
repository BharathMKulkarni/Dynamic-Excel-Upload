
const submitBtn = document.getElementById("submitBtn");
let phone = '';
let otp = '';

const handleOTPTimeoutModalRetryButton = () => window.location.reload();


const OTPTimeoutModalRetryButton = document.getElementById("OTPTimeoutModalRetryButton");
OTPTimeoutModalRetryButton.addEventListener("click",handleOTPTimeoutModalRetryButton,false);

function verifyOtp() {
    otp = document.getElementById("textField").value;

    fetch('/login/verify', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({phone, otp})
    })
    .then(res => {
        if(res.status === 403) {
            document.getElementById("OTPModalTitle").innerText = "Invalid Credentials!";
            $('#OTPModal').modal('show');
        }
        else if(res.status == 200) {
            window.location.href = '/home';
        }
    })
    // .then(homePage => {
    //     console.log(homePage)
    //     document.open();
    //     document.write(homePage);
    //     document.close();
    //     document.location.href = '/home'
    // })
    .catch(err => console.log(err));
}

submitBtn.onclick = (event) => {
    var textInput = document.getElementById("textField");
    phone = textInput.value;
    console.log("Inside on click", phone)
    
    fetch('/login/get-otp', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({ phone })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        submitBtn.innerHTML = "Verify & Proceed";
        submitBtn.onclick = verifyOtp;
        textInput.value = "";
        textInput.placeholder = "Enter the otp";
        textInput.pattern = "[0-9]{6}";
        let timer = 120; // 120 seconds time limit
        setInterval( () => {
            if(timer ===-1) {
                $('#OTPModal').modal('show');
                return;
            }
            document.getElementById("timer").innerHTML = `Time Remaining: ${timer}`;
            timer--;
        }, 1000);
    })
    .catch(err => console.log("Error" + err));
}


