const express = require("express");

const router = express.Router();

const db = require("../db");


// GET ALL PACKAGES
router.get("/", async (req, res) => {

    try {

        const [rows] = await db.query(`
            SELECT
                p.id,
                p.name,
                p.description,
                p.duration,
                p.price,
                p.hotel_included,
                p.food_included,
                p.sightseeing_included,
                p.image,
                d.name AS destination
            FROM packages p
            INNER JOIN destinations d
                ON p.destination_id = d.id
            ORDER BY p.id ASC
        `);

        res.json({
            success: true,
            data: rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch packages"
        });
    }
});


// GET ONE PACKAGE
router.get("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await db.query(`
            SELECT
                p.id,
                p.name,
                p.description,
                p.duration,
                p.price,
                p.hotel_included,
                p.food_included,
                p.sightseeing_included,
                p.image,
                d.name AS destination
            FROM packages p
            INNER JOIN destinations d
                ON p.destination_id = d.id
            WHERE p.id = ?
        `, [id]);

        if (rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Package not found"
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
            message: "Failed to fetch package"
        });
    }
});


module.exports = router;