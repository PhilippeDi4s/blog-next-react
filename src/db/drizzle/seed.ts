import { readFile } from "fs/promises";
import { drizzleDb } from ".";
import { postsTable } from "./schemas";
import { resolve } from "path";

const ROOT_DIR = process.cwd();
const JSON_PATH = resolve(ROOT_DIR, "src", "db", "seed", "seed", "posts.json");

(async () => {
  async function findAll(){
    const jsonContent = await readFile(JSON_PATH, "utf-8")
    const parsedJson = JSON.parse(jsonContent)
    const {posts} = parsedJson
    return posts
  }

  const posts = await findAll()

  try {
    await drizzleDb.delete(postsTable); //ISSO LIMPA A BASE DE DADOS
    await drizzleDb.insert(postsTable).values(posts);
  } catch (error) {
    console.log(`Erro ao inserir em postsTable: ${error}`);
  }

  console.log("executado");
})();
