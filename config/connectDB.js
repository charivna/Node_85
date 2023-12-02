const { connect } = require("mongoose");

const connectDB = async () => {
    try {
        const db = await connect(process.env.DB_STRING);
        const { name, port, host } = db.connection;
        console.log(
            `DB is connected. Name: ${name}. Port: ${port}. Host: ${host}`.green
                .italic.bold
        );
    } catch (error) {
        console.log(error.message.red.bold);
        process.exit(1);
    }
};

module.exports = connectDB;
