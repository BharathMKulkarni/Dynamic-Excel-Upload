

const schema = [
    {
        id:"One",
        name:"userType", 
        description:"Type of user",
        format:"Three types of users: remote, local or international",
    },
    {
        id:"Two",
        name:"phone",
        description:"Phone Number",        
        format:"10 digits indicating your phone number",
    },
    {
        id:"Three",
        name:"email",
        description:"Email Address",
        format:"Your email address: abc@xyz.com",
    },
    {
        id:"Four",
        name:"userPassword", 
        description: "password of the user ",
        format:"password shuld consist of 6 characters",
    },
    {
        id:"Five",
        name:"userStatus", 
        description: "Status of the user",
        format:"Status can be either 'active' or 'inactive'",
    },
    {
        id:"Six",
        name:"roleId",
        description:"Role identification number",
        format: "A 3 digit number",
    },
    {
        id:"Seven",
        name:"firstName",
        description:"User's first name",
        format:"",
    },
    {
        id:"Eight",
        name:"lastName",
        description: "User's last name",
        format:"",
    },
    {
        id:"Nine",
        name:"mobile", 
        description:"Mobile number of the user", 
        format: "10 digit mobile number",
    },
    {
        id:"Ten",
        name:"deptId",
        description: "Department identification number",
        format:"3 digit number",
    },
    {
        id:"Eleven",
        name:"designationId",
        description:"Designation identification number",
        format: "4 digit number",
    }
]

keys = {
    "userData" : "phone"
}

module.exports = { schema, keys }