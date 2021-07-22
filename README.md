# Chatapredu

## Project Description

This is the backend setup for the Chatapredu application. This connects the frontend of our application to DynamoDB for storing chat and forum discussion data. Using Cognito and Amplify we are storing and authenticating user information for user accounts. This backend handles the main CRUD operations of the application to store and edit data stored in the database system.

## Technologies Used
* JavaScript/TypeScript
* Node.js
* AWS Lambda
* AWS API Gateway
* Serverless Framework
* DynamoDB
* AWS S3

## Get Started

> First navigate to the location where you would like to store a clone of this repository on your local device using Git Bash. Use the following command:
  - `git clone https://github.com/210524training/p2-g3-back-end.git`
> Once you have a clone on your local device, open the p2-g3-back-end folder in the terminal by type in the following commands: 
  - `git`
  - `cd p2-g3-back-end`
  - `cd general`
  - `npm install`
  - `npm install -g serverless`

## Usage

> To deploy the application, make sure you are in the same directory as the previous section, then run the bellow command: 
  - `sls deploy`

## License

This project uses the following license: [MIT](./LICENSE).
