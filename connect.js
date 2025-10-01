const mysql = require("mysql2");
const connection = mysql.createConnection({
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    host: '127.0.0.1',
    user: 'guest',
    password: 'dyVvXPFAbG6NzGyc',
    database: 'cake_shop_2',
    port: 3306
});
connection.connect(function(err){
    if (err) {
        return console.error("Ошибка: " + err.message);
    }
    else{
        console.log("Подключение к серверу MySQL успешно установлено");
    }
});

module.exports = connection;