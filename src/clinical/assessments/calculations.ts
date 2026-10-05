import type { EcomapScope } from "./types";

export type AdultAgeBand = "age-18-29" | "age-30-44" | "age-45-59" | "age-60-79" | "age-80-plus";

export interface AdultAgeResult {
  ageYears: number;
  eligible: boolean;
  band?: AdultAgeBand;
}

function parseDate(value: string): Date {
  const parsed = new Date(`${value}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new Error(`Data inválida: ${value}`);
  }
  return parsed;
}

export function deriveAdultAgeBand(birthDate: string, assessmentDate: string): AdultAgeResult {
  const birth = parseDate(birthDate);
  const assessment = parseDate(assessmentDate);
  if (assessment < birth) throw new Error("A data da avaliação não pode ser anterior ao nascimento.");
  let ageYears = assessment.getUTCFullYear() - birth.getUTCFullYear();
  const birthdayNotReached = assessment.getUTCMonth() < birth.getUTCMonth()
    || (assessment.getUTCMonth() === birth.getUTCMonth() && assessment.getUTCDate() < birth.getUTCDate());
  if (birthdayNotReached) ageYears -= 1;
  if (ageYears < 18) return { ageYears, eligible: false };
  if (ageYears < 30) return { ageYears, eligible: true, band: "age-18-29" };
  if (ageYears < 45) return { ageYears, eligible: true, band: "age-30-44" };
  if (ageYears < 60) return { ageYears, eligible: true, band: "age-45-59" };
  if (ageYears < 80) return { ageYears, eligible: true, band: "age-60-79" };
  return { ageYears, eligible: true, band: "age-80-plus" };
}

export type BmiClassification = "underweight" | "normal" | "overweight" | "obesity-i" | "obesity-ii" | "obesity-iii";

export function calculateBmi(weightKg: number, heightM: number): number {
  if (!Number.isFinite(weightKg) || !Number.isFinite(heightM) || weightKg <= 0 || heightM <= 0) {
    throw new Error("Peso e altura devem ser números finitos maiores que zero.");
  }
  const bmi = weightKg / (heightM ** 2);
  if (!Number.isFinite(bmi)) throw new Error("IMC inválido.");
  return bmi;
}

export function classifyBmi(bmi: number): BmiClassification {
  if (!Number.isFinite(bmi) || bmi < 0) throw new Error("IMC inválido.");
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  if (bmi < 35) return "obesity-i";
  if (bmi < 40) return "obesity-ii";
  return "obesity-iii";
}

export type WaistCriterion = "male-local-rule" | "female-local-rule" | "not-selected";
export type WaistClassification = "low" | "increased" | "very-increased";

export function classifyWaistCircumference(measurementCm: number, criterion: WaistCriterion): WaistClassification | undefined {
  if (!Number.isFinite(measurementCm) || measurementCm <= 0) throw new Error("A circunferência deve ser finita e maior que zero.");
  if (criterion === "not-selected") return undefined;
  const increasedLimit = criterion === "male-local-rule" ? 94 : 80;
  const veryIncreasedLimit = criterion === "male-local-rule" ? 102 : 88;
  if (measurementCm < increasedLimit) return "low";
  if (measurementCm <= veryIncreasedLimit) return "increased";
  return "very-increased";
}

export interface BloodPressureReading {
  systolic: number;
  diastolic: number;
}

export interface BloodPressureMean {
  systolicMean: number;
  diastolicMean: number;
}

export function calculateBloodPressureMean(readings: [BloodPressureReading, BloodPressureReading] | undefined): BloodPressureMean | undefined {
  if (!readings) return undefined;
  for (const reading of readings) {
    if (!Number.isFinite(reading.systolic) || !Number.isFinite(reading.diastolic) || reading.systolic <= 0 || reading.diastolic <= 0) {
      throw new Error("Cada aferição deve conter sistólica e diastólica finitas maiores que zero.");
    }
  }
  return {
    systolicMean: (readings[0].systolic + readings[1].systolic) / 2,
    diastolicMean: (readings[0].diastolic + readings[1].diastolic) / 2,
  };
}

export function isSelectedMembersScopeValid(scope: EcomapScope, relatedPersonIds: string[]): boolean {
  return scope === "family" ? relatedPersonIds.length === 0 : relatedPersonIds.length > 0;
}
