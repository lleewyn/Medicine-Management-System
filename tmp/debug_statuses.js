setTimeout(() => {
  console.log("DEBUG: All Batches with Status:");
  window.MockData.BATCHES.forEach(b => {
    console.log(`ID: ${b.BatchID}, Code: ${b.Batchcode}, Status:`, b.BatchStatus);
  });
}, 2000);
