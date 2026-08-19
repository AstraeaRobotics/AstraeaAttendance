import express from "express";

const router = express.Router();

router.post("/register", (req, res) => {
    console.log(req.body);

    res.json({
        success: true
    });
});

export default router;