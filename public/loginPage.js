
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
    .then(res => res.text())
    .then(homePage => {
        console.log(homePage)
        document.open();
        document.write(homePage);
        document.close();
        document.location.href = '/home'
    })
    .catch(err => console.log(err));
}




submitBtn.onclick = (event) => {
    var textInput = document.getElementById("textField");
    phone = textInput.value;
    console.log("Inside on click", phone)
    var elem = document.getElementById("err")
    if(phone<1)
    {
        document.getElementById("err").innerHTML = `Number field is empty`; 
        elem.style.display='block'
    }
    else{
        elem.style.display='none'
    
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
        submitBtn.innerHTML = "Enter OTP";
        submitBtn.onclick = verifyOtp;
        textInput.value = "";
        textInput.placeholder = "Enter the otp";
        submitBtn.value = "Verify";
        textInput.pattern = "[0-9]{6}";
        let timer = 120; // 120 seconds time limit
        setInterval( () => {
            if(timer ===-1) {
                $('#OTPModal').modal('show');
                return;
            }
            document.getElementById("timer").innerHTML = `${timer}`;
            timer--;
        }, 1000);
    })
    .catch(err => console.log("Error" + err));
}
}


