const express = require("express");

const router = express.Router();

const db = require("../db");


// ========================================
// GET ALL BOOKINGS
// ========================================

router.get("/", async (req, res) => {

    try {

        const [rows] = await db.query(`
            SELECT *
            FROM bookings
            ORDER BY created_at DESC
        `);

        res.json({
            success: true,
            data: rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch bookings"
        });
    }
});


// ========================================
// GET SINGLE BOOKING
// ========================================

router.get("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await db.query(
            "SELECT * FROM bookings WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch booking"
        });
    }
});


// ========================================
// CREATE BOOKING
// ========================================

router.post("/", async (req, res) => {

    try {

        const {
            customer_name,
            email,
            phone,
            destination,
            package_name,
            travel_date,
            travelers,
            total_amount
        } = req.body;


        // VALIDATION

        if (
            !customer_name ||
            !email ||
            !phone ||
            !destination ||
            !package_name ||
            !travel_date ||
            !travelers ||
            !total_amount
        ) {

            return res.status(400).json({
                success: false,
                message: "All booking fields are required"
            });
        }


        if (travelers < 1) {

            return res.status(400).json({
                success: false,
                message: "Number of travelers must be at least 1"
            });
        }


        if (total_amount <= 0) {

            return res.status(400).json({
                success: false,
                message: "Invalid total amount"
            });
        }


        // GENERATE BOOKING ID

        const bookingId =
            "TE" +
            Date.now().toString().slice(-10);


        // INSERT BOOKING

        const [result] = await db.query(`
            INSERT INTO bookings
            (
                booking_id,
                customer_name,
                email,
                phone,
                destination,
                package_name,
                travel_date,
                travelers,
                total_amount,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [

            bookingId,
            customer_name,
            email,
            phone,
            destination,
            package_name,
            travel_date,
            travelers,
            total_amount,
            "Confirmed"

        ]);


        res.status(201).json({

            success: true,

            message: "Booking created successfully",

            data: {

                id: result.insertId,

                booking_id: bookingId,

                customer_name,

                destination,

                package_name,

                travel_date,

                travelers,

                total_amount,

                status: "Confirmed"
            }

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to create booking"

        });
    }
});


// ========================================
// DELETE BOOKING
// ========================================

router.delete("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM bookings WHERE id = ?",
            [id]
        );


        if (result.affectedRows === 0) {

            return res.status(404).json({

                success: false,

                message: "Booking not found"

            });
        }


        res.json({

            success: true,

            message: "Booking deleted successfully"

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to delete booking"

        });
    }
});


module.exports = router;