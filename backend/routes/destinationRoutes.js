const express = require("express");

const router = express.Router();

const db = require("../db");


// GET ALL DESTINATIONS
router.get("/", async (req, res) => {

    try {

        const [rows] = await db.query(
            "SELECT * FROM destinations ORDER BY id ASC"
        );

        res.json({
            success: true,
            data: rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch destinations"
        });
    }
});


// GET ONE DESTINATION
router.get("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await db.query(
            "SELECT * FROM destinations WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Destination not found"
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
            message: "Failed to fetch destination"
        });
    }
});


module.exports = router;