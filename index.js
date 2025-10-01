const flash = require('express-flash');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require("mysql2");
const url = require('url');
const session = require("express-session")

const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf8');
const connection = require('./connect');
const cabinetUrl = url.resolve('/cabinet', 'cabinet');
const app = express();

//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text({defaultCharset: 'utf-8'}));
app.use(function(req, res, next) {
    console.log(req.originalUrl);
    next();
});

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(express.json());

const fs = require('fs');
var multer = require('multer');
const { constants } = require('buffer');
var upload = multer({ dest: 'public/images/' })
// const upload = multer({
//     dest: './public/images/',
//     limits: { fileSize: 10000000000 },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
//             return cb(new Error('Только изображения!'));
//         }
//         cb(null, true);
//     }
// });
app.set('view engine', 'ejs');
app.set('views', 'public');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/st', express.static(path.join(__dirname, 'public')));
app.use(flash());
// const connection = mysql.createConnection({
//     host: '127.0.0.1',
//     user: 'guest',
//     password: 'dyVvXPFAbG6NzGyc',
//     database: 'cake_shop',
//     port: 3306,
//   });
//    connection.connect(function(err){
//       if (err) {
//         return console.error("Ошибка: " + err.message);
//       }
//       else{
//         console.log("Подключение к серверу MySQL успешно установлено");
//       }
//    });

app.use(function(req, res, next) {
    console.log(req.originalUrl);
    next();
});
// app.get('/main', function(req, res) {
//     res.sendFile(path.join(__dirname, 'public/main.ejs'));
// });



app.post('/login', function(req, res){
    const body = req.body;
    console.log(body)
    const { username, password } = req.body;
    console.log(`Username: ${username}, Password: ${password}`);
    if (username && password){
        connection.query("SELECT * FROM users WHERE login = ? AND password = ?", [username, password], function(error, result, fields){
            if(error) throw error;
            if (result.length > 0){
                req.session.loginmsg = '';
                req.session.logginedin = true;
                req.session.userid = result[0].id;
                console.log(req.session.userid)
                req.session.username = username;
                req.session.password = password;
                req.session.role = result[0].role;
                req.session.email = result[0].email;
                console.log(req.session.role);
                res.status(200).redirect('/main');
                res.end();
            }
            else {
                req.session.loginmsg = 'Неверный логин или пароль';
                res.status(401).redirect(cabinetUrl);
            }
            res.end();
        });
    }
    else {
        req.session.loginmsg = 'Введите логин и пароль';
        res.status(401).redirect(cabinetUrl);
        res.end();
    }
});

app.post('/reg', function(req, res){
    const body = req.body;
    console.log(body)
    const { username, password, email } = req.body;
    console.log(`Username: ${username}, Password: ${password}`);
    if (username && password && email){
        connection.query("SELECT * FROM users WHERE login = ?", [username], function(error, result, fields){
            if(error) throw error;
            if (result.length == 0){
                connection.query("INSERT INTO `cake_shop_2`.`users` (`id`, `login`, `email`, `password`, `role`) VALUES (NULL, ?, ?, ?, 'USER');", [username, email, password], function(error, result, fields){
                    if(error) throw error;
                    req.session.loginmsg = 'Учётная запись создана';
                    res.status(200).redirect('/cabinet');
                    res.end();
                });
            }
            else{
                req.session.loginmsg = 'Такой аккаунт уже зарегистрирован';
                res.status(401).redirect(cabinetUrl);
                res.end();
            }
        });
    }
    else {
        req.session.loginmsg = 'Не все поля заполнены';
        res.status(401).redirect(cabinetUrl);
        res.end();
    }
});

app.post('/exit', function(req, res){
    req.session.logginedin = false;
    req.session.username = null;
    req.session.cart = [];
    res.status(401).redirect(cabinetUrl);
});

app.get('/main', function(req, res){
    if(req.session.logginedin) {
        connection.query('SELECT * FROM cakes', (err, rows, fields) => {
            if (err) throw err;
            res.set('Content-Type', 'text/html');
            res.status(200).render('main', { data: rows});
        });
    }
    else{
        res.set('Content-Type', 'text/html');
        res.status(401).redirect(cabinetUrl);
    }
});

app.get('/cakes', function(req, res){
    
    if(req.session.logginedin) {
        res.set('Content-Type', 'text/html');
        res.status(200).render('cakes');
    }
    else{
        res.set('Content-Type', 'text/html');
        res.status(401).redirect(cabinetUrl);
    }
});

app.get('/contacts', function(req, res){
    
    if(req.session.logginedin) {
        res.set('Content-Type', 'text/html');
        res.status(200).render('contacts', {email: req.session.email});
    }
    else{
        res.set('Content-Type', 'text/html');
        res.status(401).redirect(cabinetUrl);
    }
});

app.get('/admin', function(req, res){
    
    if(req.session.logginedin && req.session.role == "ADMIN") {
        res.set('Content-Type', 'text/html');
        connection.query('SELECT * FROM cakes', (err, rows, fields) => {
            if (err) throw err;
        res.status(200).render('admin', { data: rows});
        });
    }
    else{
        res.set('Content-Type', 'text/html');
        res.status(401).redirect(cabinetUrl);
    }
});

app.get('/addInfo', function(req, res){
    
    if(req.session.logginedin && req.session.role == "ADMIN") {
        res.set('Content-Type', 'text/html');
        connection.query('SELECT * FROM cakes', (err, rows, fields) => {
            if (err) throw err;
        res.status(200).render('admin', { data: rows});
        });
    }
    else{
        res.set('Content-Type', 'text/html');
        res.status(401).redirect(cabinetUrl);
    }
});


app.post('/updField', upload.single('updImg'), function (req, res, next) {
    const { id, name, type, info, price} = req.body;
    const updImg = req.file;
    console.log(name, " ", type, " ", info, " ", price);
    if ((updImg == undefined) && (id == '' || name == '' || type == '' || info == '' || price == '')){
        req.session.cabmsg = 'Обнаружены пустые поля';
        res.set('Content-Type', 'text/html');
        req.flash('error', req.session.cabmsg);
        res.status(204).redirect('/admin');
        return;
    }
    
    if (updImg != undefined) {
        fs.rename(updImg.path, `public/images/${id}.jpg`, (err) => {
            if (err) throw err;
        });
    }
    if(id != '' && name != '' && type != '' && info != '' && price != ''){
        const query = 'SELECT * FROM cakes WHERE cake_name = ? AND cake_id != ?';
        connection.query(query, [name, id], (error, results, fields) => {
            if (error) throw error;
                console.log('Results:', results);
            if (results.length > 0) {
                req.session.cabmsg = 'Такой торт уже есть';
                res.set('Content-Type', 'text/html');
                req.flash('error', req.session.cabmsg);
                res.status(500).redirect('/admin');
                return;
            }
            else{
                connection.query(`UPDATE cakes SET cake_name = "${name}", cake_type = "${type}", cake_info = "${info}", cake_price = ${price} WHERE cake_id = ${id}`, function(err, results){
                    if (err) {
                        console.error(err)
                        res.set('Content-Type', 'text/html');
                        req.session.cabmsg = 'Ошибка при обновлении данных';
                        req.flash('error', req.session.cabmsg);
                        res.status(500).redirect('/admin');
                        res.end();
                    } else {
                        console.log(results);
                        res.set('Content-Type', 'text/html');
                        req.session.cabmsg = 'Данные обновлены успешно';
                        req.flash('error', req.session.cabmsg);
                        res.status(200).redirect('/admin');
                        res.end();
                    }
                });
            }
        });
    }
});

app.post('/addField', upload.single('addImg'), function (req, res, next) {
    const {addName, addType, addInfo, addPrice} = req.body;
    const addImg = req.file;
    let latestCakeId;

    console.log(addName, " ", addType, " ", addInfo, " ", addPrice);
    if ((addImg == undefined) || (addName == '' || addType == '' || addInfo == '' || addPrice == '')){
        req.session.cabmsg = 'Обнаружены пустые поля';
        res.set('Content-Type', 'text/html');
        req.flash('error', req.session.cabmsg);
        res.status(500).redirect('/admin');
        return;
    }

    if(addName != ""){
        const query = 'SELECT * FROM cakes WHERE cake_name = ?';

        connection.query(query, [addName], (error, results, fields) => {
        if (error) throw error;
        console.log('Results:', results);
        if (results.length > 0) {
                req.session.cabmsg = 'Такой торт уже есть';
                res.set('Content-Type', 'text/html');
                req.flash('error', req.session.cabmsg);
                res.status(500).redirect('/admin');
                return;
            } else {
                // добавляем данные в базу данных
                connection.query(`INSERT INTO cakes (cake_id ,cake_name ,cake_info ,cake_price ,cake_type) VALUES (NULL , '${addName}', '${addInfo}', ${addPrice}, '${addType}');`, function(err, results){
                    if (err) {
                        console.error(err)
                        req.session.cabmsg = 'Ошибка при записи данных';
                        res.set('Content-Type', 'text/html');
                        req.flash('error', req.session.cabmsg);
                        res.status(500).redirect('/admin');
                        res.end();
                    } else {
                        connection.query(`SELECT cake_id FROM cakes ORDER BY cake_id DESC LIMIT 1;`, function(err, results, fields){
                            if (err) {
                                console.error(err)
                                req.session.cabmsg = 'Ошибка при записи данных';
                                res.set('Content-Type', 'text/html');
                                req.flash('error', req.session.cabmsg);
                                res.status(500).redirect('/admin');
                                res.end();
                            } else {
                                latestCakeId = results[0].cake_id;
                                console.log(`Latest cake ID: ${latestCakeId}`);
                                const basePath = 'public/images';
                                const fileName = `${latestCakeId}.jpg`;
                                const fullPath = path.join(basePath, fileName);
                                fs.rename(addImg.path, fullPath, (err) => {
                                    if (err) throw err;
                                });
                                console.log(results);
                                req.session.cabmsg = 'Данные записаны успешно';
                                res.set('Content-Type', 'text/html');
                                req.flash('error', req.session.cabmsg);
                                res.status(200).redirect('/admin');
                                res.end();
                            }
                        });
                    }
                });
            }
        });
    }
});

app.post('/delField', (req, res) => {
    const delId = req.body.delId;
    connection.query(`DELETE FROM cakes WHERE cake_id =?`, delId, (err, results) => {
        if (err) {
            console.log('error running query:', err);
            req.session.cabmsg = 'Ошибка при отправне запроса';
            res.set('Content-Type', 'text/html');
            req.flash('error', req.session.cabmsg);
            res.status(500).redirect('/admin');
        } else {
            const imgPath = path.join(__dirname, 'public', 'images', `${delId}.jpg`);
            fs.unlink(imgPath, (err) => {
                if (err) {
                    console.log('Ошибка при удалении картинки:', err);
                    req.session.cabmsg = 'Ошибка при удалении картинки';
                    res.set('Content-Type', 'text/html');
                    req.flash('error', req.session.cabmsg);
                    res.status(500).redirect('/admin');
                } else {
                    console.log(`Картинка удалена: ${imgPath}`);
                }
            });
            console.log(results);
            req.session.cabmsg = 'Данные удалены успешно';
            res.set('Content-Type', 'text/html');
            req.flash('error', req.session.cabmsg);
            res.status(200).redirect('/admin');
            res.end();
        }
    });
});

app.delete('/deletingSelected', (req, res) => {
    const { selectedIds } = req.body;
    console.log(selectedIds);
    connection.query(`DELETE FROM cakes WHERE cake_id IN (?)`, [selectedIds], (err, results) => {
    if (err) throw err;
    res.json({ message: 'Выбранные записи удалены' });
    });
});

app.get('/users', function(req, res){
    
    if(req.session.logginedin && req.session.role == "ADMIN") {
        connection.query('SELECT * FROM users', (err, rows, fields) => {
            if (err) throw err;
        res.set('Content-Type', 'text/html');
        res.status(200).render('users', { data: rows });
        });
    }
    else{
        res.set('Content-Type', 'text/html');
        res.status(401).redirect(cabinetUrl);
    }
});

app.post('/updUserForm', function (req, res, next) {
    const { id, updUsername, updEmail, updRole} = req.body;
    console.log(updUsername, " ", updEmail, " ", updRole);
    if (id == '' || updUsername == '' || updEmail == '' || updRole == ''){
        req.session.cabmsg = 'Обнаружены пустые поля';
        res.set('Content-Type', 'text/html');
        req.flash('error', req.session.cabmsg);
        res.status(500).redirect('/users');
        return;
    }
    if(id != '' && updUsername != '' && updEmail != '' && updRole != ''){
        const query = 'SELECT * FROM users WHERE login = ? AND id != ?';
        connection.query(query, [updUsername, id], (error, results, fields) => {
            if (error) throw error;
                console.log('Results:', results);
            if (results.length > 0) {
                req.session.cabmsg = 'Такой пользователь уже есть';
                res.set('Content-Type', 'text/html');
                req.flash('error', req.session.cabmsg);
                res.status(500).redirect('users');
                return;
            }
            else{
                connection.query(`UPDATE users SET login = "${updUsername}", email = "${updEmail}", role = "${updRole}" WHERE id = ${id}`, function(err, results){
                    if (err) {
                        console.error(err)
                        req.session.cabmsg = 'Ошибка при обновлении данных';
                        res.set('Content-Type', 'text/html');
                        req.flash('error', req.session.cabmsg);
                        res.status(500).redirect('/users');
                        res.end();
                    } else {
                        console.log(results);
                        req.session.cabmsg = 'Данные обновлены успешно';
                        res.set('Content-Type', 'text/html');
                        req.flash('error', req.session.cabmsg);
                        res.status(200).redirect('/users');
                        res.end();
                    }
                });
            }
        });
    }
});

app.post('/addUserForm', function (req, res, next) {
    const {addUsername, addPassword, addEmail, addRole} = req.body;

    console.log(addUsername, " ", addEmail, " ", addRole);
    if (addUsername == '' || addPassword == '' || addEmail == '' || addRole == ''){
        req.session.cabmsg = 'Обнаружены пустые поля';
        res.set('Content-Type', 'text/html');
        req.flash('error', req.session.cabmsg);
        res.status(500).redirect('/users');
        return;
    }

    if(addUsername != ""){
        const query = 'SELECT * FROM users WHERE login = ?';

        connection.query(query, [addUsername], (error, results, fields) => {
            if (error) throw error;
            console.log('Results:', results);
            if (results.length > 0) {
                req.session.cabmsg = 'Такой пользователь уже есть';
                res.set('Content-Type', 'text/html');
                req.flash('error', req.session.cabmsg);
                res.status(500).redirect('/users');
                return;
            } else {
                connection.query(`INSERT INTO users (id ,login, password, email ,role) VALUES (NULL , '${addUsername}', '${addPassword}', '${addEmail}', '${addRole}');`, function(err, results){
                    if (err) {
                        console.error(err)
                        req.session.cabmsg = 'Ошибка при записи данных';
                        res.set('Content-Type', 'text/html');
                        req.flash('error', req.session.cabmsg);
                        res.status(500).redirect('/users');
                        res.end();
                    } else {
                        req.session.cabmsg = 'Данные записаны успешно';
                        res.set('Content-Type', 'text/html');
                        req.flash('error', req.session.cabmsg);
                        res.status(200).redirect('/users');
                        res.end();
                    }
                });
            }
        });
    }
});

app.post('/YaPianiy', function (req, res, next) {
    const {callback_email, name, callback_comment} = req.body;
    const uid = req.session.userid;

    console.log(callback_email, " ", name, " ", callback_comment);
    if (callback_email == '' || name == '' || callback_comment == ''){
        req.session.cabmsg = 'Обнаружены пустые поля';
        res.set('Content-Type', 'text/html');
        req.flash('error', req.session.cabmsg);
        res.status(500).redirect('/contacts');
        return;
    }

    connection.query(`INSERT INTO booba (id_user , email, name, comment) VALUES ('${uid}', '${callback_email}', '${name}', '${callback_comment}');`, function(err, results){
        if (err) {
            console.error(err)
            req.session.cabmsg = 'Ошибка при записи данных';
            res.set('Content-Type', 'text/html');
            req.flash('error', req.session.cabmsg);
            res.status(500).redirect('/contacts');
            res.end();
        } else {
            req.session.cabmsg = 'Данные записаны успешно';
            res.set('Content-Type', 'text/html');
            req.flash('error', req.session.cabmsg);
            res.status(200).redirect('/contacts');
            res.end();
        }
    });
});

app.post('/delUserField', (req, res) => {
    const delId = req.body.delId;
    connection.query(`DELETE FROM users WHERE id =?`, delId, (err, results) => {
        if (err) {
            console.error('Ошибка при отправке запроса:', err);
            req.session.cabmsg = 'Ошибка при отправке запроса';
            res.set('Content-Type', 'text/html');
            req.flash('error', req.session.cabmsg);
            res.status(500).redirect('/users');
        } else {
            console.log(results);
            req.session.cabmsg = 'Данные удалены успешно';
            res.set('Content-Type', 'text/html');
            req.flash('error', req.session.cabmsg);
            res.status(200).redirect('/users');
            res.end();
        }
    });
});

app.get('/cabinet', function(req, res){
    res.set('Content-Type', 'text/html');
    res.status(200);
    res.render('cabinet', {
        logginedin: req.session.logginedin,
        role: req.session.role,
        msg: req.session.loginmsg,
    });
});

app.post('/add-to-cart', (req, res) => {
    const cakeId = req.body.cakeId;
    const quantity = req.body.quantity;
    if (!req.session.cart) {
    req.session.cart = [];
    }
    const index = req.session.cart.findIndex((item) => item.cake_id === cakeId);
    if (index === -1) {
    req.session.cart.push({ cake_id: cakeId, quantity: quantity });
    } else {
        q1 = parseInt(req.session.cart[index].quantity)
        q2 = parseInt(quantity);
        q3 = q1 + q2;
        req.session.cart[index].quantity = String(q3);
        console.log(q1, " ", q2, " ", q3)
    }
    res.send('Товар добавлен в корзину');
});

app.post('/remove-from-cart', (req, res) => {
    const cakeId = req.body.cakeId;
    const quantityToRemove = req.body.quantity;
    console.log(`Removing ${quantityToRemove} units of cake ${cakeId}`);
    if (!req.session.cart) {
        req.session.cart = [];
    }
    const index = req.session.cart.findIndex((item) => item.cake_id === cakeId);
    console.log(index);
    if (index!== -1) {
        const item = req.session.cart[index];
        if (item.quantity <= quantityToRemove) {
            req.session.cart.splice(index, 1);
        } else {
            item.quantity -= quantityToRemove;
        }
    }
    console.log(req.session.cart);
    res.send('Товар убран из корзины');
});

app.post('/confirm-cart', (req, res) => {
    const cart = req.session.cart;
    const query = 'INSERT INTO cart (cake_id, quantity, user_id) VALUES ?';
    const values = cart.map((item) => [item.cake_id, item.quantity, req.session.userid]);
    connection.query(query, [values], (err, results) => {
    if (err) {
        console.error(err);
        return;
    }
    req.session.cart = [];
    res.send('Заказ одобрен!');
    });
});

app.get('/cart-preview', (req, res) => {
    const cart = req.session.cart;
    if (!cart || cart.length === 0 || cart.some((item) =>!item.cake_id ||!item.quantity)) {
        let data = [];
        res.json(data);
        return;
    }
    const query = 'SELECT * FROM cakes WHERE cake_id IN (?)';
    connection.query(query, [cart.map((item) => item.cake_id)], (err, rows) => {
        if (err) {
            console.error(err);
            res.json([]);
            return;
        }
        const data = rows.map((row) => {
            const item = cart.find((cartItem) => cartItem.cake_id == row.cake_id);
            if (item) {
                return { 
                    cake_id: row.cake_id,
                    cake_name: row.cake_name, 
                    cake_price: row.cake_price, 
                    quantity: item.quantity };
            } else {
                return null;
            }
        }).filter((item) => item!== null);
        res.json(data);
    });
});

app.get('/orders', (req, res) => {
    if(req.session.logginedin) {
        const userId = req.session.userid;
        const query = 'SELECT c.cake_id, c.cake_name, c.cake_price, cart.quantity FROM cart INNER JOIN cakes c ON cart.cake_id = c.cake_id WHERE cart.user_id =?';
        connection.query(query, [userId], (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(rows);
        res.set('Content-Type', 'text/html');
        res.status(200).render('orders', { cart: rows });
        });
    }
    else{
        res.set('Content-Type', 'text/html');
        res.status(401).redirect(cabinetUrl);
    }
});

app.post('/cake-info', (req, res) => {
    if (req.session.logginedin) {
        const cakeId = req.body.cakeId;
        const query = 'SELECT * FROM cakes WHERE cake_id =?';
        connection.query(query, [cakeId], (err, rows) => {
            if (err) {
                console.error(err);
                res.status(500).send({ message: 'Error retrieving cake information' });
            } else {
                const cakeInfo = rows[0];
                res.json(cakeInfo);
            }
        });
    } else {
        res.status(401).redirect(cabinetUrl);
    }
});



app.use(function(req, res) {
    res.set('Content-Type', 'text/html');
    res.status(404).render('404');;
});

app.listen(3000, function() {
    console.log(`Приложение было запущено`);
});

// connection.query("SELECT * FROM users WHERE login = ? AND password = ?", ["user", "user"],
//   function(err, results, fields) {
//     console.log(err);
//     console.log(results); // данные
//     console.log(fields); // мета-данные полей 
// });
// connection.end();


