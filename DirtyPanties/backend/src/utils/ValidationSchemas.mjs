import { body } from 'express-validator';

export const AuthValidationSchema = {
    username: {
        notEmpty: {
            errorMessage : "email cannot be empty"
        },
        isString : {
            errorMessage: "must be a string value"
        },
    },
    password : {
        notEmpty:{
            errorMessage: "Password cannot be empty"
        }
    }
};

export const NewUserValidationSchema = [  
    body('birthDate')
      .notEmpty().withMessage('Age cannot be empty')
      .isString().withMessage('Age must be a string value'),
  
    body('username')
      .notEmpty().withMessage('Username cannot be empty')
      .isString().withMessage('Username must be a string value'),
  
    body('email')
      .notEmpty().withMessage('Email cannot be empty')
      .isString().withMessage('Email must be a string value'),
  
    body('password')
      .notEmpty().withMessage('Password cannot be empty')
      .isString().withMessage('Password must be a string value'),
  ];