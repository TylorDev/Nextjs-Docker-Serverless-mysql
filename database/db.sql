CREATE TABLE products (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(255) NOT NULL,    
    description VARCHAR(255),                 
    price DECIMAL(10, 2) NOT NULL,     
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

ALTER TABLE products ADD COLUMN image VARCHAR(200) AFTER description;
