CREATE TABLE users(
	id INT UNSIGNED PRIMARY KEY,
	username VARCHAR(25),
	email VARCHAR(200),
	access_token VARCHAR(30),
	refresh_token VARCHAR(50),
	id_token VARCHAR(1000)
);

CREATE TABLE commands(
	userid INT UNSIGNED,
	command VARCHAR(100) NOT NULL,
	result VARCHAR(500) NOT NULL,
	PRIMARY KEY (userid,command),
	CONSTRAINT user_id
		FOREIGN KEY (userid)
		REFERENCES users(id)
		ON UPDATE CASCADE
		ON DELETE CASCADE 
);

CREATE TABLE sessions(
    id INT UNSIGNED,
    refresh_token VARCHAR(300),
    PRIMARY KEY (id,refresh_token),
    CONSTRAINT u_id
    	FOREIGN KEY (id)
    	REFERENCES users(id)
    	ON UPDATE CASCADE
    	ON DELETE CASCADE
)