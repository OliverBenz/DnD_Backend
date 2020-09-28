# Configuration
Under [src/](../src/) create a `dbcon-pool.js` file with your database information in the following format:

    var pool = mysql.createPool({
        host: '[host-ip]',             // Docker standard: 172.17.0.1
        user: '[mysql-username]',
        password: '[mysql-password]',
        port: '[mysq-port]',           // Standard: 3306
        database: '[databasename]'
    });

By default, the backend will connect over port 3004. This can be changed under `app.listen(3004, ...)` in the [app.js](../app.js) 
