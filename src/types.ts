export type NormalForm = 'UNF' | '1NF' | '2NF' | '3NF';

export interface Column {
  name: string;
  label: string;
  isPK?: boolean;
  isPartialPK?: boolean; // Part of composite PK
  isFK?: boolean;
  keyType?: 'PK' | 'FK' | 'COMPOSITE_PK' | 'NONE';
  role?: 'multi' | 'partial_dep' | 'transitive_dep' | 'normal';
  description?: string;
}

export interface TableData {
  id: string;
  name: string;
  columns: Column[];
  rows: Record<string, any>[];
  functionalDependencies?: string[];
  issues?: {
    type: 'warning' | 'error' | 'success';
    message: string;
    details: string;
  }[];
}

export interface ScenarioStep {
  form: NormalForm;
  title: string;
  description: string;
  tables: TableData[];
  explanation: string;
  rulesChecked: {
    rule: string;
    passed: boolean;
    explanation: string;
  }[];
}

export interface Scenario {
  id: string;
  name: string;
  iconName: string;
  description: string;
  steps: Record<NormalForm, ScenarioStep>;
}

export interface QuizQuestion {
  id: number;
  question: string;
  scenario?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
