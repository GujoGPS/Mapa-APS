import { describe, expect, it } from "vitest";
import {
  calculateBloodPressureMean,
  calculateBmi,
  classifyBmi,
  classifyWaistCircumference,
  deriveAdultAgeBand,
} from "@/src/clinical/assessments";

describe("cálculos puros da avaliação adulta DCNT ESF", () => {
  it("deriva idade considerando aniversário e faixas adultas", () => {
    expect(deriveAdultAgeBand("2000-09-29", "2026-09-28")).toMatchObject({ ageYears: 25, band: "age-18-29", eligible: true });
    expect(deriveAdultAgeBand("2000-09-28", "2026-09-28")).toMatchObject({ ageYears: 26, band: "age-18-29", eligible: true });
    expect(deriveAdultAgeBand("1981-09-28", "2026-09-28").band).toBe("age-45-59");
    expect(deriveAdultAgeBand("1996-09-28", "2026-09-28").band).toBe("age-30-44");
    expect(deriveAdultAgeBand("2008-09-28", "2026-09-28")).toMatchObject({ ageYears: 18, band: "age-18-29" });
    expect(deriveAdultAgeBand("2009-09-28", "2026-09-28")).toEqual({ ageYears: 17, eligible: false });
    expect(deriveAdultAgeBand("1997-09-29", "2026-09-28").band).toBe("age-18-29");
    expect(deriveAdultAgeBand("1982-09-29", "2026-09-28").band).toBe("age-30-44");
    expect(deriveAdultAgeBand("1967-09-29", "2026-09-28").band).toBe("age-45-59");
    expect(deriveAdultAgeBand("1947-09-29", "2026-09-28").band).toBe("age-60-79");
    expect(deriveAdultAgeBand("1946-09-28", "2026-09-28").band).toBe("age-80-plus");
    expect(() => deriveAdultAgeBand("invalid", "2026-09-28")).toThrow(/Data inválida/);
    expect(() => deriveAdultAgeBand("2027-01-01", "2026-09-28")).toThrow(/anterior ao nascimento/);
  });

  it("calcula e classifica IMC com limites contínuos", () => {
    expect(calculateBmi(80, 2)).toBe(20);
    expect(classifyBmi(18.49)).toBe("underweight");
    expect(classifyBmi(18.5)).toBe("normal");
    expect(classifyBmi(24.99)).toBe("normal");
    expect(classifyBmi(25)).toBe("overweight");
    expect(classifyBmi(29.99)).toBe("overweight");
    expect(classifyBmi(30)).toBe("obesity-i");
    expect(classifyBmi(34.99)).toBe("obesity-i");
    expect(classifyBmi(35)).toBe("obesity-ii");
    expect(classifyBmi(39.99)).toBe("obesity-ii");
    expect(classifyBmi(40)).toBe("obesity-iii");
    expect(() => calculateBmi(0, 1.7)).toThrow();
    expect(() => calculateBmi(70, 0)).toThrow();
    expect(() => calculateBmi(Number.NaN, 1.7)).toThrow();
    expect(() => classifyBmi(Number.POSITIVE_INFINITY)).toThrow();
  });

  it("calcula média de PA somente com duas visitas completas", () => {
    expect(calculateBloodPressureMean([{ systolic: 120, diastolic: 80 }, { systolic: 130, diastolic: 84 }])).toEqual({ systolicMean: 125, diastolicMean: 82 });
    expect(calculateBloodPressureMean(undefined)).toBeUndefined();
    expect(() => calculateBloodPressureMean([{ systolic: 120, diastolic: 0 }, { systolic: 130, diastolic: 84 }])).toThrow();
    expect(calculateBloodPressureMean([{ systolic: 121, diastolic: 81 }, { systolic: 122, diastolic: 82 }])).toEqual({ systolicMean: 121.5, diastolicMean: 81.5 });
  });

  it("classifica circunferência somente com critério local explícito", () => {
    expect(classifyWaistCircumference(93.9, "male-local-rule")).toBe("low");
    expect(classifyWaistCircumference(94, "male-local-rule")).toBe("increased");
    expect(classifyWaistCircumference(102, "male-local-rule")).toBe("increased");
    expect(classifyWaistCircumference(102.1, "male-local-rule")).toBe("very-increased");
    expect(classifyWaistCircumference(79.9, "female-local-rule")).toBe("low");
    expect(classifyWaistCircumference(80, "female-local-rule")).toBe("increased");
    expect(classifyWaistCircumference(88, "female-local-rule")).toBe("increased");
    expect(classifyWaistCircumference(88.1, "female-local-rule")).toBe("very-increased");
    expect(classifyWaistCircumference(90, "not-selected")).toBeUndefined();
  });
});
