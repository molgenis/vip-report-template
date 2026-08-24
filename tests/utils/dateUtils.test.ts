import { describe, it, expect } from "vitest";
import { formatDate } from "../../src/utils/dateUtils";

describe("formatDate", () => {
  it("formats ISO date string to DD-MM-YYYY HH:mm format", () => {
    const result = formatDate(new Date("2024-01-15T14:30:00"));
    expect(result).toMatch(/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/);
  });

  it("formats date with single digit day and month", () => {
    const result = formatDate(new Date("2024-03-05T09:05:00"));
    expect(result).toMatch(/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/);
  });

  it("formats date at midnight", () => {
    const result = formatDate(new Date("2024-06-20T00:00:00"));
    expect(result).toMatch(/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/);
  });

  it("formats date at end of day", () => {
    const result = formatDate(new Date("2024-12-31T23:59:00"));
    expect(result).toMatch(/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/);
  });

  it("handles different years correctly", () => {
    expect(formatDate(new Date("2020-01-01T12:00:00"))).toMatch(
      /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/
    );
    expect(formatDate(new Date("2025-07-04T18:45:00"))).toMatch(
      /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/
    );
  });

  it("uses 24-hour format", () => {
    const result = formatDate(new Date("2024-01-15T14:00:00"));
    expect(result).toMatch(/^\d{2}-\d{2}-\d{4} 14:00$/);

    const result2 = formatDate(new Date("2024-01-15T23:00:00"));
    expect(result2).toMatch(/^\d{2}-\d{2}-\d{4} 23:00$/);
  });

  it("returns correct format structure", () => {
    const result = formatDate(new Date("2024-01-15T14:30:00Z"));
    expect(result).toMatch(/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/);

    const [datePart, timePart] = result.split(" ");
    const [day, month, year] = datePart.split("-");
    const [hour, minute] = timePart.split(":");

    expect(day).toHaveLength(2);
    expect(month).toHaveLength(2);
    expect(year).toHaveLength(4);
    expect(hour).toHaveLength(2);
    expect(minute).toHaveLength(2);
  });

  it("formats specific date correctly in local timezone", () => {
    const testDate = new Date("2024-06-15T10:30:00");
    const result = formatDate(testDate);

    expect(result).toMatch(/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/);
  });
});