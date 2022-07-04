import { createPool } from "mysql2/promise";
import { config } from "../config/config";

export const pool = createPool({
  host: config.dbHost,
  port: config.dbPort,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbDatabase,
  namedPlaceholders: true, // pozwala na bezpieczne wysylanie danych
  decimalNumbers: true, // aby liczby byly liczbami
});
