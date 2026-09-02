const test = require("node:test");
const assert = require("node:assert");

const API_URL = process.env.API_URL || "http://localhost:5000/api";

test("GET /destinations should return success", async () => {
    const response = await fetch(`${API_URL}/destinations`);

    assert.strictEqual(response.status, 200);

    const data = await response.json();

    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.data));
});

test("GET /packages should return success", async () => {
    const response = await fetch(`${API_URL}/packages`);

    assert.strictEqual(response.status, 200);

    const data = await response.json();

    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.data));
});