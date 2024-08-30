CREATE DATABASE IF NOT EXISTS agroAlot CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE agroAlot;

CREATE TABLE IF NOT EXISTS usuarios (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    nome VARCHAR(64) NOT NULL,
    email VARCHAR(64) NOT NULL UNIQUE,
    senha VARCHAR(128) NOT NULL,
    salt VARCHAR(64) NOT NULL  -- coisa de segurança
);

CREATE TABLE IF NOT EXISTS propriedades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(128) NOT NULL,
    uf VARCHAR(2),
    id_usuario VARCHAR(64),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS talhoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    cultura VARCHAR(255) NOT NULL,
    area DECIMAL(10, 2) NOT NULL,
    id_propriedade INT,
    FOREIGN KEY (id_propriedade) REFERENCES propriedades(id)
);

CREATE TABLE IF NOT EXISTS coordenadas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    ordem INT NOT NULL,
    id_talhao INT,
    FOREIGN KEY (id_talhao) REFERENCES talhoes(id)
);

CREATE TABLE IF NOT EXISTS ndvi (
    id INT PRIMARY KEY AUTO_INCREMENT,
    data DATE NOT NULL,
    valor DECIMAL(4, 2) NOT NULL,
    id_talhao INT,
    FOREIGN KEY (id_talhao) REFERENCES talhoes(id)
);
