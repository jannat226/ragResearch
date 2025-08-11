// server/utils/neo4j.js
const neo4j = require("neo4j-driver");

let driver;

function getDriver() {
  if (!driver) {
    const uri = process.env.NEO4J_URI;
    const user = process.env.NEO4J_USERNAME || process.env.NEO4J_USER;
    const password = process.env.NEO4J_PASSWORD;
    if (!uri || !user || !password) {
      throw new Error(
        "Missing Neo4j credentials. Set NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD in .env"
      );
    }
    driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  }
  return driver;
}

function dbSession(mode = "WRITE") {
  const database = process.env.NEO4J_DATABASE || "neo4j";
  return getDriver().session({ defaultAccessMode: mode, database });
}

async function closeDriver() {
  if (driver) await driver.close();
}

async function ensureVectorIndexes() {
  const session = dbSession("WRITE");
  try {
    // Create vector index for Blog nodes
    await session.run(
      "CREATE VECTOR INDEX blog_embedding IF NOT EXISTS FOR (n:BlogVec) ON (n.embedding) OPTIONS { indexConfig: { `vector.dimensions`: 768, `vector.similarity_function`: 'cosine' } }"
    );
    // Create vector index for Chunk nodes
    await session.run(
      "CREATE VECTOR INDEX chunk_embedding IF NOT EXISTS FOR (c:Chunk) ON (c.embedding) OPTIONS { indexConfig: { `vector.dimensions`: 768, `vector.similarity_function`: 'cosine' } }"
    );
  } finally {
    await session.close();
  }
}

module.exports = { getDriver, closeDriver, ensureVectorIndexes, dbSession };
