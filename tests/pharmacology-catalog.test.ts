import {describe,expect,it} from "vitest";
import {pharmacologyCatalog} from "@/src/clinical/pharmacology/catalog";
import {publishablePharmacologyEntries,validatePharmacologyEntry} from "@/src/clinical/pharmacology/validation";
import {EXAMPLE_PHARMACOLOGY_ENTRY} from "@/src/clinical/pharmacology/example";
describe("caderno farmacológico autoral",()=>{it("disponibiliza fichas do catálogo preenchido",()=>{expect(pharmacologyCatalog.length).toBeGreaterThan(0);expect(publishablePharmacologyEntries(pharmacologyCatalog).length).toBeGreaterThan(0)});it("não publica o molde",()=>expect(publishablePharmacologyEntries([EXAMPLE_PHARMACOLOGY_ENTRY])).toEqual([]));it("detecta placeholders",()=>expect(validatePharmacologyEntry(EXAMPLE_PHARMACOLOGY_ENTRY)).toContain("existem placeholders não preenchidos"))});
