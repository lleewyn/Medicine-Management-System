
(async () => {
    console.log("Checking MockData state...");
    const batches = window.MockData.BATCHES;
    console.log("Batches count:", batches.length);
    console.log("First batch:", batches[0]);
    
    console.log("Syncing with NocoDB...");
    await window.MockData.syncWithNoco();
    
    const syncedBatches = window.MockData.BATCHES;
    console.log("Synced Batches count:", syncedBatches.length);
    console.log("First synced batch:", syncedBatches[0]);
})();
