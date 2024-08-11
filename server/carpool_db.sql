CREATE DATABASE IF NOT EXISTS  carpool_db;
use carpool_db;
DROP TABLE IF EXISTS passwords;
DROP TABLE IF EXISTS passengers;
DROP TABLE IF EXISTS stops;
DROP TABLE IF EXISTS travel_requests;
DROP TABLE IF EXISTS rides;
DROP TABLE IF EXISTS Locations;
DROP TABLE IF EXISTS users;


CREATE TABLE Users (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    email VARCHAR(100) not null,
    phone VARCHAR(50),
    birthDate date,
    picture varchar(100),
    gender ENUM('Male', 'Female') Not null
);
CREATE TABLE passwords (
    userID INT ,
    password VARCHAR(255) not null,
    PRIMARY KEY(userID),
    FOREIGN KEY (userID) REFERENCES users(userID)
);
CREATE TABLE Locations (
    locationID INT AUTO_INCREMENT PRIMARY KEY,
    locationName VARCHAR(100),
    lat DOUBLE,
    lon DOUBLE
);
CREATE TABLE Rides (
    rideID INT AUTO_INCREMENT PRIMARY KEY,
    driverID INT,
    passengers INT CHECK (passengers <= 4),
    seats INT,
    sourceID INT,
    destinationID INT,
    price DECIMAL(10, 2),
    date DATE,
    time TIME,
    driverRemark TEXT,
    likes INT,
    dislikes INT,
    status ENUM('Active', 'NotActive') DEFAULT "Active",
    FOREIGN KEY (driverID) REFERENCES Users(userID),
    FOREIGN KEY (sourceID) REFERENCES Locations(locationID),
    FOREIGN KEY (destinationID) REFERENCES Locations(locationID)
);

-- יצירת טבלת עצירות
CREATE TABLE Stops (
    stopID INT AUTO_INCREMENT PRIMARY KEY,
    rideID INT,
    locationID INT,
    FOREIGN KEY (rideID) REFERENCES Rides(rideID),
    FOREIGN KEY (locationID) REFERENCES Locations(locationID)
);
CREATE TABLE travel_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,  
    userID INT NOT NULL,             
    rideID INT NOT NULL,
    stopID INT,
    status ENUM('waiting', 'confirmed', 'unConfirmed') NOT NULL,
    FOREIGN KEY (userID) REFERENCES users(userID),
	FOREIGN KEY (rideID) REFERENCES rides(rideID)
);

CREATE TABLE passengers (
    passengerID INT AUTO_INCREMENT PRIMARY KEY,
    rideID INT,
    userID INT,
    stopID INT,
    FOREIGN KEY (rideID) REFERENCES rides(rideID),
    FOREIGN KEY (userID) REFERENCES users(userID),
    FOREIGN KEY (stopID) REFERENCES stops(stopID)
);
 
-- הכנסת נתוני דוגמה לטבלת משתמשים
INSERT INTO Users (firstName, lastName, email, phone, birthDate, gender) VALUES
-- ('Chani', 'Levy', 'chani86370@gmail.com', '0583286370', '1990-01-01', 'Male'),
-- ('Efrat', 'Klain', 'efratk354@gmail.com', '0527615505', '1985-05-15', 'Female'),
('Yosef', 'Cohen', 'yosef.cohen@gmail.com', '0541234567', '1988-02-10', 'Male'),
('Miriam', 'Rosenberg', 'miriam.rosenberg@gmail.com', '0527654321', '1991-03-22', 'Female'),
('David', 'Levi', 'david.levi@gmail.com', '0589876543', '1986-07-12', 'Male'),
('Sarah', 'Goldstein', 'sarah.goldstein@gmail.com', '0501239876', '1994-08-30', 'Female'),
('Eli', 'Katz', 'eli.katz@gmail.com', '0534567890', '1983-11-14', 'Male'),
('Rachel', 'Mizrahi', 'rachel.mizrahi@gmail.com', '0529871234', '1990-04-17', 'Female'),
('Shmuel', 'Ben-David', 'shmuel.ben-david@gmail.com', '0546543210', '1989-05-05', 'Male');

-- הכנסת נתוני דוגמה לטבלת סיסמאות
INSERT INTO passwords (userID, password) VALUES
-- (1, '!Qaz2wsx'),
-- (2, '!Qaz2wsx'),
(3, '!Qaz2wsx'),
(4, '!Qaz2wsx'),
(5, '!Qaz2wsx'),
(6, '!Qaz2wsx'),
(7, '!Qaz2wsx'),
(8, '!Qaz2wsx'),
(9, '!Qaz2wsx');
-- הכנסת נתוני דוגמה לטבלת מיקומים
INSERT INTO Locations (locationName, lat, lon) VALUES
( 'הרב שאולזון, ירושלים ', 31.7814527, 35.1740703),
( 'ברכת אברהם, ירושלים ', '31.8118427', '35.2174662'),
( 'הרב כהנמן, ירושלים ', '31.8089012', '35.2208052'),
( 'מירסקי יצחק, ירושלים ', '31.8207568', '35.1920001'),
( 'המשוררת זלדה, ירושלים ', '31.8219642', '35.1854468'),
('יפו, ירושלים ', '31.7845614', '35.2152014'),
( 'ההגנה, בת ים ', '32.022941', '34.7519663'),
( 'ההגנה, לוד ', '31.9658403', '34.8784593'),
( 'חזון דוד, מודיעין עילית ', '31.9254312', '35.0405512');







-- הכנסת נתוני דוגמה לטבלת נסיעות
INSERT INTO Rides (driverID, passengers, seats, sourceID, destinationID, price, date, time, driverRemark, likes, dislikes) VALUES
(1, 3, 4, 1, 2, 10.00, '2023-01-01', '08:00:00', '', 0, 5),
(1, 2, 4, 2, 3, 12.50, '2023-02-01', '08:00:00', '', 0, 0),
(1, 1, 4, 3, 4, 15.00, '2023-03-01', '08:00:00', '', 1, 0),
(1, 3, 4, 4, 5, 20.00, '2023-04-01', '08:00:00', '', 0, 9),
(1, 2, 4, 5, 6, 25.00, '2023-05-01', '08:00:00', '', 0, 0),
(1, 1, 4, 6, 7, 30.00, '2023-06-01', '08:00:00', '', 0, 0),
(1, 3, 4, 7, 8, 35.00, '2023-07-01', '08:00:00', '', 0, 7),
(1, 2, 4, 8, 9, 40.00, '2023-08-01', '08:00:00', '',8, 0),
(1, 1, 4, 9, 1, 45.00, '2023-09-01', '08:00:00', '', 0, 0),
(1, 3, 4, 1, 3, 50.00, '2023-10-01', '08:00:00', '',1, 0),



(2, 3, 4, 2, 3, 10.00, '2023-01-01', '08:00:00', '', 3, 0),
(2, 2, 4, 3, 4, 12.50, '2023-02-01', '08:00:00', '', 0, 0),
(2, 1, 4, 4, 5, 15.00, '2023-03-01', '08:00:00', '', 0, 0),
(2, 3, 4, 5, 6, 20.00, '2023-04-01', '08:00:00', '', 0, 0),
(2,2, 4, 6, 7, 25.00, '2023-05-01', '08:00:00', '', 0, 4),
(2, 1, 4, 7, 8, 30.00, '2023-06-01', '08:00:00', '', 0, 0),
(2, 3, 4, 8, 9, 35.00, '2023-07-01', '08:00:00', '', 0, 0),
(2, 2, 4, 9, 1, 40.00, '2023-08-01', '08:00:00', '', 0, 0),
(2, 1, 4, 1, 2, 45.00, '2023-09-01', '08:00:00', '', 4, 0),
(2, 3, 4, 2, 3, 50.00, '2023-10-01', '08:00:00', '', 0, 0),




(3, 1, 4, 1, 2, 10.00, '2022-05-01', '08:00:00', '', 0, 0),
(4, 1, 4, 2, 3, 12.50, '2022-06-01', '08:00:00', '', 0, 0),
(5, 1, 4, 3, 4, 15.00, '2022-07-01', '08:00:00', '', 0, 4),
(6, 1, 4, 4, 5, 20.00, '2022-08-01', '08:00:00', '', 0, 0),
(7, 1, 4, 5, 6, 25.00, '2022-09-01', '08:00:00', '',4, 0),
(8, 1, 4, 6, 7, 30.00, '2022-10-01', '08:00:00', '', 0, 0),
(9, 1, 4, 7, 8, 35.00, '2022-11-01', '08:00:00', '', 0, 0),
(3, 1, 4, 8, 9, 40.00, '2022-12-01', '08:00:00', '', 0, 5),
(4, 1, 4, 9, 1, 45.00, '2023-01-01', '08:00:00', '', 0, 0),
(5, 1, 4, 1, 3, 50.00, '2023-02-01', '08:00:00', '', 6, 0),



(1, 1, 4, 1, 2, 10.00, '2024-07-11', '08:00:00', '', 0, 0),
(1, 2, 4, 3, 4, 12.50, '2024-07-11', '10:00:00', '', 0, 0),
(2, 1, 4, 5, 6, 15.00, '2024-07-11', '12:00:00', '', 0, 0),
(2, 0, 4, 7, 8, 20.00, '2024-07-11', '14:00:00', '', 0, 0),
(1, 1, 4, 9, 1, 25.00, '2024-07-11', '16:00:00', '', 0, 0),
(2, 3, 4, 2, 3, 30.00, '2024-07-11', '08:00:00', '', 0, 0),
(1, 2, 4, 4, 5, 35.00, '2024-07-11', '10:00:00', '', 0, 0),
(1, 1, 4, 6, 7, 40.00, '2024-07-11', '12:00:00', '', 0, 0),
(2, 2, 4, 8, 9, 45.00, '2024-07-11', '14:00:00', '', 0, 0),
(2, 2, 4, 1, 2, 50.00, '2024-07-11', '16:00:00', '', 0, 0),
(1, 1, 4, 3, 4, 55.00, '2024-07-12', '08:00:00', '', 0, 0),
(1, 3, 4, 5, 6, 60.00, '2024-07-12', '10:00:00', '', 0, 0),
(2, 2, 4, 7, 8, 65.00, '2024-07-12', '12:00:00', '', 0, 0),
(2, 1, 4, 9, 1, 70.00, '2024-07-12', '14:00:00', '', 0, 0),
(1, 2, 4, 2, 3, 75.00, '2024-07-12', '16:00:00', '', 0, 0);

-- הכנסת נתוני דוגמה לטבלת עצירות
INSERT INTO Stops (rideID, locationID) VALUES
  (41,2),
  (41,5),
  (38,3),
  (44,2),
  (44,3);
  
-- הכנסת נתוני דוגמה לטבלת נוסעים
INSERT INTO passengers (rideID, userID) VALUES
(21, 1),
(22, 1),
(23, 1),
(24,1),
(25, 1),
(26, 1),
(27, 1),
(28, 1),
(29, 1),
(30, 1);
INSERT INTO Rides (driverID, passengers, seats, sourceID, destinationID, price, date, time, driverRemark, likes, dislikes) VALUES
(2,3,4,1,2,10.00,'2023-01-01', '08:00:00', '', 0, 5);
INSERT INTO passengers (rideID, userID) VALUES
(46,3);

-- UPDATE passwords
-- SET password = SHA2(CONCAT(passwod, 'salt_value'), 256)
-- WHERE userID = your_userID;
