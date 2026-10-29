import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATEGORIES_DIR = path.resolve(__dirname, "../data/categories");
const OUTPUT_FILE = path.resolve(__dirname, "../src/data/catalog.json");

export function compileCatalog() {
  if (!fs.existsSync(CATEGORIES_DIR)) {
    console.warn(`[SimpleArch] Warning: Categories directory not found at ${CATEGORIES_DIR}`);
    fs.mkdirSync(CATEGORIES_DIR, { recursive: true });
  }

  const files = fs.readdirSync(CATEGORIES_DIR).filter((f) => f.endsWith(".json"));
  console.log(`[SimpleArch] Discovered ${files.length} category definition files.`);

  const categories = [];
  const errors = [];

  for (const file of files) {
    const fullPath = path.join(CATEGORIES_DIR, file);
    try {
      const raw = fs.readFileSync(fullPath, "utf8");
      const parsed = JSON.parse(raw);

      // Sanity checks
      if (!parsed.id || !parsed.name || !Array.isArray(parsed.packages)) {
        errors.push({ file, error: "Missing required 'id', 'name', or 'packages' array." });
        continue;
      }

      // Ensure phase object exists
      if (!parsed.phase) {
        parsed.phase = {
          id: "general",
          title: "General Configuration",
          order: 99
        };
      }

      // Default order
      if (typeof parsed.order !== "number") {
        parsed.order = 999;
      }

      categories.push(parsed);
    } catch (err) {
      errors.push({ file, error: String(err) });
    }
  }

  if (errors.length > 0) {
    console.warn(`[SimpleArch] Encountered ${errors.length} invalid category files (skipped gracefully):`);
    errors.forEach((e) => console.warn(`  - ${e.file}: ${e.error}`));
  }

  // Sort categories by phase.order, then category.order, then name
  categories.sort((a, b) => {
    const phaseOrderA = a.phase?.order ?? 99;
    const phaseOrderB = b.phase?.order ?? 99;
    if (phaseOrderA !== phaseOrderB) {
      return phaseOrderA - phaseOrderB;
    }
    const catOrderA = a.order ?? 999;
    const catOrderB = b.order ?? 999;
    if (catOrderA !== catOrderB) {
      return catOrderA - catOrderB;
    }
    return a.name.localeCompare(b.name);
  });

  // Group into phases
  const phaseMap = new Map();
  for (const cat of categories) {
    const pId = cat.phase.id;
    if (!phaseMap.has(pId)) {
      phaseMap.set(pId, {
        id: pId,
        title: cat.phase.title,
        description: cat.phase.description || "",
        order: cat.phase.order ?? 99,
        categories: []
      });
    }
    phaseMap.get(pId).categories.push(cat);
  }

  const phases = Array.from(phaseMap.values()).sort((a, b) => a.order - b.order);

  const payload = {
    generatedAt: new Date().toISOString(),
    totalCategories: categories.length,
    phases,
    categories
  };

  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2), "utf8");
  console.log(`[SimpleArch] Successfully compiled ${categories.length} categories across ${phases.length} phases into ${OUTPUT_FILE}`);
  return payload;
}

if (process.argv[1] === __filename) {
  compileCatalog();
}
