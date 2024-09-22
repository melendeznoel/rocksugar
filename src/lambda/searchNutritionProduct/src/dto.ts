import { Transform } from 'stream'
import { pipeline } from 'stream/promises'

const parallelTransform = new Transform({
  objectMode: true,
  async transform(chunk, encoding, callback) {
    // Simulate an async operation (e.g., a database lookup or API call)
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulated delay
    callback(null, `Processed: ${chunk}\n`);
  }
});

// Example usage with an array of data
const inputData = ['item1', 'item2', 'item3', 'item4'];

async function runPipeline() {
  await pipeline(
    Readable.from(inputData),  // Read from data source
    parallelTransform,         // Process data in parallel
    process.stdout             // Output to console
  );
}
