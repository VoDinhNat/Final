const express = require("express");
const router = express.Router();
const {
    addFeatureImage,
    getFeatureImages,
    updateFeatureImage,
    deleteFeatureImage,
} = require("../../controllers/common/feature-controller");

router.post("/add", addFeatureImage);
router.get("/get", getFeatureImages);
router.delete("/delete/:id", deleteFeatureImage);

module.exports = router;
