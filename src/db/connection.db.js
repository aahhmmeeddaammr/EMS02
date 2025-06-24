import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("ems", "root", "Ahmed123", {
  host: "localhost",
  dialect: "mysql",
  port: "3306",
});

export const checkconnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export const syncDatabase = async () => {
  try {
    const result = await sequelize.sync({ alter: false, force: false });
    console.log({ result });
    console.log("Success in sync");
  } catch (error) {
    console.log("Error in sync");
  }
};
