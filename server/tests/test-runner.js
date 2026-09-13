async function main() {
  let serverIsRunning = false;
  try {
    const res = await fetch("http://localhost:4000/api/health");
    if (res.ok) serverIsRunning = true;
  } catch {
    serverIsRunning = false;
  }

  if (!serverIsRunning) {
    const { httpServer } = await import("../server.js");
    while (!httpServer.listening) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  const { run } = await import("./test-flow.js");
  await run();
  process.exit(0);
}

main().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
