# Social Networking APIs

This project is a boilerplate code. For quickly getting started with a social networking.
This is purely a backend project where only APIs can be exposed

## Getting Started

1. You need MongoDB, use attached docker-compose file(in devops folder) for quickly installing MongoDB OR
   You follow your own procedure for installing MongoDB
2. Run `npm install`
3. Run server `npm run start:dev`

### Note

I used this project for generating my boilerplate code - https://github.com/seanpmaxwell/express-generator-typescript

## Technologies used

1. Expressjs
2. Nodejs
3. Typescript
4. MongoDB
5. Mongoose
6. JWT token

### Added following APIs

1. Category - Use this to set a category for a post
   Main Column

   1. name - Use this to set a name to Category

2. Comment - Use this for either reviews or comments
   Main Columns

   1. Description
   2. User Id
   3. Rating

3. Group - This is used for setting the group of a user. The user can be of any type(admin, customer, etc.)
   Main Coumns

   1. name - Name of the Group
   2. value - Any Integer value

4. Photo - As the name suggests, use this for posts
   Main Columns

   1. photoUrl
   2. title

5. Post - This is the crux of the APIs - All the relevant apis have been built, check the `postman routes zip folder`
   Main Columns

   1. title
   2. description
   3. photos - it could contain many photos
   4. comments - it could contain many comments

6. User - Another important API
   Main Columns

   1. Groups
   2. Email, we need maintian unique emails

7. FileHandler
   This is implemented using GridFS Stream, Grid FS Store and Multer - thanks to https://github.com/bradtraversy/mongo_file_uploads

### PostMan Routes

I have also attached PostMan routes for testing the APIs

### DevOps

Attached a docker file for you so that you can quickly get started with MongoDB installation

### Viewing MongoDB tables

I use community version of Mongo Compass for viewing the values of the tables.

### Want to use for production?

Check out this following project for deploying to production - https://github.com/seanpmaxwell/express-generator-typescript

### TODO

Write the test cases

## License

Of course whatever the conditions that are applicable in MIT License
