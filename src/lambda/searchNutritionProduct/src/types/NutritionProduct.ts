type Coding = {
  system: string;
  code: string;
  display: string;
};

type CodeableConcept = {
  coding: Coding[];
  text: string;
};

type Reference = {
  reference: string;
  display: string;
};

type Quantity = {
  value: number;
  unit: string;
  system: string;
  code: string;
};

type Meta = {
  versionId: string;
  lastUpdated: string;
};

type Narrative = {
  status: string;
  div: string;
};

type Nutrient = {
  item: CodeableConcept;
  amount: Quantity;
};

type Ingredient = {
  item: CodeableConcept;
};

type ProductCharacteristic = {
  type: CodeableConcept;
  valueQuantity?: Quantity;
  valueString?: string;
};

type Identifier = {
  system: string;
  value: string;
};

type Instance = {
  quantity: Quantity;
  identifier: Identifier[];
  expiry: string;
  lotNumber: string;
};

export type NutritionProduct = {
  resourceType: string;
  id: string;
  meta: Meta;
  text: Narrative;
  code: CodeableConcept;
  status: string;
  category: CodeableConcept[];
  manufacturer: Reference[];
  nutrient: Nutrient[];
  ingredient: Ingredient[];
  knownAllergen: CodeableConcept[];
  productCharacteristic: ProductCharacteristic[];
  instance: Instance[];
};
