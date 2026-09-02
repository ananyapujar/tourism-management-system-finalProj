CREATE DATABASE IF NOT EXISTS travelease_db;

USE travelease_db;


-- ============================================
-- DESTINATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS destinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    rating DECIMAL(2,1) DEFAULT 4.5,
    starting_price DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- PACKAGES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    destination_id INT NOT NULL,
    description TEXT,
    duration VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    hotel_included BOOLEAN DEFAULT TRUE,
    food_included BOOLEAN DEFAULT TRUE,
    sightseeing_included BOOLEAN DEFAULT TRUE,
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_package_destination
        FOREIGN KEY (destination_id)
        REFERENCES destinations(id)
        ON DELETE CASCADE
);


-- ============================================
-- BOOKINGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,

    booking_id VARCHAR(30) NOT NULL UNIQUE,

    customer_name VARCHAR(150) NOT NULL,

    email VARCHAR(150) NOT NULL,

    phone VARCHAR(20) NOT NULL,

    destination VARCHAR(100) NOT NULL,

    package_name VARCHAR(150) NOT NULL,

    travel_date DATE NOT NULL,

    travelers INT NOT NULL,

    total_amount DECIMAL(12,2) NOT NULL,

    status ENUM(
        'Pending',
        'Confirmed',
        'Cancelled'
    ) DEFAULT 'Confirmed',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- SAMPLE DESTINATIONS
-- ============================================

INSERT INTO destinations
(name, country, description, image, rating, starting_price)
VALUES
(
    'Goa',
    'India',
    'Relax on beautiful beaches, enjoy water sports and explore the vibrant coastal culture of Goa.',
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2',
    4.9,
    15000
),
(
    'Manali',
    'India',
    'Explore mountains, valleys, waterfalls and adventure activities in beautiful Manali.',
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23',
    4.8,
    18000
),
(
    'Paris',
    'France',
    'Experience iconic landmarks, museums, architecture and romantic city views.',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    4.9,
    85000
),
(
    'Dubai',
    'UAE',
    'Enjoy luxury shopping, modern architecture, desert adventures and spectacular attractions.',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c',
    4.8,
    65000
),
(
    'Bali',
    'Indonesia',
    'Discover tropical beaches, temples, resorts and beautiful natural landscapes.',
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
    4.9,
    55000
),
(
    'London',
    'United Kingdom',
    'Explore historic landmarks, museums, shopping areas and famous London attractions.',
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
    4.8,
    78000
);


-- ============================================
-- SAMPLE PACKAGES
-- ============================================

INSERT INTO packages
(
    name,
    destination_id,
    description,
    duration,
    price,
    hotel_included,
    food_included,
    sightseeing_included,
    image
)
VALUES
(
    'Goa Beach Escape',
    1,
    'A relaxing beach holiday covering the best attractions of Goa.',
    '4 Days / 3 Nights',
    15000,
    TRUE,
    TRUE,
    TRUE,
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2'
),
(
    'Manali Adventure',
    2,
    'Mountain adventure package with sightseeing and outdoor activities.',
    '5 Days / 4 Nights',
    18000,
    TRUE,
    TRUE,
    TRUE,
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23'
),
(
    'Paris Experience',
    3,
    'Explore the major attractions of the beautiful city of Paris.',
    '6 Days / 5 Nights',
    85000,
    TRUE,
    TRUE,
    TRUE,
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34'
),
(
    'Dubai Luxury',
    4,
    'A premium Dubai experience covering city attractions and desert activities.',
    '5 Days / 4 Nights',
    65000,
    TRUE,
    TRUE,
    TRUE,
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c'
),
(
    'Bali Paradise',
    5,
    'Tropical Bali holiday featuring beaches, temples and cultural experiences.',
    '5 Days / 4 Nights',
    55000,
    TRUE,
    TRUE,
    TRUE,
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4'
),
(
    'London Explorer',
    6,
    'Discover famous London landmarks, museums and cultural attractions.',
    '6 Days / 5 Nights',
    78000,
    TRUE,
    TRUE,
    TRUE,
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad'
);