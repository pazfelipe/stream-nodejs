# NODE STREAMS

This is a simple project to ilustrate how to work with large files using the most recent NodeJs Stream API.
Although the project is simple, it is a good starting point to understand how to work with streams.

I used just two libs here:
  For the server, I used csvforjson, which is a simple lib to convert csv files to json.
  For the front, I just used http-server, which is possible to create a local server. We can also use the VS Code extension called Live Server.

## Installing dependencies

Clone this repo. Once you have cloned it, go to each folder and run:

```bash
yarn
```

or using npm:
  
```bash
npm install
```

## Running the project

To run the server, access the server folder and run:
  
```bash
yarn dev
```

To run the frontend client, go the app folder and run:

```bash
yarn start
```

The source file was generated by [CSV Generator](https://extendsclass.com/csv-generator.html)

**Attempt to create the file with same fields or, if the file was created with other fields, please, update the server and app's code.**
