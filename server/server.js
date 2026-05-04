const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/orders-routes");
const adminUsersRouter = require("./routes/admin/users-routes");
const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const commonFeatureRouter = require("./routes/common/feature-routes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const DEFAULT_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
];
const clientBaseUrl = (process.env.CLIENT_BASE_URL || "").trim();

const envAllowedOrigins = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = [
    ...new Set(
        [...DEFAULT_ALLOWED_ORIGINS, ...envAllowedOrigins, clientBaseUrl].filter(Boolean)
    ),
];

mongoose.connect(process.env.MONGO_URI).then(() => console.log("Connected to MongoDB")).catch((err) => console.log(err));

app.use(cors({
    origin: (origin, callback) => {
        // Allow non-browser tools (curl/Postman) that do not send Origin header.
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Expires", "Pragma", "Set-Cookie"],
}));

app.use(express.json());
app.use(cookieParser());
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use((req, res, next) => {
    const start = Date.now();
    const requestTag = `[HTTP] ${req.method} ${req.originalUrl}`;
    console.log(`${requestTag} - started`);

    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(`${requestTag} - ${res.statusCode} (${duration}ms)`);
    });

    next();
});

app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/admin/users", adminUsersRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/common/feature", commonFeatureRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
