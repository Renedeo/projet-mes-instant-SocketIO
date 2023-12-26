// Import the connection module
const client = require("./ConnectionDatabase");

const dbname = "Messagerie";
const collectionname = "Messagerie_instant";

const connectionToDatabase = async function () {
  try {
    await client.connect();
    console.log(`Connected to the ${dbname} database`);
  } catch (error) {
    console.log(`Error connecting to ${dbname} database: ${error}`);
  }
};

// Define the main function
async function main() {
  try {
    // Attempt to connect to the database
    await connectionToDatabase();
  } catch (error) {
    console.error(`Error connecting to Database: ${error}`);
  } finally {
    // Close the database connection in the finally block
    console.log(`Database closed successfully`);
    await client.close();
  }
}

// Call the main function to start the script
main();
