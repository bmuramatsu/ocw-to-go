import { describe, expect, test } from "vitest";

import { formatBytes } from "./format_bytes";

describe("formatBytes", () => {
  test("should return raw bytes for small values", () => {
    expect(formatBytes(0)).toBe("0 KB");
    expect(formatBytes(1)).toBe("1 Bytes");
    expect(formatBytes(1023)).toBe("1023 Bytes");
  });

  test("should round KB and MB values to whole numbers", () => {
    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(2048)).toBe("2 KB");
    expect(formatBytes(1048576)).toBe("1 MB");
    expect(formatBytes(2097152)).toBe("2 MB");
    expect(formatBytes(1300000)).toBe("1 MB");
  });

  test("should round GB and TB values up to two decimal places", () => {
    expect(formatBytes(1395864371)).toBe("1.3 GB");
    expect(formatBytes(1449551462)).toBe("1.35 GB");
    expect(formatBytes(1231453023109)).toBe("1.12 TB");
  });

  test("should handle larger than TB values", () => {
    expect(formatBytes(1126999418470400)).toBe("1025 TB");
  });
});
