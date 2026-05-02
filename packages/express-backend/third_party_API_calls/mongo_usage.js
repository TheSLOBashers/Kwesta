import DigestFetch from "digest-fetch";

const publicKey = "gcfumcur";
const privateKey = "031324c3-19d4-43d8-a4a9-3b370bd3061c";
const groupId = "698949b0e17f342871ca3174";
const clusterName = "kwesta";
const processId = "atlas-oj5dcs-shard-00-02.x3kde7x.mongodb.net:27017";

const client = new DigestFetch(
  publicKey,
  privateKey
);

async function getGroups() {
  const url = `https://cloud.mongodb.com/api/atlas/v1.0/groups`;

  const res = await client.fetch(url);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }

  console.log(await res.json());
}

async function getProcesses() {
  const url = `https://cloud.mongodb.com/api/atlas/v1.0/groups/${groupId}/processes`;

  const res = await client.fetch(url);
  const data = await res.json();

  console.log(data.results.map(p => ({
    id: p.id,
    type: p.typeName
  })));
}

async function getClusterUsageTypes() {
  const url =
    `https://cloud.mongodb.com/api/atlas/v1.0/groups/${groupId}` +
    `/processes/${processId}/measurements` +
    `?granularity=PT1M&period=PT5M`;

  const res = await client.fetch(url);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();

  return data;
}

async function getClusterUsageStats() {
  const url =
    `https://cloud.mongodb.com/api/atlas/v1.0/groups/${groupId}` +
    `/processes/${processId}/measurements` +
    `?granularity=PT1M&period=P1D` +
    `&m=NETWORK_NUM_REQUESTS` +
    `&m=CONNECTIONS` +
    `&m=OPCOUNTER_CMD` +
    `&m=OPCOUNTER_QUERY` +
    `&m=OPCOUNTER_UPDATE` +
    `&m=OPCOUNTER_DELETE` +
    `&m=OPCOUNTER_INSERT` +
    `&m=LOGICAL_SIZE` +
    `&m=FTS_PROCESS_RESIDENT_MEMORY` +
    `&m=FTS_PROCESS_VIRTUAL_MEMORY` +
    `&m=FTS_DISK_USAGE` +
    `&m=FTS_PROCESS_CPU_KERNEL`;

  const res = await client.fetch(url);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();

  return data.measurements;
}

export default { getClusterUsageStats, getClusterUsageTypes };