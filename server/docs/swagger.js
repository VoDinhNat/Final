const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Green Market Project API",
    version: "1.0.0",
    description: "API documentation for Green Market project backend",
  },
  servers: [
    {
      url: "https://final-xlvp.onrender.com",
      description: "Local development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  tags: [
    { name: "Auth" },
    { name: "Admin Products" },
    { name: "Admin Orders" },
    { name: "Admin Users" },
    { name: "Shop Products" },
    { name: "Shop Cart" },
    { name: "Shop Address" },
    { name: "Shop Order" },
    { name: "Shop Search" },
    { name: "Shop Review" },
    { name: "Common Feature" },
  ],
  paths: {
    "/api/auth/register": { post: { tags: ["Auth"], summary: "Register user", responses: { 200: { description: "OK" } } } },
    "/api/auth/login": { post: { tags: ["Auth"], summary: "Login user", responses: { 200: { description: "OK" } } } },
    "/api/auth/logout": { post: { tags: ["Auth"], summary: "Logout user", responses: { 200: { description: "OK" } } } },
    "/api/auth/check-auth": { get: { tags: ["Auth"], summary: "Check authenticated user", security: [{ bearerAuth: [] }], responses: { 200: { description: "OK" } } } },

    "/api/admin/products/upload-image": { post: { tags: ["Admin Products"], summary: "Upload product image", responses: { 200: { description: "OK" } } } },
    "/api/admin/products/add": { post: { tags: ["Admin Products"], summary: "Add product", responses: { 200: { description: "OK" } } } },
    "/api/admin/products/edit/{id}": { put: { tags: ["Admin Products"], summary: "Edit product", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "OK" } } } },
    "/api/admin/products/delete/{id}": { delete: { tags: ["Admin Products"], summary: "Delete product", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "OK" } } } },
    "/api/admin/products/get": { get: { tags: ["Admin Products"], summary: "Get all products", responses: { 200: { description: "OK" } } } },

    "/api/admin/orders/get": { get: { tags: ["Admin Orders"], summary: "Get all orders", responses: { 200: { description: "OK" } } } },
    "/api/admin/orders/details/{id}": { get: { tags: ["Admin Orders"], summary: "Get order details", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "OK" } } } },
    "/api/admin/orders/update/{id}": { put: { tags: ["Admin Orders"], summary: "Update order status", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "OK" } } } },

    "/api/admin/users/get": { get: { tags: ["Admin Users"], summary: "Get all users", responses: { 200: { description: "OK" } } } },
    "/api/admin/users/create": { post: { tags: ["Admin Users"], summary: "Create user", responses: { 200: { description: "OK" } } } },
    "/api/admin/users/update/{id}": { put: { tags: ["Admin Users"], summary: "Update user", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "OK" } } } },
    "/api/admin/users/delete/{id}": { delete: { tags: ["Admin Users"], summary: "Delete user", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "OK" } } } },

    "/api/shop/products/get": { get: { tags: ["Shop Products"], summary: "Get filtered products", responses: { 200: { description: "OK" } } } },
    "/api/shop/products/get/{id}": { get: { tags: ["Shop Products"], summary: "Get product details", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "OK" } } } },

    "/api/shop/cart/add": { post: { tags: ["Shop Cart"], summary: "Add item to cart", responses: { 200: { description: "OK" } } } },
    "/api/shop/cart/get/{userId}": { get: { tags: ["Shop Cart"], summary: "Get cart by user", parameters: [{ name: "userId", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "OK" } } } },
    "/api/shop/cart/update-cart": { put: { tags: ["Shop Cart"], summary: "Update cart item quantity", responses: { 200: { description: "OK" } } } },
    "/api/shop/cart/{userId}/{productId}": { delete: { tags: ["Shop Cart"], summary: "Delete cart item", parameters: [{ name: "userId", in: "path", required: true, schema: { type: "string" } }, { name: "productId", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "OK" } } } },

    "/api/shop/address/add": { post: { tags: ["Shop Address"], summary: "Add address", responses: { 200: { description: "OK" } } } },
    "/api/shop/address/get/{userId}": { get: { tags: ["Shop Address"], summary: "Get addresses by user", parameters: [{ name: "userId", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "OK" } } } },
    "/api/shop/address/delete/{userId}/{addressId}": { delete: { tags: ["Shop Address"], summary: "Delete address", parameters: [{ name: "userId", in: "path", required: true, schema: { type: "string" } }, { name: "addressId", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "OK" } } } },
    "/api/shop/address/update/{userId}/{addressId}": { put: { tags: ["Shop Address"], summary: "Update address", parameters: [{ name: "userId", in: "path", required: true, schema: { type: "string" } }, { name: "addressId", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "OK" } } } },

    "/api/shop/order/create": { post: { tags: ["Shop Order"], summary: "Create order", responses: { 200: { description: "OK" } } } },
    "/api/shop/order/capture": { post: { tags: ["Shop Order"], summary: "Capture payment", responses: { 200: { description: "OK" } } } },
    "/api/shop/order/list/{userId}": { get: { tags: ["Shop Order"], summary: "Get user orders", parameters: [{ name: "userId", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "OK" } } } },
    "/api/shop/order/details/{id}": { get: { tags: ["Shop Order"], summary: "Get order details", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "OK" } } } },

    "/api/shop/search/{keyword}": { get: { tags: ["Shop Search"], summary: "Search products by keyword", parameters: [{ name: "keyword", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "OK" } } } },

    "/api/shop/review/add": { post: { tags: ["Shop Review"], summary: "Add product review", responses: { 200: { description: "OK" } } } },
    "/api/shop/review/{productId}": { get: { tags: ["Shop Review"], summary: "Get product reviews", parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "OK" } } } },

    "/api/common/feature/add": { post: { tags: ["Common Feature"], summary: "Add feature image", responses: { 200: { description: "OK" } } } },
    "/api/common/feature/get": { get: { tags: ["Common Feature"], summary: "Get feature images", responses: { 200: { description: "OK" } } } },
    "/api/common/feature/delete/{id}": { delete: { tags: ["Common Feature"], summary: "Delete feature image", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "OK" } } } },
  },
};

const swaggerSpec = swaggerJsdoc({
  definition: swaggerDefinition,
  apis: [],
});

module.exports = swaggerSpec;
