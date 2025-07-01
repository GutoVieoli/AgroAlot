CREATE DATABASE IF NOT EXISTS agroAlot CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE agroAlot;

CREATE TABLE IF NOT EXISTS usuarios (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    nome VARCHAR(64) NOT NULL,
    email VARCHAR(64) NOT NULL UNIQUE,
    senha VARCHAR(128) NOT NULL,
    salt VARCHAR(64) NOT NULL  
);

CREATE TABLE IF NOT EXISTS propriedades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    localizacao VARCHAR(100) NOT NULL,
    area_total DECIMAL(10, 2) DEFAULT 0,
    id_usuario VARCHAR(64) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS talhoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(128) NOT NULL,
    cultura VARCHAR(255) NOT NULL,
    area DECIMAL(10, 2) NOT NULL,
    geojson_data JSON NOT NULL,
    id_propriedade INT NOT NULL,
    FOREIGN KEY (id_propriedade) REFERENCES propriedades(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ndvi (
    id INT PRIMARY KEY AUTO_INCREMENT,
    data DATE NOT NULL,
    valor DECIMAL(4, 2) NOT NULL,
    id_talhao INT,
    cloud_percentage DECIMAL(4, 2),
    FOREIGN KEY (id_talhao) REFERENCES talhoes(id)
);


DELIMITER //
CREATE TRIGGER atualiza_area_total_apos_insert
AFTER INSERT ON talhoes
FOR EACH ROW
BEGIN
    UPDATE propriedades
    SET area_total = area_total + NEW.area
    WHERE id = NEW.id_propriedade;
END;

CREATE TRIGGER atualiza_area_total_apos_delete
AFTER DELETE ON talhoes
FOR EACH ROW
BEGIN
    UPDATE propriedades
    SET area_total = area_total - OLD.area
    WHERE id = OLD.id_propriedade;
END;

CREATE TRIGGER atualiza_area_total_apos_update
AFTER UPDATE ON talhoes
FOR EACH ROW
BEGIN
    UPDATE propriedades
    SET area_total = area_total - OLD.area + NEW.area
    WHERE id = NEW.id_propriedade;
END;

//

DELIMITER ;