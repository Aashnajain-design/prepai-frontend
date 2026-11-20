const queue = [];
const jobResults = {};

function addJob(jobId, jobFunction) {
  queue.push({ jobId, jobFunction });
  jobResults[jobId] = { status: 'pending', result: null };
  console.log(`Job ${jobId} added to queue. Queue length: ${queue.length}`);
}

async function processQueue() {
  if (queue.length === 0) return;

  const { jobId, jobFunction } = queue.shift();
  jobResults[jobId].status = 'processing';
  console.log(`Processing job ${jobId}...`);

  try {
    const result = await jobFunction();
    jobResults[jobId] = { status: 'completed', result };
    console.log(`Job ${jobId} completed!`);
  } catch (err) {
    jobResults[jobId] = { status: 'failed', result: err.message };
    console.log(`Job ${jobId} failed: ${err.message}`);
  }
}

setInterval(processQueue, 2000);

function getJobStatus(jobId) {
  return jobResults[jobId] || { status: 'not_found' };
}

module.exports = { addJob, getJobStatus };