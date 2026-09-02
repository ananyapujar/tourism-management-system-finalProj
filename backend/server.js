const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const destinationRoutes =
    require("./routes/destinationRoutes");

const packageRoutes =
    require("./routes/packageRoutes");

const bookingRoutes =
    require("./routes/bookingRoutes");


const app = express();

const PORT = process.env.PORT || 5000;


// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());

app.use(express.json());


// ========================================
// BASIC TEST ROUTE
// ========================================

app.get("/api", (req, res) => {

    res.json({

        success: true,

        message: "TravelEase API is running successfully"

    });

});


// ========================================
// DESTINATION ROUTES
// ========================================

app.use(
    "/api/destinations",
    destinationRoutes
);


// ========================================
// PACKAGE ROUTES
// ========================================

app.use(
    "/api/packages",
    packageRoutes
);


// ========================================
// BOOKING ROUTES
// ========================================

app.use(
    "/api/bookings",
    bookingRoutes
);


// ========================================
// STATISTICS
// ========================================

app.get("/api/statistics", async (req, res) => {

    try {

        const [bookingResult] = await db.query(`
            SELECT COUNT(*) AS total_bookings
            FROM bookings
        `);


        const [revenueResult] = await db.query(`
            SELECT
                COALESCE(
                    SUM(total_amount),
                    0
                ) AS total_revenue
            FROM bookings
            WHERE status != 'Cancelled'
        `);


        const [destinationResult] = await db.query(`
            SELECT COUNT(*) AS total_destinations
            FROM destinations
        `);


        const [packageResult] = await db.query(`
            SELECT COUNT(*) AS total_packages
            FROM packages
        `);


        res.json({

            success: true,

            data: {

                total_bookings:
                    bookingResult[0].total_bookings,

                total_revenue:
                    revenueResult[0].total_revenue,

                total_destinations:
                    destinationResult[0].total_destinations,

                total_packages:
                    packageResult[0].total_packages

            }

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to fetch statistics"

        });
    }
});


// ========================================
// 404 HANDLER
// ========================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "API endpoint not found"

    });

});


// ========================================
// ERROR HANDLER
// ========================================

app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({

        success: false,

        message: "Internal server error"

    });

});


// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {

    console.log(
        `🚀 TravelEase backend running on port ${PORT}`
    );

});