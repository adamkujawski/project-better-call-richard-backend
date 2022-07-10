## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)

## General info
A platform for reporting mechanical defects. 

Users can report their car to a mechanic, providing their contact information and a description of the car and the defect.

After reporting the defect, the user receives an email about the report. 

The mechanic can log in to see the list of defects. 
He can schedule new defects for a date that suits him, and provide a preliminary repair quote.

After such an event, the user will receive an email, and can accept the preliminary terms by clicking on the link.

After the repair, the mechanic can complete the request by editing it.

	
** Unfortunately, the backend part without commits, because I forgot to properly configure the .gitignore :) 
  
## Technologies
* NodeJs
* TypeScript
* MySql
* ExpressJS
* nodemailer

	
## Setup
To run this project, install it locally using npm:

Frontend:
- npm i 
- run scrtip "start" from package.json

Backend:
- npm i 
- change parameters in /config/config.example.ts and /config/config.nodemailer.example.ts
- run script start:dev

## DEMO

https://bettercallrichard.networkmanager.pl

Richard account to login

- richard@richard.com
- 1234

Or you can register your own account by sending json (method post)  https://bettercallrichard.networkmanager.pl/api/test/register 
This function it is not ready from frontend side.

json example: 
{
  "name": "your_name",
  "email":"your_email",
  "password":"your_password",
}

