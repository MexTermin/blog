# DB config
##### TABLES: 

    create table post (post_id int auto_increment primary key, usuario int not null, titulo varchar(70) not null, descripcion text, img varchar(255)); 

    create table comentarios(id int auto_increment primary key, post_id int not null, user_id int not null, descripcion text not null);

    CREATE TABLE `<db name/>`.`user` ( `id` INT NOT NULL AUTO_INCREMENT , `nombre` VARCHAR(50) NOT NULL , `apellidos` VARCHAR(50) NOT NULL , `email` VARCHAR(50) NOT NULL , `password` VARCHAR(50) NOT NULL , `descricion` TEXT NOT NULL , `img` VARCHAR(50) NOT NULL , PRIMARY KEY (`id`), UNIQUE (`email`))
