const express = require("express");
const { register, LoginUser , ensureAuthenticated , currentUser, refreshRoute, forgetPass, emailVerification, changePassAfterReset, logout } = require("./auth.controller");
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const router = express.Router();

//limiter 
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 5 
// });
//validators
const registerValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address'),
    
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number'),
    
    body('confirmpass')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords do not match'),
    
    body('fname')
        .notEmpty()
        .withMessage('First name is required')
        .trim()
        .isLength({ min: 2, max: 20 })
        .withMessage('First name must be between 2 and 20 characters')
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage('First name can only contain letters'),
    
    body('lname')
        .notEmpty()
        .withMessage('Last name is required')
        .trim()
        .isLength({ min: 2, max: 20 })
        .withMessage('Last name must be between 2 and 20 characters')
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage('Last name can only contain letterss'),
    
    body('phone_number')
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^[0-9+\-\s()]+$/)
        .withMessage('Please provide a valid phone number'),

    body('company')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Company/University/School is required'),
        
    
    body('type')
        .isIn(['student', 'employee', 'other'])
        .withMessage('Type must be one of: student, employee, or other')
];

const loginValidation = [
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    body('email').optional().isEmail().withMessage('Invalid email format'),
    body('phone_number').optional().isMobilePhone().withMessage('Invalid phone number format')
];


router.post("/register", registerValidation,  register);
router.post("/login", loginValidation, LoginUser);
router.post("/forgot-password", emailVerification);
router.post("/verify-reset", forgetPass);
router.post("/reset-password", changePassAfterReset);
router.get("/current", ensureAuthenticated, currentUser);
router.post("/refresh-token", refreshRoute);
router.post("/logout", logout)

//production: 
//router.post("/reset-password",limiter, changePassAfterReset);
// router.post("/forgot-password",limiter, emailVerification);
// router.post("/verify-reset", limiter, forgetPass);
//router.post("/login", loginValidation, limiter, LoginUser);
module.exports = router;