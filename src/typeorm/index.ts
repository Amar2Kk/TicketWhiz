import { DataSource } from "typeorm";
import { ticketConfig } from "./entities/ticketSchema";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.MYSQL_DB_HOST,
  port: parseInt(process.env.MYSQL_DB_PORT || "3306"),
  username: process.env.MYSQL_DB_USERNAME,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB_DATABASE,
  synchronize: true,
  entities: [ticketConfig],
});
