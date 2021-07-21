# Chatapredu

## Project Description

This is the backend setup for the Chatapredu application. This connects the frontend of our application to DynamoDB for storing chat and forum discussion data. Using Cognito and Amplify we are storing and authenticating user information for user accounts. This backend handles the main CRUD opertations of the application to store and edit data stored in the database system.

## Technologies Used
* JavaScript/TypeScript
* Node.js
* AWS Lambda
* AWS API Gateway
* Serverless Framework
* DynamoDB
* Cognito
* AWS Amplify
* AWS S3

## Features

List of features ready and TODOs for future development
* Awesome feature 1
* Awesome feature 2
* Awesome feature 3

To-do list:
* Wow improvement to be done 1
* Wow improvement to be done 2

## Getting Started
   
(include git clone command)
(include all environment setup steps)

> Be sure to include BOTH Windows and Unix command  
> Be sure to mention if the commands only work on a specific platform (eg. AWS, GCP)

- All the `code` required to get started
- Images of what it should look like

## Usage

> Here, you instruct other people on how to use your project after they’ve installed it. This would also be a good place to include screenshots of your project in action.

## Contributors

> Here list the people who have contributed to this project. (ignore this section, if its a solo project)

## License

This project uses the following license: [<license_name>](<link>).

{
    "context": {
      "role": "$context.authorizer.claims['custom:role']"
    }
}
