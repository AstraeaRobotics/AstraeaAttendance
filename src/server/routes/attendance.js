import express from "express";

const router = express.Router();

router.post("/attendance", (req, res) => {
    console.log(req.body);

    res.json({
        success: true
    });
});

export default router;