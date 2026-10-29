import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import {
  getAllCategories,
  getAllPhases,
  getCategoryById,
  getActiveCategories,
  pruneInvalidSelections,
  getRecommendedSelections
} from "../src/lib/catalogLoader";
import { generateInstallScript } from "../src/lib/scriptEngine";
import { compileCatalog } from "../scripts/compile-catalog.mjs";
import { onRequestPost } from "../functions/api/script";
import { onRequestGet } from "../functions/s/[id]/install.sh";

describe("SimpleArch File-Driven Logic Test Suite", () => {
  it("should compile and discover all category JSON files", () => {
    const catalog = compileCatalog();
    assert.ok(catalog.totalCategories >= 40, `Expected >= 40 categories, got ${catalog.totalCategories}`);
    assert.ok(catalog.phases.length >= 6, `Expected >= 6 phases, got ${catalog.phases.length}`);

    const categories = getAllCategories();
    assert.equal(categories.length, catalog.totalCategories);

    // Verify critical categories exist
    assert.ok(getCategoryById("installation-mode"), "installation-mode must exist");
    assert.ok(getCategoryById("gpu-driver"), "gpu-driver must exist");
    assert.ok(getCategoryById("compositor-wm"), "compositor-wm must exist");
  });

  it("should handle dynamic category addition and deletion seamlessly", () => {
    const categoriesDir = path.resolve("./data/categories");
    const testCatFile = path.join(categoriesDir, "99-test-custom-widget.json");

    // 1. Create a brand new custom category file
    const customCategory = {
      id: "test-custom-widget",
      name: "Custom Community Widget",
      shortDesc: "A test dynamic category",
      icon: "Sparkles",
      phase: {
        id: "rice",
        title: "Desktop QoL & Ricing Utilities",
        order: 3
      },
      order: 99,
      selectionType: "single",
      optional: true,
      packages: [
        {
          id: "custom-bar-tool",
          name: "My Custom Bar Tool",
          packageName: "custom-bar-git",
          source: "aur",
          description: "A community submitted status widget"
        }
      ]
    };

    try {
      fs.writeFileSync(testCatFile, JSON.stringify(customCategory, null, 2), "utf8");

      // Recompile catalog
      const compiledWithNew = compileCatalog();
      const found = compiledWithNew.categories.find((c) => c.id === "test-custom-widget");
      assert.ok(found, "Newly added JSON file must automatically appear in catalog");
      assert.equal(found.packages[0].id, "custom-bar-tool");

      // Test script generation with this new category selected
      const script = generateInstallScript({
        manifest: {
          timestamp: Date.now(),
          mode: "mode-2-minimal-recommended",
          gpuDriver: "gpu-intel",
          aurHelper: "paru",
          selections: {
            "test-custom-widget": ["custom-bar-tool"]
          }
        },
        catalog: compiledWithNew.categories
      });

      assert.ok(script.includes("custom-bar-git"), "Script engine must automatically include packages from newly added file");
    } finally {
      // 2. Delete the custom file (simulating deleting from git)
      if (fs.existsSync(testCatFile)) {
        fs.unlinkSync(testCatFile);
      }
      const compiledAfterDelete = compileCatalog();
      const foundAfter = compiledAfterDelete.categories.find((c) => c.id === "test-custom-widget");
      assert.equal(foundAfter, undefined, "Deleted category file must completely vanish without panic");
    }
  });

  it("should gracefully handle malformed JSON files without crashing", () => {
    const categoriesDir = path.resolve("./data/categories");
    const malformedFile = path.join(categoriesDir, "99-broken-syntax.json");

    try {
      // Write corrupted JSON syntax
      fs.writeFileSync(malformedFile, "{ invalid json syntax ... missing quotes", "utf8");

      // Compile should NOT throw; it should skip corrupted file gracefully
      const compiled = compileCatalog();
      assert.ok(compiled.categories.length > 0, "Compiler must succeed even with a corrupt file present");
    } finally {
      if (fs.existsSync(malformedFile)) {
        fs.unlinkSync(malformedFile);
      }
      compileCatalog(); // Restore clean state
    }
  });

  it("should handle dynamic category deletion and pruning without panic", () => {
    const categories = getAllCategories();

    // User previously had selections in a category that gets deleted
    const simulatedSelections: Record<string, string[]> = {
      "installation-mode": ["mode-2-minimal-recommended"],
      "gpu-driver": ["gpu-intel"],
      "deleted-old-category": ["old-tool-xyz"], // This does not exist in catalog
      "compositor-wm": ["hyprland", "non-existent-wm"] // One valid, one invalid
    };

    const pruned = pruneInvalidSelections(simulatedSelections, categories);

    assert.equal(pruned["installation-mode"][0], "mode-2-minimal-recommended");
    assert.equal(pruned["gpu-driver"][0], "gpu-intel");
    assert.equal(pruned["deleted-old-category"], undefined, "Deleted category must be cleanly pruned");
    assert.deepEqual(pruned["compositor-wm"], ["hyprland"], "Invalid package must be pruned, keeping valid package");
  });

  it("should evaluate dynamic dependency gating (dependsOn)", () => {
    const categories = getAllCategories();

    // When desktop-architecture is 'arch-full-de'
    const deSelections: Record<string, string[]> = {
      "desktop-architecture": ["arch-full-de"]
    };
    const activeForDe = getActiveCategories(deSelections, categories);
    const deActiveIds = activeForDe.map((c) => c.id);

    // compositor-wm dependsOn 'arch-hand-assembled', so it should NOT be active for full-de
    assert.ok(!deActiveIds.includes("compositor-wm"), "compositor-wm must be hidden when full-de is selected");
    // desktop-environment should be active
    assert.ok(deActiveIds.includes("desktop-environment"), "desktop-environment must be active when full-de is selected");

    // When desktop-architecture is 'arch-hand-assembled'
    const wmSelections: Record<string, string[]> = {
      "desktop-architecture": ["arch-hand-assembled"]
    };
    const activeForWm = getActiveCategories(wmSelections, categories);
    const wmActiveIds = activeForWm.map((c) => c.id);

    assert.ok(wmActiveIds.includes("compositor-wm"), "compositor-wm must be active when hand-assembled is selected");
    assert.ok(!wmActiveIds.includes("desktop-environment"), "desktop-environment must be hidden when hand-assembled is selected");
  });

  it("should generate a valid bash script for Mode 2 (Minimal) with Intel and Hyprland", () => {
    const categories = getAllCategories();
    const manifest = {
      timestamp: Date.now(),
      mode: "mode-2-minimal-recommended",
      gpuDriver: "gpu-intel",
      aurHelper: "paru",
      selections: {
        "installation-mode": ["mode-2-minimal-recommended"],
        "gpu-driver": ["gpu-intel"],
        "compositor-wm": ["hyprland"],
        "status-bar": ["waybar"],
        "terminal": ["kitty"]
      }
    };

    const script = generateInstallScript({ manifest, catalog: categories });

    // Assert script contents
    assert.ok(script.includes("Intel Graphics Stack"), "Script must configure Intel GPU stack");
    assert.ok(script.includes("mesa vulkan-intel"), "Script must install mesa and vulkan-intel");
    assert.ok(script.includes("hyprland"), "Script must install hyprland");
    assert.ok(script.includes("waybar"), "Script must install waybar");
    assert.ok(script.includes("kitty"), "Script must install kitty");
    assert.ok(script.includes("simplearch_backups"), "Script must configure non-destructive backups");

    // Validate bash syntax using bash -n
    const tmpFile = `/tmp/test_script_intel_${Date.now()}.sh`;
    fs.writeFileSync(tmpFile, script, "utf8");
    try {
      execSync(`bash -n ${tmpFile}`);
      assert.ok(true, "Script passed bash -n syntax validation");
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  });

  it("should generate a valid bash script for Mode 4 (Ancient Hardware) with lz4 swap", () => {
    const categories = getAllCategories();
    const manifest = {
      timestamp: Date.now(),
      mode: "mode-4-ancient-hardware",
      gpuDriver: "gpu-generic-skip",
      aurHelper: "paru",
      selections: {
        "installation-mode": ["mode-4-ancient-hardware"],
        "gpu-driver": ["gpu-generic-skip"],
        "terminal": ["alacritty"]
      }
    };

    const script = generateInstallScript({ manifest, catalog: categories });

    assert.ok(script.includes("Ancient Hardware Optimizations"), "Script must contain Mode 4 section");
    assert.ok(script.includes("compression-algorithm = lz4"), "Script must configure lz4 zram algorithm");

    // Validate bash syntax using bash -n
    const tmpFile = `/tmp/test_script_mode4_${Date.now()}.sh`;
    fs.writeFileSync(tmpFile, script, "utf8");
    try {
      execSync(`bash -n ${tmpFile}`);
      assert.ok(true, "Script passed bash -n syntax validation");
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  });

  it("should generate a valid bash script for NVIDIA DKMS with Wayland environment variables", () => {
    const categories = getAllCategories();
    const manifest = {
      timestamp: Date.now(),
      mode: "mode-2-minimal-recommended",
      gpuDriver: "gpu-nvidia-dkms",
      aurHelper: "paru",
      selections: {
        "installation-mode": ["mode-2-minimal-recommended"],
        "gpu-driver": ["gpu-nvidia-dkms"],
        "compositor-wm": ["hyprland"]
      }
    };

    const script = generateInstallScript({ manifest, catalog: categories });

    assert.ok(script.includes("nvidia-dkms"), "Script must install nvidia-dkms");
    assert.ok(script.includes("10-nvidia.conf"), "Script must create 10-nvidia.conf");
    assert.ok(script.includes("LIBVA_DRIVER_NAME=nvidia"), "Script must set NVIDIA Wayland env vars");

    // Validate bash syntax using bash -n
    const tmpFile = `/tmp/test_script_nvidia_${Date.now()}.sh`;
    fs.writeFileSync(tmpFile, script, "utf8");
    try {
      execSync(`bash -n ${tmpFile}`);
      assert.ok(true, "Script passed bash -n syntax validation");
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  });

  it("should bootstrap AUR helper when an AUR package is selected", () => {
    const categories = getAllCategories();

    // Create selection with an AUR package
    const manifest = {
      timestamp: Date.now(),
      mode: "mode-2-minimal-recommended",
      gpuDriver: "gpu-intel",
      aurHelper: "paru",
      selections: {
        "status-bar": ["quickshell"] // quickshell is an AUR package
      }
    };

    const script = generateInstallScript({ manifest, catalog: categories });

    assert.ok(script.includes("Bootstrapping AUR helper (paru-bin)"), "Script must bootstrap paru-bin");
    assert.ok(script.includes("makepkg -si --noconfirm"), "Script must use makepkg");
    assert.ok(script.includes("paru -S --needed --noconfirm"), "Script must install AUR packages with paru");

    // Validate bash syntax using bash -n
    const tmpFile = `/tmp/test_script_aur_${Date.now()}.sh`;
    fs.writeFileSync(tmpFile, script, "utf8");
    try {
      execSync(`bash -n ${tmpFile}`);
      assert.ok(true, "Script passed bash -n syntax validation");
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  });

  it("should test Cloudflare Pages Function edge upload and retrieval", async () => {
    // Mock KV store
    const kvStore = new Map<string, string>();
    const mockEnv = {
      SIMPLEARCH_KV: {
        put: async (key: string, val: string) => {
          kvStore.set(key, val);
        },
        get: async (key: string) => {
          return kvStore.get(key) || null;
        }
      }
    };

    const testBash = "#!/bin/bash\necho 'hello from test'";

    // 1. Test POST /api/script
    const postReq = new Request("https://simplearch.snowfox.live/api/script", {
      method: "POST",
      headers: { "Content-Type": "application/json", host: "simplearch.snowfox.live" },
      body: JSON.stringify({ script: testBash })
    });

    const postRes = await onRequestPost({ request: postReq, env: mockEnv });
    assert.equal(postRes.status, 200);

    const postData = await postRes.json() as { id: string; url: string; command: string; ttlHours: number };
    assert.ok(postData.id && postData.id.length === 5, "Generated slug must be 5 characters");
    assert.equal(postData.command, `curl -fsSL ${postData.url} | bash`);
    assert.equal(postData.ttlHours, 24);

    // Verify written to KV
    assert.equal(kvStore.get(postData.id), testBash);

    // 2. Test GET /s/:id/install.sh (Success)
    const getRes = await onRequestGet({ params: { id: postData.id }, env: mockEnv });
    assert.equal(getRes.status, 200);
    assert.equal(getRes.headers.get("Content-Type"), "text/plain; charset=utf-8");
    const retrievedText = await getRes.text();
    assert.equal(retrievedText, testBash);

    // 3. Test GET /s/:id/install.sh (Missing / Expired)
    const missingRes = await onRequestGet({ params: { id: "non-existent" }, env: mockEnv });
    assert.equal(missingRes.status, 404);
    const missingText = await missingRes.text();
    assert.ok(missingText.includes("expired"), "Must return user-friendly expired notice in bash");
  });
});
