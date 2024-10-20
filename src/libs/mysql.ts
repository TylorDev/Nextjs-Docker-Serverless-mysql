import mysql from "serverless-mysql";

export const conn = mysql({
  config: {
    host: "localhost",
    user: "root", // Cambia esto
    password: "root_password", // Cambia esto
    port: 3306,
    database: "nextdb",
  },
});
