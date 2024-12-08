import { body } from "express-validator";

export const register_user_validation: any[] = [
  body("name", "Username is required").not().isEmpty(),
  body("email", "Email is required")
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Email must be valid"),
  body("password", "Password is required")
    .not()
    .isEmpty()
    .matches(/\d/)
    .withMessage("Atleast one number is required")
    .matches(/[A-Z]+/)
    .withMessage("Atleast one capital letter is required")
    .matches(/[\W_]+/)
    .withMessage("Atleast one special character is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be between 6 to 20 characters"),
];

export const login_user_validation: any[] = [
  body("username_email", "Username/Email is required").not().isEmpty(),
  body("password", "Password is required").not().isEmpty(),
];

// export const GenerateForgotPasswordCodeValidation: any[] = [
//   body("email", "Email is required")
//     .not()
//     .isEmpty()
//     .isEmail()
//     .withMessage("Email must be valid"),
// ];

// export const VerifyForgotPasswordCodeValidation: any[] = [
//   body("email", "Email is required")
//     .not()
//     .isEmpty()
//     .isEmail()
//     .withMessage("Email must be valid"),
//   body("forgot_password_code", "Forgot password code is required")
//     .not()
//     .isEmpty(),
// ];

// export const ResetPasswordValidation: any[] = [
//   body("email", "Email is required")
//     .not()
//     .isEmpty()
//     .isEmail()
//     .withMessage("Email must be valid"),
//   body("password", "Password is required")
//     .not()
//     .isEmpty()
//     .matches(/\d/)
//     .withMessage("Atleast one number is required")
//     .matches(/[A-Z]+/)
//     .withMessage("Atleast one capital letter is required")
//     .matches(/[\W_]+/)
//     .withMessage("Atleast one special character is required")
//     .isLength({ min: 6, max: 20 })
//     .withMessage("Password must be between 6 to 20 characters"),
//   body("confirm_password", "Confirm password is required")
//     .not()
//     .isEmpty()
//     .matches(/\d/)
//     .withMessage("Atleast one number is required")
//     .matches(/[A-Z]+/)
//     .withMessage("Atleast one capital letter is required")
//     .matches(/[\W_]+/)
//     .withMessage("Atleast one special character is required")
//     .isLength({ min: 6, max: 20 })
//     .withMessage("Password must be between 6 to 20 characters"),
// ];

// export const VerifyMFACodeValidation: any[] = [
//   body("verification_code", "Verification code is required").not().isEmpty(),
//   body("secret", "Secret is required").not().isEmpty(),
// ];
