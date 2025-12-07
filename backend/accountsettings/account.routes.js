const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { ensureAuthenticated } = require("../Auth/auth.controller");
const { changePass, editInfo, deleteAccount, takeFeedback } = require("./account.controller")


const Validation = [
        body('phone_number')
            .optional({ checkFalsy: true })
            .trim()
            .matches(/^[0-9+\-\s()]+$/)
            .withMessage('Please provide a valid phone number'),

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
        
        body('email')
            .optional()
            .isEmail()
            .withMessage('Invalid email format'),
]


router.patch("/editAccount",ensureAuthenticated, Validation, editInfo)
router.patch("/changePassword",ensureAuthenticated, changePass)
router.delete("/deleteAccount",ensureAuthenticated, deleteAccount)
router.post("/feedback", ensureAuthenticated, takeFeedback)

module.exports = router;