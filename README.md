# Nodequelize
Nodequelize is a NodeJS REST API generator powered by Express and Sequelize. It uses a simple configuration file that lets you define your models, database connection settings and other options to create a fully functional CRUD (Create, Read, Update and Delete) REST API that you can start using immediately.

## Current and future features
- [x] Create a NodeJS + Express + Sequelize API structure automatically
- [x] Create CRUD models, controllers and routes for your entities in a project
- [x] Basic Auth endpoint authentication
- [x] Create paginated searches for big data sources
- [ ] Create individual CRUD entities without creating a whole project 
- [ ] JSON Web Tokens (JWT) endpoint authentication
- [ ] Create automatic FULLTEXT searches
- [ ] Automatically create API documentation in a README
- [ ] Have special cases for CRUD entities (for example, User entity with special endpoints)

## Usage
### Create an API from scratch
- Install nodequelize globally with `npm install -g nodequelize`
- `cd` into the directory where you want your API created **(be careful where you run the command, as it will replace preexisting files)**
- Create a new JSON file in this directory and call it `my_api_settings.json`
- Add the settings of your API with the following structure:
```
{
    "port": "4444",
    "apiRoute": "api",
    "packageInfo": {
        "name": "my-api",
        "version": "1.0.0",
        "description": "My new API, generated by Nodequelize",
        "author": "Nodequelize"
    },
    "authConfig": {
        "type": "Basic Auth",
        "read": {
            "user": "api-read",
            "password": "password-read"
        },
        "write": {
            "user": "api-write",
            "password": "password-write"
        },
        "delete": {
            "user": "api-delete",
            "password": "password-delete"
        }
    },
    "databaseConfig": {
        "prod": {
            "username": "username-prod",
            "password": "password-prod",
            "database": "database-prod",
            "host": "host-prod",
            "port": "port-prod",
            "dialect": "mssql"
        },
        "dev": {
            "username": "username-dev",
            "password": "password-dev",
            "database": "database-dev",
            "host": "host-dev",
            "port": "port-dev",
            "dialect": "mssql"
        }
    },
    "models": [
        {
            "modelName": "Player",
            "tableName": "Players",
            "routeEndpoint": "players",
            "fields": [
                { "name": "name", "type": "STRING", "allowNull": false },
                { "name": "number", "type": "INTEGER", "allowNull": true },
                { "name": "isInjured", "type": "BOOLEAN", "allowNull": false }
            ],
            "associations": [
                { "type": "belongsTo", "model": "Team", "foreignKey": "TeamId", "include": true }
            ]
        },
        {
            "modelName": "Team",
            "tableName": "Teams",
            "routeEndpoint": "teams",
            "fields": [
                { "name": "name", "type": "STRING", "allowNull": false },
                { "name": "country", "type": "STRING", "allowNull": true }
            ],
            "associations": [
                { "type": "hasMany", "model": "Player", "foreignKey": "TeamId", "include": false }
            ]
        }
    ]
}
```
- Generate your API with `nodequelize create_project my_api_settings.json`
- Install the API dependencies with `npm install`
- Run your API with `npm start`
- Go to your browser and access `http://localhost:4444/api`, you should see a message indicating that it's working!

### Using the API endpoints
Nodequelize generates 6 endpoints that should cover the basic CRUD use cases:
#### List all the records `GET /api/myModel/`
Returns all the records in an array.
#### Get one specific record `GET /api/myModel/id/:id`
Returns the record with the specified id.
#### Create a new record `POST /api/myModel/`
Creates a new record. You should send your data on an `application/json` body.
#### Update a record `PUT /api/myModel/`
Updates an existing record. You should send your data on an `application/json` body. Plase be sure to include the `id` field inside your body.
#### Delete a record `DELETE /api/myModel/id/:id`
Deletes the record with the specified `id`. 
#### Paginated search `GET /api/myModel/search`
For large sets of data, you might want to use a paginated search to avoid listing all records. You can use this endpoint and pass some query params to paginate your results:
    - `limit`: Limits the number of results. Defaults to 10.
    - `page`: Number of page you want to show. Defaults to 1.
    - More to come in the future!

## Warnings, limitations and known issues
This library is on it's early stages, and more features will be added in the future. Please take note of the following before using it:
- Currently, only `Basic Auth` endpoints are supported. JWT Token auth is coming soon.
- DBMS specific dependences are added according to the `prod` setting under `databaseConfig`.
- PostgreSQL dependence is missing `"pg-hstore": "^2.3.2"`, so please add it manually to the generated `package.json`.
- Currently, only one-to-many relationships are supported, like the one on the example config file. You have to indicate the association both ways (`belongsTo` on the child and `hasMay` on the parent). The `foreignKey` field should be the same on both associations to work.
- **Please consider contributing to Nodequelize if you see the potential in this tool!**

### License
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.