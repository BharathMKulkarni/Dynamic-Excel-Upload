
const schema = [
    {
        name: "UserData",
        columns: [
            "userType", "phone", "email", "userPassword", "userStatus", "roleId",
            "firstName", "lastName", "mobile", "deptId", "designationId"
        ],
        // Please do change the description or format as you see fit, just an example I've taken
        description: [
            "Type of user",
            "Phone Number", 
            "Email Address",
            "Status of the user",
            "Role identification number",
            "User's first name",
            "User's last name",
            "Mobile number of the user", 
            "Department identification number",
            "Designation identification number"
        ],
        format: [
            "Three types of users: remote, local or international",
            "10 digits indicating your phone number",
            "Your email address: abc@xyz.com",
            "Status can be either 'active' or 'inactive'",
            "A 3 digit number",
            "",
            "",
            "10 digit mobile number",
            "3 digit number",
            "4 digit number"
        ]                  
    }
]

module.exports = { schema }