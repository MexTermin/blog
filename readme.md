# DB config
##### TABLES: 

    create table post (post_id int auto_increment primary key, usuario int not null, titulo varchar(70) not null, descripcion text, img varchar(255)); 

    create table comentarios(id int auto_increment primary key, post_id int not null, user_id int not null, descripcion text not null);

    create table user(id int auto_increment primary key, nombre varchar(50) not null,apellidos varchar(50), email varchar(50) unique not null, password varchar(50)  not null, descricion text, img varchar(50));

