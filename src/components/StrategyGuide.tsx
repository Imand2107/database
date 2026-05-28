import React, { useState } from 'react';
import * as Icons from 'lucide-react';

interface StrategyStep {
  form: string;
  title: string;
  objective: string;
  howTo: string[];
  example: string;
}

export default function StrategyGuide() {
  const [symptomHasLists, setSymptomHasLists] = useState(false);
  const [symptomHasNoPK, setSymptomHasNoPK] = useState(false);
  const [symptomCompositeKey, setSymptomCompositeKey] = useState(false);
  const [symptomPartKeyDep, setSymptomPartKeyDep] = useState(false);
  const [symptomNonKeyDep, setSymptomNonKeyDep] = useState(false);

  // Normalization logic check based on answers
  const getDiagnosis = () => {
    if (symptomHasLists || symptomHasNoPK) {
      return {
        violates: '1NF (First Normal Form)',
        status: 'error',
        desc: 'Your database has non-atomic values or lacks a clear row identifier.',
        steps: [
          'Introduce a primary key (often a compound key made of multiple IDs) to define every single record uniquely.',
          'Explode lists or comma-separated rows. Clone structural header details onto separate rows so that every individual cell holds exactly one single value.'
        ]
      };
    }
    if (symptomCompositeKey && symptomPartKeyDep) {
      return {
        violates: '2NF (Second Normal Form)',
        status: 'warning',
        desc: 'You have a composite primary key, but key aspects don\'t depend on the complete key.',
        steps: [
          'Create distinct parent tables to isolate attributes that depend only on part of the compound key.',
          'Leave only attributes that depend fully on both columns in your junction table.'
        ]
      };
    }
    if (symptomNonKeyDep) {
      return {
        violates: '3NF (Third Normal Form)',
        status: 'warning',
        desc: 'A non-key attribute dictates another non-key attribute (transitive dependency).',
        steps: [
          'Separate the dependency chain. Make the intermediate determinant a primary key in a new independent table.',
          'Keep a foreign key reference in the original table pointing to the new table.'
        ]
      };
    }

    return {
      violates: 'None! Highly Robust Architecture',
      status: 'success',
      desc: 'Congratulations! Your symptoms indicate your database schema meets 3NF guidelines.',
      steps: [
        'Prised for production OLTP queries!',
        'No insert, delete, or update anomalies can break your records structural integrity.'
      ]
    };
  };

  const diagnosis = getDiagnosis();

  const strategies: StrategyStep[] = [
    {
      form: '1NF',
      title: 'Attaining First Normal Form (1NF)',
      objective: 'Guarantee Atomicity & Keys',
      howTo: [
        'Eliminate repeating groups and non-atomic values (like comma-separated arrays).',
        'Create a separate row for each individual item within the array.',
        'Define a clear Primary Key (often composite, e.g., Order_ID + Item_ID) so each row is unique.'
      ],
      example: 'Instead of storing "CS-101, MATH-220" under Course_Code, duplicate the student with one row for "CS-101" and one for "MATH-220".'
    },
    {
      form: '2NF',
      title: 'Attaining Second Normal Form (2NF)',
      objective: 'Eliminate Partial Key Dependencies',
      howTo: [
        'Confirm the schema is already in 1NF.',
        'If the PK is composite, examine every non-key column: Does it rely on the FULL primary key, or only part of it?',
        'If it relies on only part of the key (a subset), move those columns to a brand new table with that subset column as the PK.'
      ],
      example: 'In student enrollment (Student_ID, Course_Code -> Grade, Student_Name, Course_Title), Student_Name relies only on Student_ID. Move Student_Name to a distinct Students table.'
    },
    {
      form: '3NF',
      title: 'Attaining Third Normal Form (3NF)',
      objective: 'Eliminate Transitive (Non-Key) Dependencies',
      howTo: [
        'Confirm the schema is already in 2NF.',
        'Examine relationships among non-key columns: Does Column B depend on Column A (which is not a primary or candidate key)?',
        'If A -> B, split them into a separate lookup table with A as the primary key. Leave A in the parent table as a Foreign Key.'
      ],
      example: 'In Courses (Course_Code -> Instructor_ID -> Instructor_Phone), Instructor_Phone depends on Instructor_ID, which is non-key. Move them to an Instructors table.'
    }
  ];

  return (
    <div className="space-y-10">
      {/* Visual Roadmap Workflow */}
      <div className="bg-white border border-[#E5E5E1] p-6 rounded-none">
        <h3 className="text-xl font-serif italic font-light text-[#1A1A1A] flex items-center">
          <Icons.Workflow className="w-4 h-4 text-[#1A1A1A] mr-2.5" />
          The Normalization Hand-off Blueprint
        </h3>
        <p className="text-xs text-[#5F5F5B] font-light mt-1.5">
          Follow this proven step-by-step methodology when transforming raw databases into highly normalized structures.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 relative">
          {strategies.map((strat, idx) => (
            <div key={strat.form} className="bg-[#FAF9F5] p-5 border border-[#E5E5E1] flex flex-col relative rounded-none">
              {/* Connector element instead of raw arrow */}
              {idx < 2 && (
                <div className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-2 h-2 rounded-full border border-[#1A1A1A] bg-[#1A1A1A]">
                </div>
              )}
              
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#E5E5E1]">
                <span className="font-serif italic text-2xl font-light text-[#8C8C88]">0{idx + 1}.</span>
                <span className="px-2 py-0.5 border border-[#1A1A1A] bg-[#1A1A1A] text-white font-bold text-[9px] rounded-none uppercase tracking-wider">
                  {strat.form}
                </span>
              </div>

              <h4 className="font-bold text-[#1A1A1A] text-xs uppercase tracking-wide mb-1 leading-snug">{strat.title}</h4>
              <p className="text-[10px] font-mono tracking-widest text-[#8C8C88] uppercase mb-4">{strat.objective}</p>
              
              <ul className="text-xs text-[#5F5F5B] space-y-2.5 mb-5 leading-relaxed font-light font-sans">
                {strat.howTo.map((instruction, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[#1A1A1A] mr-2 shrink-0">—</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto bg-white p-3.5 border border-[#E5E5E1] text-xs rounded-none font-sans">
                <span className="font-bold text-[#1A1A1A] uppercase tracking-wider text-[9px] block mb-1">Scenario Example:</span>
                <p className="text-[#5F5F5B] font-light leading-relaxed italic">"{strat.example}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Symptom Checker Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 font-sans">
        <div className="bg-[#FAF9F5] border border-[#E5E5E1] p-6 lg:col-span-2 space-y-5 rounded-none">
          <div>
            <span className="text-[9px] font-mono uppercase font-bold tracking-widest border border-[#1A1A1A] text-[#1A1A1A] bg-white px-2 py-0.5">
              Symptom Estimator
            </span>
            <h3 className="text-lg font-serif italic text-[#1A1A1A] mt-3">Personal DB Diagnostic Tool</h3>
            <p className="text-xs text-[#5F5F5B] font-light">Toggle attributes of your current schema to generate targeted treatment strategies</p>
          </div>

          <div className="space-y-3 pt-1">
            <label className="flex items-start p-3 bg-white border border-[#E5E5E1] cursor-pointer hover:border-[#1A1A1A] transition duration-150">
              <input 
                type="checkbox" 
                checked={symptomHasLists}
                onChange={(e) => setSymptomHasLists(e.target.checked)}
                className="w-4 h-4 text-[#1A1A1A] rounded-none border-[#E5E5E1] mr-3 mt-1 accent-[#1A1A1A]"
              />
              <div className="text-xs">
                <p className="font-bold text-[#1A1A1A]">Multi-valued columns</p>
                <p className="text-[10px] text-[#5F5F5B] font-light leading-normal mt-0.5">Cells containing comma-separated lists or JSON array segments.</p>
              </div>
            </label>

            <label className="flex items-start p-3 bg-white border border-[#E5E5E1] cursor-pointer hover:border-[#1A1A1A] transition duration-150">
              <input 
                type="checkbox" 
                checked={symptomHasNoPK}
                onChange={(e) => setSymptomHasNoPK(e.target.checked)}
                className="w-4 h-4 text-[#1A1A1A] rounded-none border-[#E5E5E1] mr-3 mt-1 accent-[#1A1A1A]"
              />
              <div className="text-xs">
                <p className="font-bold text-[#1A1A1A]">No primary keys</p>
                <p className="text-[10px] text-[#5F5F5B] font-light leading-normal mt-0.5">Rows lack any combined columns safeguarding unique indices.</p>
              </div>
            </label>

            <label className="flex items-start p-3 bg-white border border-[#E5E5E1] cursor-pointer hover:border-[#1A1A1A] transition duration-150">
              <input 
                type="checkbox" 
                checked={symptomCompositeKey}
                onChange={(e) => setSymptomCompositeKey(e.target.checked)}
                className="w-4 h-4 text-[#1A1A1A] rounded-none border-[#E5E5E1] mr-3 mt-1 accent-[#1A1A1A]"
              />
              <div className="text-xs">
                <p className="font-bold text-[#1A1A1A]">Uses composite keys</p>
                <p className="text-[10px] text-[#5F5F5B] font-light leading-normal mt-0.5">The primary index is constructed from multiple combined table assets.</p>
              </div>
            </label>

            <label className={`flex items-start p-3 bg-white border cursor-pointer hover:border-[#1A1A1A] transition duration-150 ${!symptomCompositeKey ? 'opacity-40 select-none' : 'border-[#E5E5E1]'}`}>
              <input 
                type="checkbox" 
                checked={symptomPartKeyDep}
                onChange={(e) => setSymptomPartKeyDep(e.target.checked)}
                disabled={!symptomCompositeKey}
                className="disabled:opacity-40 w-4 h-4 text-[#1A1A1A] rounded-none border-[#E5E5E1] mr-3 mt-1 accent-[#1A1A1A]"
              />
              <div className="text-xs">
                <p className="font-bold text-[#1A1A1A]">Partial Key Dependencies</p>
                <p className="text-[10px] text-[#5F5F5B] font-light leading-normal mt-0.5">A target column depends only on part of the composite primary key.</p>
              </div>
            </label>

            <label className="flex items-start p-3 bg-white border border-[#E5E5E1] cursor-pointer hover:border-[#1A1A1A] transition duration-150">
              <input 
                type="checkbox" 
                checked={symptomNonKeyDep}
                onChange={(e) => setSymptomNonKeyDep(e.target.checked)}
                className="w-4 h-4 text-[#1A1A1A] rounded-none border-[#E5E5E1] mr-3 mt-1 accent-[#1A1A1A]"
              />
              <div className="text-xs">
                <p className="font-bold text-[#1A1A1A]">Transitive Relationships</p>
                <p className="text-[10px] text-[#5F5F5B] font-light leading-normal mt-0.5">An ordinary column dictates another ordinary non-key column.</p>
              </div>
            </label>
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col justify-start font-sans">
          <div className="bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] p-6 space-y-5 h-full rounded-none">
            <div>
              <span className="text-[9px] font-mono uppercase font-bold tracking-widest text-[#1A1A1A] bg-[#F7F7F3] border border-[#E5E5E1] px-2 py-0.5">
                Diagnostic Output
              </span>
              <h4 className="text-base font-serif font-light text-[#1A1A1A] italic mt-3 flex items-center">
                <Icons.Terminal className="w-4 h-4 mr-2" /> Current Violation Assessment
              </h4>
            </div>

            <div className="bg-[#F7F7F3] p-4.5 border border-[#E5E5E1]">
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${diagnosis.status === 'success' ? 'bg-emerald-600' : 'bg-[#1A1A1A]'}`}></span>
                <span className="text-[9px] font-mono font-bold text-[#8C8C88] uppercase tracking-widest">Active State</span>
              </div>
              <p className="text-[15px] font-bold text-[#1A1A1A] uppercase tracking-wide mt-2 font-mono">{diagnosis.violates}</p>
              <p className="text-xs text-[#5F5F5B] font-light mt-1 leading-relaxed">{diagnosis.desc}</p>
            </div>

            <div className="space-y-2.5">
              <h5 className="text-[10px] uppercase font-bold text-[#8C8C88] tracking-widest font-mono">Strategy treatment checklist:</h5>
              {diagnosis.steps.map((st, i) => (
                <div key={i} className="flex items-start text-xs p-3 bg-[#FDFDFB] border border-[#E5E5E1]">
                  <Icons.Compass className="w-4 h-4 text-[#8C8C88] mr-2.5 shrink-0" />
                  <span className="text-[#1A1A1A] font-light leading-relaxed">{st}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 text-[10px] italic text-[#8C8C88] border-t border-[#E5E5E1] font-light">
              *Parameters are evaluated dynamically. Observe the normalization recommendations compiled for database restructuring.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
