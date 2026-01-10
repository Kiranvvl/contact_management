// import { Sequelize } from "sequelize";
// import dotenv from "dotenv";

// const ENV = process.env.NODE_ENV || "development";

// if (ENV === "development") {
//   dotenv.config({ path: ".env.local" }); // local
// } else {
//   dotenv.config(); // production
// }

// const sequelize = new Sequelize(
//   process.env.DB_NAME as string,
//   process.env.DB_USER as string,
//   process.env.DB_PASSWORD as string,
//   {
//     host: process.env.DB_HOST,
//     port: Number(process.env.DB_PORT),
//     dialect: "mysql",
//     logging: ENV === "development" ? console.log : false 
//   }
// );

// export default sequelize;




import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  }
);

export default sequelize;
