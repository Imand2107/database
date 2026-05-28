import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';

type StepPhase = 'idle' | 'highlight_pks' | 'detect_partial' | 'resolve_2nf';

export default function TransformationVisualizer() {
  const [activePhase, setActivePhase] = useState<StepPhase>('idle');
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);

  // Infographic Form Selection
  const [infographicForm, setInfographicForm] = useState<'1NF' | '2NF' | '3NF'>('1NF');

  // Multi-step guidelines for interactive 1NF -> 2NF transformation
  const phaseDescriptions = {
    idle: {
      title: "The Raw 1NF Flat State",
      subtitle: "Observe the composite primary key table where redundant facts are co-mingled.",
      explanation: "In First Normal Form (1NF), all cells represent atomic values, and there is a primary key {Student_ID, Course_ID}. However, notice how student personal data and course catalog details are duplicated in every single enrollment record, creating risk of anomalies."
    },
    highlight_pks: {
      title: "Identify candidate Keys & Composite PK",
      subtitle: "The table uses a relative composite key to achieve row-level uniqueness.",
      explanation: "Since multiple students enroll in multiple courses, neither Student_ID nor Course_ID can uniquely identify a row alone. Together, {Student_ID, Course_ID} form our Composite Primary Key. Any attribute that depends on only a part of this key is a candidate for violation."
    },
    detect_partial: {
      title: "Scan for Partial Key Dependencies (Violations)",
      subtitle: "Trace column dependencies to expose partial-key relationships.",
      explanation: "Here lies the core issue: Student_Name depends solely on Student_ID, not the course! Course_Name and instructor data depend solely on Course_ID, not the student! This means these attributes depend on only a sub-part of our composite key. These are partial dependencies."
    },
    resolve_2nf: {
      title: "Decompose into Second Normal Form (2NF)",
      subtitle: "Splitting the co-mingled columns into atomic relational dictionaries.",
      explanation: "To achieve 2NF, we isolate partial dependencies into their own target domain tables. We create a Students dictionary table, a Courses dictionary table, and maintain a lightweight Enrollment junction table connecting them by foreign keys, completely eliminating duplication."
    }
  };

  // Original non-normalized 1NF row details
  const rawTableRows = [
    { studentId: "S201", studentName: "Arthur Curry", courseId: "CS-101", courseName: "Intro to Algorithms", instructor: "Dr. Evelyn", office: "Room 401", grade: "A-" },
    { studentId: "S201", studentName: "Arthur Curry", courseId: "MATH-201", courseName: "Calculus III", instructor: "Prof. Chen", office: "Room 102", grade: "B+" },
    { studentId: "S202", studentName: "Arthur Curry", courseId: "CS-101", courseName: "Intro to Algorithms", instructor: "Dr. Evelyn", office: "Room 401", grade: "B" },
    { studentId: "S203", studentName: "Diana Prince", courseId: "CS-101", courseName: "Intro to Algorithms", instructor: "Dr. Evelyn", office: "Room 401", grade: "A+" },
    { studentId: "S203", studentName: "Diana Prince", courseId: "PHYS-302", courseName: "Quantum Mechanics", instructor: "Dr. Evelyn", office: "Room 401", grade: "A" }
  ];

  // Helper column maps
  const rawColumns = [
    { name: 'studentId', label: "Student_ID", type: "PK_PART_A", desc: "Composite PK Part 1" },
    { name: 'studentName', label: "Student_Name", type: "DEP_ON_A", desc: "Depends ONLY on Student_ID" },
    { name: 'courseId', label: "Course_ID", type: "PK_PART_B", desc: "Composite PK Part 2" },
    { name: 'courseName', label: "Course_Name", type: "DEP_ON_B", desc: "Depends ONLY on Course_ID" },
    { name: 'instructor', label: "Instructor", type: "DEP_ON_B", desc: "Depends ONLY on Course_ID" },
    { name: 'office', label: "Office", type: "DEP_ON_B_TRANS", desc: "Depends ONLY on Course_ID" },
    { name: 'grade', label: "Grade", type: "DEP_ON_BOTH", desc: "Depends on both IDs (Atomic)" }
  ];

  // Simulated 2NF isolated tables structures
  const tStudents = {
    name: "Students Dictionary [Table A]",
    pk: "Student_ID",
    rows: [
      { studentId: "S201", studentName: "Arthur Curry" },
      { studentId: "S202", studentName: "Arthur Curry" }, // Demonstrating different students with same name resolved by unique PK
      { studentId: "S203", studentName: "Diana Prince" }
    ]
  };

  const tCourses = {
    name: "Courses Catalog [Table B]",
    pk: "Course_ID",
    rows: [
      { courseId: "CS-101", courseName: "Intro to Algorithms", instructor: "Dr. Evelyn", office: "Room 401" },
      { courseId: "MATH-201", courseName: "Calculus III", instructor: "Prof. Chen", office: "Room 102" },
      { courseId: "PHYS-302", courseName: "Quantum Mechanics", instructor: "Dr. Evelyn", office: "Room 401" }
    ]
  };

  const tEnrollments = {
    name: "Enrollment Grades [Junction Table C]",
    pk: "Student_ID + Course_ID",
    rows: [
      { studentId: "S201", courseId: "CS-101", grade: "A-" },
      { studentId: "S201", courseId: "MATH-201", grade: "B+" },
      { studentId: "S202", courseId: "CS-101", grade: "B" },
      { studentId: "S203", courseId: "CS-101", grade: "A+" },
      { studentId: "S203", courseId: "PHYS-302", grade: "A" }
    ]
  };

  // Helper functions for class styling depending on pipeline phase
  const getColHeaderClass = (col: typeof rawColumns[0]) => {
    const isSelected = selectedColumn === col.name;
    const base = "px-4 py-3 text-[11px] font-mono font-bold uppercase border-b transition-all duration-200 text-left ";
    
    if (activePhase === 'highlight_pks') {
      if (col.name === 'studentId' || col.name === 'courseId') {
        return base + "bg-[#1A1A1A] text-white border-[#1A1A1A]";
      }
      return base + "bg-[#FAF9F5] text-[#8C8C88] border-[#E5E5E1] opacity-40";
    }

    if (activePhase === 'detect_partial') {
      if (col.name === 'studentName') {
        return base + "bg-[#F3EFE9] text-[#7A4F2A] border-[#7A4F2A]/20 ring-1 ring-[#7A4F2A]/30";
      }
      if (col.name === 'courseName' || col.name === 'instructor' || col.name === 'office') {
        return base + "bg-[#EAEBE7] text-[#4A4B45] border-[#4A4B45]/20 ring-1 ring-[#4A4B45]/30";
      }
      if (col.name === 'studentId' || col.name === 'courseId') {
        return base + "bg-[#FAF9F5] text-[#1A1A1A] border-[#1A1A1A] border-b-2";
      }
      return base + "bg-[#FAF9F5] text-[#8C8C88] border-[#E5E5E1] opacity-30";
    }

    // Default or idle style
    return base + (isSelected 
      ? 'bg-[#F7F7F3] text-black border-black' 
      : 'bg-[#F7F7F3] text-[#5F5F5B] border-[#E5E5E1]');
  };

  const getCellClass = (col: typeof rawColumns[0]) => {
    const isSelected = selectedColumn === col.name;
    const base = "px-4 py-2.5 text-xs border-b border-[#E5E5E1] transition-all duration-200 ";
    
    if (activePhase === 'highlight_pks') {
      if (col.name === 'studentId' || col.name === 'courseId') {
        return base + "bg-[#F7F7F3] text-[#1A1A1A] font-mono font-bold";
      }
      return base + "text-[#8C8C88] opacity-40";
    }

    if (activePhase === 'detect_partial') {
      if (col.name === 'studentName') {
        return base + "bg-[#FAF6F0] text-[#7A4F2A] font-medium border-l border-r border-[#7A4F2A]/10";
      }
      if (col.name === 'courseName' || col.name === 'instructor' || col.name === 'office') {
        return base + "bg-[#F1F2EF]/60 text-[#4A4B45] font-medium border-l border-r border-[#4A4B45]/10";
      }
      if (col.name === 'studentId' || col.name === 'courseId') {
        return base + "text-[#1A1A1A] font-mono";
      }
      return base + "text-[#8C8C88] opacity-30";
    }

    return base + (isSelected ? "bg-[#FAF9F5] font-semibold" : "text-[#1A1A1A]");
  };

  // Infographic database states data
  const infographicData = {
    '1NF': {
      title: "First Normal Form (1NF)",
      tagline: "Atomic Units & Absolute Identity",
      definition: "Requirements: Cells must have atomic values (no multiple entries, comma-separated lists, or nested records inside a column). Duplicate rows are banned, and every table must declare an unambiguous Primary Key (which can be a single or composite set of columns).",
      implementationSteps: [
        "Eliminate comma-separated attributes or multi-valued lists (e.g., parsing a 'phoneNumber' column into atomic singular items).",
        "Introduce repeating records in separate rows to store multi-valued arrays, or split them horizontally into logical entities.",
        "Add an explicit index column: establish unique primary keys (PK) to ensure every row of data is unique and addressable."
      ],
      advantages: [
        "Axe complex text-parsing algorithms (no need to string-split database fields to fetch structured indices).",
        "Enable native indexing structures and database engines to seek, retrieve, and filter records instantly.",
        "Axe unstructured duplicate entries to lay a safe foundation for database relations."
      ],
      scenarioBefore: {
        title: "Spreadsheet representation (UNF)",
        columns: ["Order_ID", "Date", "Items", "Costs"],
        rows: [
          { c0: "ORD-101", c1: "2026-05-28", c2: "Laptop, Mouse", c3: "$1200, $40" }
        ],
        badge: "❌ UNF (Repeating lists)",
        desc: "Item lists inside a single row cell are impossible to query cleanly."
      },
      scenarioAfter: {
        title: "1NF Conformance Result",
        columns: ["Order_ID*", "Date", "Line_Item_ID*", "Item", "Cost"],
        rows: [
          { c0: "ORD-101", c1: "2026-05-28", c2: "1", c3: "Laptop", c4: "$1200" },
          { c0: "ORD-101", c1: "2026-05-28", c2: "2", c3: "Mouse", c4: "$40" }
        ],
        badge: "✓ 1NF (Atomic rows, Compound PK)",
        desc: "Records split cleanly into distinct singular rows. PK is Order_ID + Line_Item_ID."
      }
    },
    '2NF': {
      title: "Second Normal Form (2NF)",
      tagline: "Total Dependencies on the Whole Key",
      definition: "Requirements: Must already fully conform to 1NF. All non-key attributes must depend on the complete candidacy primary key. It completely bans Partial Key Dependencies where attributes depend on only a partial subset of a composite primary index.",
      implementationSteps: [
        "Confirm the primary index is composite (if primary key is a single column, 2NF is automatically achieved).",
        "Analyze non-key attributes to see if they depend exclusively on part of the composite key (e.g., customer details relying only on customerId and not orderId).",
        "Slice those partial elements out into newly created entity lookups and link them back via logical Foreign Key relationships."
      ],
      advantages: [
        "Axe duplicate rows representing catalog facts. You only change a course name or customer phone number in one place.",
        "Resolve basic Update drift where editing a record in one row leaves its sister record corrupted.",
        "Substantially shrink the physical database storage page requirements on disk as values do not drag wide text strings repeating constantly."
      ],
      scenarioBefore: {
        title: "1NF Composite Table",
        columns: ["Order_ID*", "Line_ID*", "Product_ID", "Supplier", "Quantity"],
        rows: [
          { c0: "1001", c1: "1", c2: "P40", c3: "Samsung Corp", c4: "10" },
          { c0: "1002", c1: "1", c2: "P40", c3: "Samsung Corp", c4: "5" }
        ],
        badge: "❌ Contains Partial Dependencies",
        desc: "Product Supplier depends entirely on Product_ID alone, not the composite key Order_ID + Line_ID!"
      },
      scenarioAfter: {
        title: "2NF Conformed Schemata",
        columns: ["Product_ID*", "Supplier"],
        rows: [
          { c0: "P40", c1: "Samsung Corp" }
        ],
        extraTable: {
          title: "Order Details Listing",
          columns: ["Order_ID*", "Line_ID*", "Product_ID [FK]", "Quantity"],
          rows: [
            { c0: "1001", c1: "1", c2: "P40", c3: "10" },
            { c0: "1002", c1: "1", c2: "P40", c3: "5" }
          ]
        },
        badge: "✓ 2NF (Supplier info is decoupled)",
        desc: "The database is broken into separate Products and Line Item tables. Partial dependence is eliminated."
      }
    },
    '3NF': {
      title: "Third Normal Form (3NF)",
      tagline: "Exclusion of Transitive Indirect Keys",
      definition: "Requirements: Must conform to 2NF first. Banish Transitive Dependencies where a non-key column determines another non-key column. All attributes must rely on the key, the whole key, and nothing but the key, so help me Codd.",
      implementationSteps: [
        "Examine non-key columns to detect values that act as independent determinants (e.g., an office ID determining the department head).",
        "Identify if Column A determines Column B, and Column B determines Column C. This is a transitive relation (A -> C).",
        "Split the transitive relationship (B -> C) into its own isolated table, keeping only a foreign key reference in the master parent table."
      ],
      advantages: [
        "Accomplishes near-perfect transactional integrity. You can record lists of departments or groups without any associated employees.",
        "Completely erases Deletion drift where dropping a member unintentionally wipes associated structural lookup metadata.",
        "Provides pristine modular structural entities in accordance with strict object-oriented and relational database systems design."
      ],
      scenarioBefore: {
        title: "2NF Table with Transitive Relation",
        columns: ["Emp_ID*", "Home_ZIP", "City", "State"],
        rows: [
          { c0: "E101", c1: "94016", c2: "San Francisco", c3: "California" },
          { c0: "E102", c1: "94016", c2: "San Francisco", c3: "California" }
        ],
        badge: "❌ Transitive Dependency Error",
        desc: "City and State depend on Home_ZIP, which depends on Emp_ID (Emp_ID -> Home_ZIP -> City/State)."
      },
      scenarioAfter: {
        title: "3NF Schemata (Pruned Entities)",
        columns: ["Emp_ID*", "Home_ZIP [FK]"],
        rows: [
          { c0: "E101", c1: "94016" },
          { c0: "E102", c1: "94016" }
        ],
        extraTable: {
          title: "ZIP Code Records Table",
          columns: ["ZIP_Code*", "City", "State"],
          rows: [
            { c0: "94016", c1: "San Francisco", c2: "California" }
          ]
        },
        badge: "✓ 3NF (Pruned transitives)",
        desc: "City & State maps are stored cleanly in a standalone lookup. Updating a ZIP Code changes it on a single row."
      }
    }
  };

  return (
    <div className="space-y-12">
      {/* 1. VISUAL TRANSFORMATION 1NF TO 2NF */}
      <section className="bg-white border border-[#E5E5E1] p-6 rounded-none space-y-6">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-[#E5E5E1] pb-5">
          <div className="space-y-1">
            <span className="px-2 py-0.5 text-[9px] font-mono font-bold tracking-widest uppercase border border-[#1A1A1A] bg-[#FAF9F5] text-black">
              Interactive Schema Transformation
            </span>
            <h2 className="text-2xl font-serif italic text-[#1A1A1A] font-light pt-2">
              1NF to 2NF Decomposition Simulator
            </h2>
            <p className="text-xs text-[#5F5F5B] font-light max-w-4xl">
              Understand how composite key tables suffer from <strong className="text-[#1A1A1A] font-medium">Partial Key Dependencies</strong>, of which isolation is the singular solution. Select phases below to trace the analysis and trigger the physical decomposition.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0 bg-[#FAF9F5] p-1 border border-[#E5E5E1]">
            <button
              onClick={() => {
                setActivePhase('idle');
                setSelectedColumn(null);
              }}
              className={`p-1.5 rounded-none text-[10px] uppercase font-bold tracking-wider ${activePhase === 'idle' ? 'bg-[#1A1A1A] text-white' : 'text-[#8C8C88] hover:text-black'}`}
            >
              Reset
            </button>
            <span className="text-[#8C8C88] font-mono text-[9px]">|</span>
            <button
              onClick={() => {
                const nextMap: Record<StepPhase, StepPhase> = {
                  idle: 'highlight_pks',
                  highlight_pks: 'detect_partial',
                  detect_partial: 'resolve_2nf',
                  resolve_2nf: 'idle'
                };
                setActivePhase(nextMap[activePhase]);
              }}
              className="p-1.5 bg-[#1A1A1A] hover:bg-[#333333] text-white rounded-none text-[10px] uppercase font-bold tracking-wider flex items-center"
            >
              Next Step
              <Icons.ChevronRight className="w-3 h-3 ml-1" />
            </button>
          </div>
        </div>

        {/* Dynamic Timeline tracker */}
        <div className="grid grid-cols-4 border border-[#E5E5E1] bg-[#FAF9F5]/40 text-center text-xs">
          {[
            { phase: 'idle', label: '1. Flat 1NF Row' },
            { phase: 'highlight_pks', label: '2. Isolate Key' },
            { phase: 'detect_partial', label: '3. Trace Damage' },
            { phase: 'resolve_2nf', label: '4. Split to 2NF' }
          ].map((item, idx) => {
            const isPassedOrActive = 
              (activePhase === 'idle' && idx === 0) ||
              (activePhase === 'highlight_pks' && idx <= 1) ||
              (activePhase === 'detect_partial' && idx <= 2) ||
              (activePhase === 'resolve_2nf' && idx <= 3);

            return (
              <button
                key={item.phase}
                onClick={() => {
                  setActivePhase(item.phase as StepPhase);
                  setSelectedColumn(null);
                }}
                className={`py-3 font-mono text-[9px] uppercase tracking-wider font-bold border-r border-[#E5E5E1] last:border-r-0 transition-all ${
                  activePhase === item.phase 
                    ? 'bg-[#1A1A1A] text-white' 
                    : isPassedOrActive 
                      ? 'text-[#1A1A1A] bg-white border-b-2 border-[#1A1A1A]' 
                      : 'text-[#8C8C88] hover:bg-[#FDFDFB]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Phase Context Board */}
        <div className="p-5 border border-[#1A1A1A] bg-white flex flex-col md:flex-row gap-5 items-start">
          <div className="p-3 bg-[#FAF9F5] border border-[#E5E5E1] flex items-center justify-center shrink-0">
            {activePhase === 'idle' && <Icons.Table className="w-8 h-8 text-[#1A1A1A]" />}
            {activePhase === 'highlight_pks' && <Icons.KeySquare className="w-8 h-8 text-[#1A1A1A]" />}
            {activePhase === 'detect_partial' && <Icons.SearchCode className="w-8 h-8 text-[#7A4F2A] animate-pulse" />}
            {activePhase === 'resolve_2nf' && <Icons.FolderHeart className="w-8 h-8 text-emerald-600" />}
          </div>
          <div className="space-y-1">
            <h3 className="font-serif italic font-medium text-lg text-black">
              {phaseDescriptions[activePhase].title}
            </h3>
            <p className="text-[10px] font-mono tracking-widest text-[#8C8C88] uppercase">
              {phaseDescriptions[activePhase].subtitle}
            </p>
            <p className="text-xs text-[#5F5F5B] leading-relaxed pt-2 font-light select-none">
              {phaseDescriptions[activePhase].explanation}
            </p>
          </div>
        </div>

        {/* Interactive Layout Render Box */}
        <div className="min-h-96 relative border border-[#E5E5E1] p-4 sm:p-6 bg-[#FAF9F5]/40 flex flex-col items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            {activePhase !== 'resolve_2nf' ? (
              <motion.div
                key="one-table"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="w-full space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif italic font-light text-sm text-[#1A1A1A]">
                    Source Table: <span className="font-mono not-italic text-xs font-bold font-sans bg-white border border-[#E5E5E1] px-2 py-0.5 ml-1 inline-block">Enrollments_1NF</span>
                  </span>
                  <span className="text-[9px] font-mono text-[#8C8C88] font-bold uppercase select-none">
                    Status: Violates 2NF (Contains Redundancies) 
                  </span>
                </div>

                <div className="overflow-x-auto border-2 border-[#1A1A1A] bg-white">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr>
                        {rawColumns.map((col) => (
                          <th
                            key={col.name}
                            className={getColHeaderClass(col)}
                            onMouseEnter={() => setSelectedColumn(col.name)}
                            onMouseLeave={() => setSelectedColumn(null)}
                          >
                            <div className="flex flex-col relative">
                              <span className="flex items-center select-none">
                                {col.label}
                                {activePhase === 'highlight_pks' && (col.name === 'studentId' || col.name === 'courseId') && (
                                  <span className="ml-1 px-1 text-[7px] font-mono bg-white text-black border border-black font-bold">KEY</span>
                                )}
                              </span>
                              {activePhase === 'detect_partial' && col.type.startsWith('DEP_ON_') && (
                                <span className="absolute -bottom-1 left-0 text-[8px] font-bold text-red-900 bg-white border border-red-200 px-1 transform translate-y-3 shrink-0 font-mono">
                                  {col.name === 'grade' ? '✓ FULL' : '❌ PART'}
                                </span>
                              )}
                              <span className="text-[9px] font-normal text-[#8C8C88] tracking-normal mt-1 opacity-70">
                                {col.desc}
                              </span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rawTableRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-[#FAF9F5]/40 divide-y divide-[#E5E5E1]">
                          {rawColumns.map((col) => (
                            <td
                              key={col.name}
                              className={getCellClass(col)}
                              onMouseEnter={() => setSelectedColumn(col.name)}
                              onMouseLeave={() => setSelectedColumn(null)}
                            >
                              {(row as any)[col.name]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Annotation lines & overlay diagrams during partial keys phase */}
                {activePhase === 'detect_partial' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-[#FAF0F0] bg-[#FFFBFB] p-4 text-xs font-sans text-[#7A4F2A]"
                  >
                    <div className="space-y-1 bg-white p-3 border border-[#EFA8A8]/30">
                      <p className="font-bold uppercase tracking-wider text-[10px] text-red-950 flex items-center">
                        <Icons.ArrowRight className="w-3.5 h-3.5 mr-1" /> Partial Dependency #1
                      </p>
                      <p className="font-mono text-[11px] font-bold mt-1 text-[#1A1A1A]">Student_ID (Part Key) → Student_Name</p>
                      <p className="text-[11px] text-[#5F5F5B] leading-normal font-light mt-1">
                        Student_Name changes only when Student_ID changes, completely unaffected by Course_ID. It is a partial key dependent.
                      </p>
                    </div>

                    <div className="space-y-1 bg-white p-3 border border-[#EFA8A8]/30">
                      <p className="font-bold uppercase tracking-wider text-[10px] text-red-950 flex items-center">
                        <Icons.ArrowRight className="w-3.5 h-3.5 mr-1" /> Partial Dependency #2
                      </p>
                      <p className="font-mono text-[11px] font-bold mt-1 text-[#1A1A1A]">Course_ID (Part Key) → Course_Name, Instructor</p>
                      <p className="text-[11px] text-[#5F5F5B] leading-normal font-light mt-1">
                        Course titles and teaching instructors depend purely on Course_ID, rendering duplication across multiple student rows.
                      </p>
                    </div>

                    <div className="space-y-1 bg-[#FAFDFB] p-3 border border-emerald-100 text-emerald-950">
                      <p className="font-bold uppercase tracking-wider text-[10px] text-emerald-900 flex items-center">
                        <Icons.Check className="w-3.5 h-3.5 mr-1" /> Fully Dependent Attribute
                      </p>
                      <p className="font-mono text-[11px] font-bold mt-1 text-[#1A1A1A]">{`{Student_ID, Course_ID}`} → Grade</p>
                      <p className="text-[11px] text-[#5F5F5B] leading-normal font-light mt-1">
                        Grade relates strictly to a specific Student in a specific Course. It depends on the WHOLE primary key and does not violate 2NF!
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="three-tables"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="w-full space-y-6"
              >
                <div className="flex items-center justify-between border-b border-[#E5E5E1] pb-2">
                  <span className="font-serif italic font-semibold text-sm text-[#1A1A1A] flex items-center">
                    <Icons.ShieldCheck className="w-4 h-4 text-emerald-600 mr-2" />
                    Decomposed State: Complete 2NF Conformance
                  </span>
                  <span className="text-[9px] font-mono text-emerald-700 bg-[#FAFDFB] border border-emerald-300 px-2 py-0.5 font-bold uppercase">
                    Status: Zero Redundant Entities
                  </span>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Table A: Students */}
                  <div className="bg-white border-2 border-slate-900 overflow-hidden flex flex-col">
                    <div className="bg-[#FAF9F5] px-4 py-2 border-b border-[#E5E5E1] flex items-center justify-between">
                      <h4 className="font-serif italic text-xs font-bold text-black">{tStudents.name}</h4>
                      <span className="text-[8px] font-mono bg-black text-white px-1.5 py-0.5">PK: {tStudents.pk}</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#FAF9F5] divide-y divide-[#E5E5E1]">
                            <th className="px-3 py-2 text-[10px] font-mono font-bold text-[#1A1A1A]">Student_ID (PK)</th>
                            <th className="px-3 py-2 text-[10px] font-sans font-medium text-[#5F5F5B]">Student_Name</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E5E1]">
                          {tStudents.rows.map((row, i) => (
                            <tr key={i} className="hover:bg-[#FAF9F5]">
                              <td className="px-3 py-2 text-xs font-mono font-semibold text-black">{row.studentId}</td>
                              <td className="px-3 py-2 text-xs text-[#5F5F5B]">{row.studentName}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="p-2.5 bg-[#FAF9F5]/30 mt-auto border-t border-[#E5E5E1] text-[10px] text-[#8C8C88]">
                      Each unique student is registered only once. Name changes occur on exactly one record.
                    </div>
                  </div>

                  {/* Table B: Courses */}
                  <div className="bg-white border-2 border-slate-900 overflow-hidden flex flex-col">
                    <div className="bg-[#FAF9F5] px-4 py-2 border-b border-[#E5E5E1] flex items-center justify-between">
                      <h4 className="font-serif italic text-xs font-bold text-black">{tCourses.name}</h4>
                      <span className="text-[8px] font-mono bg-black text-white px-1.5 py-0.5">PK: {tCourses.pk}</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#FAF9F5]/80 divide-y divide-[#E5E5E1]">
                            <th className="px-3 py-2 text-[10px] font-mono font-bold text-[#1A1A1A]">Course_ID (PK)</th>
                            <th className="px-3 py-2 text-[10px] font-sans font-medium text-[#5F5F5B]">Course_Name</th>
                            <th className="px-3 py-2 text-[10px] font-sans font-medium text-[#5F5F5B]">Instructor</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E5E1]">
                          {tCourses.rows.map((row, i) => (
                            <tr key={i} className="hover:bg-[#FAF9F5]">
                              <td className="px-3 py-2 text-xs font-mono font-semibold text-black">{row.courseId}</td>
                              <td className="px-3 py-2 text-xs text-[#5F5F5B] truncate max-w-[100px]">{row.courseName}</td>
                              <td className="px-3 py-2 text-xs text-[#5F5F5B] font-light">{row.instructor}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="p-2.5 bg-[#FAF9F5]/30 mt-auto border-t border-[#E5E5E1] text-[10px] text-[#8C8C88]">
                      Class syllabus catalogs are independent. New courses can exist with zero enrollees.
                    </div>
                  </div>

                  {/* Table C: Enrollments Junction */}
                  <div className="bg-white border-2 border-slate-900 overflow-hidden flex flex-col">
                    <div className="bg-[#FAF9F5] px-4 py-2 border-b border-[#E5E5E1] flex items-center justify-between">
                      <h4 className="font-serif italic text-xs font-bold text-black">{tEnrollments.name}</h4>
                      <span className="text-[8px] font-mono bg-emerald-600 text-white px-1.5 py-0.5 font-bold uppercase">PK: Composite</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#FAF9F5]/80 divide-y divide-[#E5E5E1]">
                            <th className="px-2 py-2 text-[10px] font-mono font-bold text-black">Student_ID (FK)</th>
                            <th className="px-2 py-2 text-[10px] font-mono font-bold text-black">Course_ID (FK)</th>
                            <th className="px-2 py-2 text-[10px] font-sans font-bold text-emerald-800">Grade</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E5E1]">
                          {tEnrollments.rows.map((row, i) => (
                            <tr key={i} className="hover:bg-[#FAF9F5]">
                              <td className="px-2 py-2 text-xs font-mono text-[#5F5F5B]">{row.studentId}</td>
                              <td className="px-2 py-2 text-xs font-mono text-[#5F5F5B]">{row.courseId}</td>
                              <td className="px-2 py-2 text-xs font-bold text-emerald-700 font-sans">{row.grade}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="p-2.5 bg-[#FAF9F5]/30 mt-auto border-t border-[#E5E5E1] text-[10px] text-[#8C8C88]">
                      Junction table mapping IDs. The attribute 'Grade' depends cleanly on both. No redundant text names stored.
                    </div>
                  </div>
                </div>

                {/* Explanatory summary of transition to 2NF */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FAF9F5]/40 p-4 border border-[#E5E5E1] text-xs font-sans text-[#5F5F5B]">
                  <div className="space-y-1">
                    <h5 className="font-bold text-[#1A1A1A] uppercase tracking-wide text-[10px]">What changed structurally?</h5>
                    <p className="font-light leading-relaxed">
                      We disintegrated the wide <code className="bg-white border border-[#E5E5E1] px-1 py-0.5 rounded-sm font-mono text-[10px]">Enrollments_1NF</code> table and mapped its contents across three primary schemas. No composite primary key suffers from unresolved partial dependents.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-[#1A1A1A] uppercase tracking-wide text-[10px]">Strategic Advantages of 2NF here:</h5>
                    <p className="font-light leading-relaxed">
                      If student Arthur Curry (<code className="font-mono text-[11px]">S201</code>) updates his name, we write only <strong className="text-black font-semibold">one row</strong> in Table A. In the original 1NF construct, we would have been forced to write multiple rows, risking sync drift errors.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 2. DYNAMIC COMPASS COMPARISON AND INFOGRAPHIC INFRASTRUCTURE */}
      <section className="bg-white border border-[#E5E5E1] p-6 rounded-none space-y-6">
        <div className="border-b border-[#E5E5E1] pb-5 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
          <div className="space-y-1">
            <span className="px-2 py-0.5 text-[9px] font-mono font-bold tracking-widest uppercase border border-[#1A1A1A] bg-[#FAF9F5] text-black">
              Comparative Monograph Infographic
            </span>
            <h2 className="text-2xl font-serif italic text-[#1A1A1A] font-light pt-2">
              The Normalization Forms Blueprint
            </h2>
            <p className="text-xs text-[#5F5F5B] font-light">
              Interactive structural playbook mapping the architectural goals, strategic benefits, implementation rules, and conformed lookup schemas for 1NF, 2NF, and 3NF.
            </p>
          </div>

          <div className="grid grid-cols-3 bg-[#FAF9F5] p-1 border border-[#E5E5E1] w-full md:w-auto max-w-sm rounded-none">
            {(['1NF', '2NF', '3NF'] as const).map((form) => {
              const isActive = infographicForm === form;
              return (
                <button
                  key={form}
                  onClick={() => setInfographicForm(form)}
                  className={`py-1.5 px-3 text-xs font-bold transition-all border border-transparent ${
                    isActive
                      ? 'bg-[#1A1A1A] text-white'
                      : 'text-[#5F5F5B] hover:text-[#1A1A1A] hover:bg-[#F1F1ED]'
                  }`}
                >
                  {form} Blueprint
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Infographic Layout Board */}
        <AnimatePresence mode="wait">
          <motion.div
            key={infographicForm}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Playbook Metadata Column (6 cols wide) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Box 1: Core Target Definition */}
              <div className="bg-[#FAF9F5] p-5 border border-[#E5E5E1] space-y-3">
                <div className="flex items-center space-x-2.5">
                  <span className="p-1.5 bg-[#1A1A1A] text-white text-[11px] font-mono font-bold">
                    {infographicForm}
                  </span>
                  <h3 className="text-lg font-serif italic text-black">
                    {infographicData[infographicForm].title}
                  </h3>
                </div>
                <p className="text-[10px] font-mono tracking-widest text-[#8C8C88] uppercase">
                  {infographicData[infographicForm].tagline}
                </p>
                <p className="text-xs text-[#5F5F5B] leading-relaxed font-light">
                  {infographicData[infographicForm].definition}
                </p>
              </div>

              {/* Box 2: How to Implement (Detailed Blueprint checklist) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-[0.15em] flex items-center font-sans">
                  <Icons.KeyRound className="w-3.5 h-3.5 mr-2" />
                  Engineering Implementation Checklist
                </h4>
                <div className="space-y-3">
                  {infographicData[infographicForm].implementationSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start text-xs bg-white border border-[#E5E5E1] p-3.5 rounded-none">
                      <span className="font-mono text-[10px] font-bold text-[#8C8C88] mr-3 mt-0.5 bg-[#FAF9F5] border border-[#E5E5E1] w-5 h-5 flex items-center justify-center shrink-0">
                        0{idx + 1}
                      </span>
                      <p className="text-[#5F5F5B] leading-relaxed font-light">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 3: Strategic Advantages & Performance */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-[0.15em] flex items-center font-sans">
                  <Icons.FlameKindling className="w-3.5 h-3.5 mr-2 text-rose-700" />
                  Strategic Core Advantages
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {infographicData[infographicForm].advantages.map((advantage, index) => (
                    <div key={index} className="bg-white border border-[#E5E5E1] p-4 text-[11px] text-[#5F5F5B] flex flex-col justify-between">
                      <Icons.CheckCircle2 className="w-4 h-4 text-[#1A1A1A] mb-2 shrink-0" />
                      <p className="font-light leading-relaxed">{advantage}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual Schema comparison illustration Column (5 cols wide) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#FAF9F5]/30 border border-[#E5E5E1] p-5 space-y-6 flex flex-col h-full justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-[0.15em] mb-4 font-sans border-b border-[#E5E5E1] pb-2 text-center">
                    Visual Entity Schema Layouts
                  </h4>

                  {/* Schema State: BEFORE CONFORMANCE */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A4F2A] bg-[#FAF6F0] border border-[#DFAFA0]/40 px-2 py-0.5">
                        {infographicForm === '1NF' ? 'UNSTRUCTURED INPUT' : 'VULNERABLE STATE'}
                      </span>
                      <span className="text-[9px] font-mono text-[#8C8C88]">{infographicData[infographicForm].scenarioBefore.badge}</span>
                    </div>

                    <div className="bg-white border border-[#E5E5E1] overflow-hidden">
                      <div className="bg-red-50/20 px-3 py-1.5 border-b border-[#E5E5E1]">
                        <p className="font-serif italic text-xs text-red-950 font-bold">{infographicData[infographicForm].scenarioBefore.title}</p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono text-[10px]">
                          <thead>
                            <tr className="bg-[#FAF9F5]">
                              {infographicData[infographicForm].scenarioBefore.columns.map((c, i) => (
                                <th key={i} className="px-2.5 py-1.5 border-b border-[#E5E5E1] font-bold text-[#1A1A1A]">{c}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {infographicData[infographicForm].scenarioBefore.rows.map((row, i) => (
                              <tr key={i} className="bg-white text-[#5F5F5B]">
                                {Object.values(row).map((val, idx) => (
                                  <td key={idx} className="px-2.5 py-1.5 border-b border-[#E5E5E1] whitespace-nowrap">{val}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#7A4F2A] italic leading-normal font-light">
                      * {infographicData[infographicForm].scenarioBefore.desc}
                    </p>
                  </div>

                  {/* Visual transition separator divider mapping arrow */}
                  <div className="my-5 flex items-center justify-center">
                    <div className="h-px bg-[#E5E5E1] flex-1"></div>
                    <div className="mx-3.5 p-1 bg-white border border-[#1A1A1A] rounded-full">
                      <Icons.TrendingDown className="w-4 h-4 text-emerald-600 animate-bounce" />
                    </div>
                    <div className="h-px bg-[#E5E5E1] flex-1"></div>
                  </div>

                  {/* Schema State: AFTER CONFORMANCE */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-[#FAFDFB] border border-emerald-300 px-2 py-0.5">
                        CONFORMED DATABASE STATE
                      </span>
                      <span className="text-[9px] font-mono text-emerald-700">{infographicData[infographicForm].scenarioAfter.badge}</span>
                    </div>

                    {/* Table After 1 */}
                    <div className="bg-white border border-[#E5E5E1] overflow-hidden">
                      <div className="bg-emerald-50/20 px-3 py-1.5 border-b border-[#E5E5E1]">
                        <p className="font-serif italic text-xs text-emerald-950 font-bold">{infographicData[infographicForm].scenarioAfter.title}</p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono text-[10px]">
                          <thead>
                            <tr className="bg-[#FAF9F5]">
                              {infographicData[infographicForm].scenarioAfter.columns.map((c, i) => (
                                <th key={i} className="px-2.5 py-1.5 border-b border-[#E5E5E1] font-bold text-[#1A1A1A]">{c}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {infographicData[infographicForm].scenarioAfter.rows.map((row, i) => (
                              <tr key={i} className="bg-white text-[#5F5F5B]">
                                {Object.values(row).map((val, idx) => (
                                  <td key={idx} className="px-2.5 py-1.5 border-b border-[#E5E5E1] whitespace-nowrap">{val}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Optional table after 2 for 2NF/3NF layouts */}
                    {infographicData[infographicForm].scenarioAfter.extraTable && (
                      <div className="bg-white border border-[#E5E5E1] overflow-hidden">
                        <div className="bg-emerald-50/20 px-3 py-1.5 border-b border-[#E5E5E1]">
                          <p className="font-serif italic text-xs text-emerald-950 font-bold">
                            {infographicData[infographicForm].scenarioAfter.extraTable.title}
                          </p>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left font-mono text-[10px]">
                            <thead>
                              <tr className="bg-[#FAF9F5]">
                                {infographicData[infographicForm].scenarioAfter.extraTable.columns.map((c, i) => (
                                  <th key={i} className="px-2.5 py-1.5 border-b border-[#E5E5E1] font-bold text-[#1A1A1A]">{c}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {infographicData[infographicForm].scenarioAfter.extraTable.rows.map((row, i) => (
                                <tr key={i} className="bg-white text-[#5F5F5B]">
                                  {Object.values(row).map((val, idx) => (
                                    <td key={idx} className="px-2.5 py-1.5 border-b border-[#E5E5E1] whitespace-nowrap">{val}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    <p className="text-[11px] text-[#5F5F5B] leading-relaxed font-light">
                      {infographicData[infographicForm].scenarioAfter.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E5E5E1] text-[10px] italic text-[#8C8C88] leading-relaxed">
                  Notice how entity decoupling splits wide, redundant databases into single-purpose lookup dictionaries connected securely via foreign indexes.
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}
