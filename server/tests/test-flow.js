import assert from "assert";

const API = "http://localhost:4000/api";

async function run() {
  console.log("=== STARTING FULL USER JOURNEY VERIFICATION ===");

  // 1. Health check
  const healthRes = await fetch(`${API}/health`);
  const health = await healthRes.json();
  assert.strictEqual(health.success, true);
  console.log("✔ Health check passed");

  // 2. Register user A (Alice)
  const uniqueEmailA = `alice_${Date.now()}@example.com`;
  const regARes = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Alice Walker",
      email: uniqueEmailA,
      password: "Password123!",
      location: "Jorhat, Assam",
      coordinates: [94.2037, 26.7509],
    }),
  });
  const regAData = await regARes.json();
  assert.strictEqual(regAData.success, true);
  assert.ok(regAData.data.token);
  const tokenA = regAData.data.token;
  const userA = regAData.data.user;
  console.log("✔ Register user A passed (Alice)");

  // 3. Register user B (Bob)
  const uniqueEmailB = `bob_${Date.now()}@example.com`;
  const regBRes = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Bob Builder",
      email: uniqueEmailB,
      password: "Password123!",
      location: "Titabor, Assam",
      coordinates: [94.18, 26.58],
    }),
  });
  const regBData = await regBRes.json();
  assert.strictEqual(regBData.success, true);
  const tokenB = regBData.data.token;
  const userB = regBData.data.user;
  console.log("✔ Register user B passed (Bob)");

  // 4. Login
  const loginRes = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: uniqueEmailA, password: "Password123!" }),
  });
  const loginData = await loginRes.json();
  assert.strictEqual(loginData.success, true);
  console.log("✔ Login passed");

  // 5. Auth /me
  const meRes = await fetch(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  const meData = await meRes.json();
  assert.strictEqual(meData.success, true);
  assert.strictEqual(meData.data.user.name, "Alice Walker");
  console.log("✔ /auth/me passed");

  // 6. Test Value Calculator
  const calcRes = await fetch(`${API}/items/calculate-value`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      category: "Outerwear",
      brand: "Levi's",
      condition: "Excellent",
    }),
  });
  const calcData = await calcRes.json();
  assert.strictEqual(calcData.success, true);
  assert.ok(calcData.data.estimatedValue > 0);
  console.log(
    `✔ Swap value calculator passed: ₹${calcData.data.estimatedValue} (${calcData.data.label})`,
  );

  // 7. Alice creates a listing (Item A)
  const createItemARes = await fetch(`${API}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenA}`,
    },
    body: JSON.stringify({
      title: "Vintage Denim Overshirt",
      category: "Outerwear",
      brand: "Levi's",
      size: "M",
      condition: "Excellent",
      estimatedValue: 2800,
      description: "Well maintained denim overshirt with mother of pearl buttons.",
      location: "Jorhat, Assam",
      coordinates: [94.2037, 26.7509],
    }),
  });
  const itemAData = await createItemARes.json();
  assert.strictEqual(itemAData.success, true);
  const itemA = itemAData.data;
  assert.strictEqual(itemA.status, "AVAILABLE");
  console.log("✔ Alice created listing:", itemA.title);

  // 8. Bob creates a listing (Item B)
  const createItemBRes = await fetch(`${API}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenB}`,
    },
    body: JSON.stringify({
      title: "Cozy Alpaca Crewneck",
      category: "Streetwear",
      brand: "Uniqlo",
      size: "L",
      condition: "Like new",
      estimatedValue: 2600,
      description: "Plush alpaca wool knit in oat oatmeal beige.",
      location: "Titabor, Assam",
      coordinates: [94.18, 26.58],
    }),
  });
  const itemBData = await createItemBRes.json();
  assert.strictEqual(itemBData.success, true);
  const itemB = itemBData.data;
  console.log("✔ Bob created listing:", itemB.title);

  // 9. Listing appears in Explore & Search
  const exploreRes = await fetch(`${API}/items?q=Alpaca`);
  const exploreData = await exploreRes.json();
  assert.strictEqual(exploreData.success, true);
  assert.ok(exploreData.data.some((i) => i.id === itemB.id));
  console.log("✔ Item search in Explore passed");

  // 10. Nearby listings with distance
  const nearbyRes = await fetch(`${API}/items/nearby?lat=26.7509&lng=94.2037&radius=30`);
  const nearbyData = await nearbyRes.json();
  assert.strictEqual(nearbyData.success, true);
  const foundItemB = nearbyData.data.find((i) => i.id === itemB.id);
  assert.ok(foundItemB);
  assert.ok(foundItemB.distance.includes("km"));
  console.log(`✔ Nearby query passed (Distance calculated: ${foundItemB.distance})`);

  // 11. Add to Favorites
  const favRes = await fetch(`${API}/favorites/${itemB.id}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  const favData = await favRes.json();
  assert.strictEqual(favData.success, true);
  assert.strictEqual(favData.data.isFavorite, true);

  const getFavsRes = await fetch(`${API}/favorites`, {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  const getFavsData = await getFavsRes.json();
  assert.ok(getFavsData.data.some((f) => f.id === itemB.id));
  console.log("✔ Favorites add & fetch passed");

  // 12. Send Swap Request from Alice to Bob (Offer Item A for Item B)
  const swapReqRes = await fetch(`${API}/swaps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenA}`,
    },
    body: JSON.stringify({
      receiverId: userB.id,
      senderItemId: itemA.id,
      receiverItemId: itemB.id,
      message:
        "Hey Bob! Loved your crewneck sweater. Want to swap for my Levi's overshirt?",
    }),
  });
  const swapReqData = await swapReqRes.json();
  assert.strictEqual(swapReqData.success, true);
  const swap = swapReqData.data;
  assert.strictEqual(swap.status, "PENDING");
  console.log("✔ Swap request sent passed (Status: PENDING)");

  // 13. Bob checks notifications
  const notifRes = await fetch(`${API}/notifications`, {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  const notifData = await notifRes.json();
  assert.strictEqual(notifData.success, true);
  assert.ok(notifData.data.some((n) => n.type === "SWAP_REQUEST"));
  console.log("✔ Bob received real-time notification");

  // 14. Bob views swap request
  const getSwapRes = await fetch(`${API}/swaps/${swap.id}`, {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  const getSwapData = await getSwapRes.json();
  assert.strictEqual(getSwapData.success, true);
  console.log("✔ Bob viewed incoming swap request details");

  // 15. Bob sends a Counter Offer
  const counterRes = await fetch(`${API}/swaps/${swap.id}/counter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenB}`,
    },
    body: JSON.stringify({
      senderItemId: itemA.id,
      receiverItemId: itemB.id,
      senderValue: 2800,
      receiverValue: 2700,
      message: "I can do this swap if we meet in central Jorhat this weekend!",
    }),
  });
  const counterData = await counterRes.json();
  assert.strictEqual(counterData.success, true);
  assert.strictEqual(counterData.data.status, "COUNTERED");
  assert.ok(counterData.data.history.length >= 2);
  console.log("✔ Counter offer submitted, history preserved (Status: COUNTERED)");

  // 16. Alice accepts swap proposal
  const acceptRes = await fetch(`${API}/swaps/${swap.id}/accept`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  const acceptData = await acceptRes.json();
  assert.strictEqual(acceptData.success, true);
  assert.strictEqual(acceptData.data.status, "ACCEPTED");

  // Verify items became RESERVED
  const checkItemA = await (await fetch(`${API}/items/${itemA.id}`)).json();
  const checkItemB = await (await fetch(`${API}/items/${itemB.id}`)).json();
  assert.strictEqual(checkItemA.data.status, "RESERVED");
  assert.strictEqual(checkItemB.data.status, "RESERVED");
  console.log("✔ Swap accepted: both items atomically moved to RESERVED");

  // 17. Bob confirms completion
  const comp1Res = await fetch(`${API}/swaps/${swap.id}/complete`, {
    method: "POST",
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  const comp1Data = await comp1Res.json();
  assert.strictEqual(comp1Data.success, true);
  console.log("✔ Bob confirmed completion (waiting on Alice)");

  // 18. Alice confirms completion -> items become SWAPPED
  const comp2Res = await fetch(`${API}/swaps/${swap.id}/complete`, {
    method: "POST",
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  const comp2Data = await comp2Res.json();
  assert.strictEqual(comp2Data.success, true);
  assert.strictEqual(comp2Data.data.status, "COMPLETED");

  // Check items became SWAPPED
  const checkSwappedA = await (await fetch(`${API}/items/${itemA.id}`)).json();
  const checkSwappedB = await (await fetch(`${API}/items/${itemB.id}`)).json();
  assert.strictEqual(checkSwappedA.data.status, "SWAPPED");
  assert.strictEqual(checkSwappedB.data.status, "SWAPPED");
  console.log("✔ Alice confirmed: both items moved to SWAPPED, swap status: COMPLETED");

  // 19. Alice rates Bob
  const rateRes = await fetch(`${API}/ratings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenA}`,
    },
    body: JSON.stringify({
      swapId: swap.id,
      score: 5,
      review: "Awesome swap! The alpaca knit is super soft and Bob was on time.",
    }),
  });
  const rateData = await rateRes.json();
  assert.strictEqual(rateData.success, true);
  console.log("✔ Alice rated Bob with 5 stars");

  // 20. Bob's profile statistics updated
  const profileBRes = await fetch(`${API}/users/${userB.id}`);
  const profileB = await profileBRes.json();
  assert.strictEqual(profileB.success, true);
  assert.ok(profileB.data.successfulSwaps >= 1);
  assert.strictEqual(profileB.data.rating, 5.0);
  assert.strictEqual(profileB.data.ratingCount, 1);
  console.log(
    `✔ Bob's profile updated: ${profileB.data.successfulSwaps} successful swaps, ${profileB.data.rating} rating`,
  );

  // 21. Dashboard stats
  const dashRes = await fetch(`${API}/dashboard/stats`, {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  const dashData = await dashRes.json();
  assert.strictEqual(dashData.success, true);
  assert.ok(dashData.data.successfulSwaps >= 1);
  console.log("✔ Dashboard stats returned real data:", dashData.data);

  // 22. Test Failure Cases
  // Case A: Cannot swap with yourself
  const selfSwapRes = await fetch(`${API}/swaps`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenA}` },
    body: JSON.stringify({
      receiverId: userA.id,
      senderItemId: itemA.id,
      receiverItemId: itemB.id,
    }),
  });
  const selfSwapData = await selfSwapRes.json();
  assert.strictEqual(selfSwapData.success, false);
  console.log("✔ Failure case: Self-swap prevented:", selfSwapData.message);

  // Case B: Cannot swap items already SWAPPED
  const swappedItemRes = await fetch(`${API}/swaps`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenA}` },
    body: JSON.stringify({
      receiverId: userB.id,
      senderItemId: itemA.id,
      receiverItemId: itemB.id,
    }),
  });
  const swappedItemData = await swappedItemRes.json();
  assert.strictEqual(swappedItemData.success, false);
  console.log(
    "✔ Failure case: Swapped item proposal prevented:",
    swappedItemData.message,
  );

  // Case C: Cannot rate oneself
  const selfRateRes = await fetch(`${API}/ratings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenA}` },
    body: JSON.stringify({ swapId: swap.id, score: 5, review: "Rating myself" }),
  });
  const selfRateData = await selfRateRes.json();
  assert.strictEqual(selfRateData.success, false);
  console.log("✔ Failure case: Self-rating prevented:", selfRateData.message);

  console.log("=== ALL JOURNEY & FAILURE TESTS PASSED! ===");
}

export { run };

if (process.argv[1] && process.argv[1].endsWith("test-flow.js")) {
  run().catch((e) => {
    console.error("Test failed:", e);
    process.exit(1);
  });
}
