const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Invalid Name");
  } else if (firstName.length < 4 || firstName.length > 20) {
    throw new Error("FirstName should be 4 to 20 characters long");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid Email ID");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

const validateProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "email",
    "password",
    "about",
    "photoUrl",
    "skills",
    "age",
    "gender"
  ];

  const isAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isAllowed;
};

const validatePasswordPayload=(req)=>{

}

module.exports = { validateSignUpData, validateProfileData,validatePasswordPayload };
