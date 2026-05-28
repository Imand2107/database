import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'An unnormalized database table with repeating columns or nested data lists is converted to 1NF. What is the fundamental requirement to achieve 1NF?',
    options: [
      'Remove all partial dependencies on the primary key.',
      'Ensure all cell values are atomic (non-divisible) and establish a primary key.',
      'Ensure there are no transitive dependencies.',
      'Split the table into separate catalogs with foreign key relations.'
    ],
    correctIndex: 1,
    explanation: 'First Normal Form (1NF) requires that: 1. All attributes must contain atomic (single, indivisible) values. Repeating groups or comma-separated lists must be eliminated. 2. A primary key (or composite primary key) must be defined so that all rows are distinct.'
  },
  {
    id: 2,
    question: 'Consider a table "Project_Assignments" with a composite primary key: (Employee_ID, Project_ID). The columns are: Employee_Name, Project_Name, and Hours_Worked. Which of the following describes a 2NF violation?',
    options: [
      'Hours_Worked depends on both Employee_ID and Project_ID.',
      'Employee_Name depends only on Employee_ID, and Project_Name depends only on Project_ID.',
      'Employee_Name contains commas representing multiple names.',
      'Employee_ID represents a transitive relationship to Project_ID.'
    ],
    correctIndex: 1,
    explanation: 'Uniquely in 2NF, all non-key columns must depend on the ENTIRE primary key (no partial dependencies). Since Employee_Name depends on only Employee_ID (part of the composite key) and Project_Name depends on only Project_ID (part of the composite key), these are both partial dependencies. They violate 2NF and must be split.'
  },
  {
    id: 3,
    question: 'If a table is in 2NF, has a single-column primary key (e.g. Employee_ID), does it automatically satisfy 2NF requirements, and is it guaranteed to be in 3NF?',
    options: [
      'Yes, it satisfies 2NF. No, it is not guaranteed to be in 3NF because transitive dependencies can still exist.',
      'No, because partial key dependencies can still exist if there are single-column keys.',
      'Yes to both, any single-column primary key table is automatically in 3NF.',
      'No, a single-column primary key table automatically violates 2NF because composite keys are mandatory.'
    ],
    correctIndex: 0,
    explanation: 'Since 2NF only forbids partial dependency on a composite key, a table with a single-column primary key can NEVER have a partial key dependency (you cannot depend on a proper subset of a single column). Therefore, single-key tables are always in 2NF automatically! However, they are NOT guaranteed to be in 3NF because they can still have transitive dependencies (e.g., Emp_ID -> Job_Class -> Salary_Range).'
  },
  {
    id: 4,
    question: 'Look at this dependency chain: Book_ID -> Author_ID -> Author_Country. Here, Book_ID is the table\'s primary key. Which normal form does this relationship violate, and why?',
    options: [
      '1NF, because there are repeating authors.',
      '2NF, because Author_Country depends partially on Author_ID.',
      '3NF, because Book_ID transitively determines Author_Country via Author_ID.',
      'BCNF, because Book_ID is a candidate key.'
    ],
    correctIndex: 2,
    explanation: 'This is a classic Transitive Dependency since Author_Country depends on Author_ID, which is determined by Book_ID (Book_ID -> Author_ID -> Author_Country). This violates 3NF, which requires all attributes to be determined directly by the key only (No transitive dependencies).'
  },
  {
    id: 5,
    question: 'In which scenario is it highly beneficial to DELIBERATELY DENORMALIZE a database (i.e. moving back from 3NF towards 2NF or 1NF)?',
    options: [
      'In transactional databases (OLTP) to safeguard against insertion and update anomalies.',
      'In high-perf analysis systems or data warehouses (OLAP) to decrease the frequency/cost of expensive JOIN operations.',
      'When designing primary key triggers.',
      'When migrating to a NoSQL Firestore database, since NoSQL requires strict 3NF schemas.'
    ],
    correctIndex: 1,
    explanation: 'Denormalization is used deliberately in Read-Heavy systems like Data Warehouses (OLAP) and analytics. Normalizing schemas to 3NF splits data into many tables, which requires complex SQL JOINs at runtime. Denormalizing trades redundant storage for fast, single-table reads.'
  },
  {
    id: 6,
    question: 'You have a table "Store_Branches" with primary key Branch_Code. The columns are: Branch_City, Branch_State, and State_Tax_Rate. The dependency State_Tax_Rate depends on Branch_State is present. Which Normal Form is violated?',
    options: [
      '1NF',
      '2NF',
      '3NF (transitive dependency: Branch_Code -> Branch_State -> State_Tax_Rate)',
      'None, it is fully in 3NF.'
    ],
    correctIndex: 2,
    explanation: 'Because Branch_Code -> Branch_State, and Branch_State -> State_Tax_Rate, any change in branch state tax rate would require updating all branch offices in that state. This is a transitive dependency and violates 3NF. To resolve, state tax rates should be moved to a separate "States" lookup table.'
  }
];
