fetch("http://localhost:5000/api/subscribers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "test_verified@example.com" })
}).then(res => res.json()).then(console.log).catch(console.error);
