interface Coding  {
  system: string
  code: string
  display: string
}

interface CodeableConcept {
  coding: Coding[]
  text: string
}

interface Reference {
  reference: string
  display: string
}

interface Quantity {
  value: number
  unit: string
  system: string
  code: string
}

interface Meta {
  versionId: string
  lastUpdated: string
}

interface Narrative {
  status: string
  div: string
}

interface Nutrient {
  item: CodeableConcept
  amount: Quantity
}

interface Ingredient {
  item: CodeableConcept
}

interface ProductCharacteristic {
  interface: CodeableConcept
  valueQuantity: Quantity
  valueString: string
}

interface Identifier {
  system: string;
  value: string
}

interface Instance {
  quantity: Quantity
  identifier: Identifier[]
  expiry: string
  lotNumber: string
}

export interface NutritionProduct {
  resourceType: string
  id: string
  meta: Meta
  text: Narrative
  code: CodeableConcept
  status: string
  category: CodeableConcept[]
  manufacturer: Reference[]
  nutrient: Nutrient[]
  ingredient: Ingredient[]
  knownAllergen: CodeableConcept[]
  productCharacteristic: ProductCharacteristic[]
  instance: Instance[]
}
