import { DataSourceOptions, DataSource } from "typeorm"
export const dataSourceOptions : DataSourceOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3307,
    username: 'root',
    password: '1234',
    database: 'blog-nestjs',
    entities: ["dist/**/*.entity.js"],
    migrations: ["dist/db/migrations/*.js"],
    synchronize: false
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;