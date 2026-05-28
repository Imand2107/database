import React, { useState } from 'react';
import { SCENARIOS } from '../data/scenarios';
import { NormalForm, TableData, Column } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';

export default function Playground() {
  const [selectedScenarioId, setSelectedScenarioId] = useState('university');
  const [activeForm, setActiveForm] = useState<NormalForm>('UNF');
  const [activeAnomalySimulation, setActiveAnomalySimulation] = useState<string | null>(null);
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);

  const scenario = SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[0];
  const step = scenario.steps[activeForm];

  // Dynamic icon helper
  const renderIcon = (name: string, className = "w-5 h-5") => {
    const IconComponent = (Icons as any)[name];
    return IconComponent ? <IconComponent className={className} /> : <Icons.Database className={className} />;
  };

  const formsList: { form: NormalForm; label: string; desc: string }[] = [
    { form: 'UNF', label: 'UNF', desc: 'Unnormalized Raw Data' },
    { form: '1NF', label: '1NF', desc: 'Atomic & Keys' },
    { form: '2NF', label: '2NF', desc: 'No Partial Key Deps' },
    { form: '3NF', label: '3NF', desc: 'No Transitive Deps' },
  ];

  // Style class helper for table columns depending on their role
  const getColumnStyle = (column: Column) => {
    const isHovered = hoveredColumn === column.name;
    const base = "px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-left border-b transition-all duration-200 ";

    if (column.keyType === 'PK' || column.keyType === 'COMPOSITE_PK') {
      return base + (isHovered 
        ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" 
        : "bg-[#F7F7F3] text-[#1A1A1A] border-[#1A1A1A] border-b-2");
    }
    if (column.keyType === 'FK') {
      return base + (isHovered 
        ? "bg-[#E5E5E1] text-[#1A1A1A] border-[#8C8C88] border-2" 
        : "bg-[#F7F7F3] text-[#5F5F5B] border-[#E5E5E1] border-b-2");
    }

    switch (column.role) {
      case 'multi':
        return base + (isHovered 
          ? "bg-[#F5ECE3] text-[#7A4F2A] border-[#7A4F2A] border" 
          : "bg-[#FAF6F0] text-[#7A4F2A] border-[#E5E5E1] border-b border-dashed");
      case 'partial_dep':
        return base + (isHovered 
          ? "bg-[#EAEBE7] text-[#4A4B45] border-[#4A4B45] border" 
          : "bg-[#F1F2EF] text-[#4A4B45] border-[#E5E5E1] border-b border-dashed");
      case 'transitive_dep':
        return base + (isHovered 
          ? "bg-[#F3EFE9] text-[#63553E] border-[#63553E] border" 
          : "bg-[#FAF7F2] text-[#63553E] border-[#E5E5E1] border-b border-dashed");
      default:
        return base + (isHovered ? "bg-[#F7F7F3] text-[#1A1A1A] border-[#8C8C88]" : "bg-[#FDFDFB] text-[#5F5F5B] border-[#E5E5E1]");
    }
  };

  // Cell rendering styles for values
  const getCellClassName = (column: Column, value: any) => {
    const isHovered = hoveredColumn === column.name;
    let base = "px-4 py-3 text-xs text-[#1A1A1A] transition-all duration-200 border-b border-[#E5E5E1] ";
    if (isHovered) {
      base += "bg-[#F7F7F3] font-medium ";
    }

    if (column.keyType === 'PK' || column.keyType === 'COMPOSITE_PK') {
      return base + "font-mono font-medium text-[#1A1A1A] bg-[#F7F7F3]/30";
    }
    if (column.keyType === 'FK') {
      return base + "font-mono text-[#5F5F5B] bg-[#F7F7F3]/10";
    }

    switch (column.role) {
      case 'multi':
        return base + "text-[#7A4F2A] bg-[#FAF6F0] underline decoration-dotted decoration-[#7A4F2A]/40 font-medium";
      case 'partial_dep':
        return base + "text-[#4A4B45] bg-[#F1F2EF]/60";
      case 'transitive_dep':
        return base + "text-[#63553E] bg-[#FAF7F2]/60";
      default:
        return base + "text-[#1A1A1A]";
    }
  };

  // Handle simulations for UNF / 1NF anomalies
  const runAnomalySimulation = (type: string) => {
    setActiveAnomalySimulation(type);
  };

  return (
    <div className="space-y-8">
      {/* Scenario Selection Header */}
      <div className="bg-[#F7F7F3] p-6 border border-[#E5E5E1] rounded-sm">
        <label className="block text-[10px] font-bold text-[#8C8C88] uppercase tracking-[0.2em] mb-4">
          Select Real-World Database Scenario
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SCENARIOS.map((sc) => {
            const isActive = sc.id === selectedScenarioId;
            return (
              <button
                key={sc.id}
                id={`sc-btn-${sc.id}`}
                onClick={() => {
                  setSelectedScenarioId(sc.id);
                  setActiveAnomalySimulation(null);
                }}
                className={`flex text-left items-start p-4 transition-all duration-200 border rounded-none ${
                  isActive
                    ? 'border-[#1A1A1A] bg-white ring-2 ring-[#1A1A1A]/5'
                    : 'border-[#E5E5E1] bg-[#FDFDFB] hover:border-[#1A1A1A] hover:bg-white'
                }`}
              >
                <div className={`p-2.5 mr-4 rounded-none transition-colors ${isActive ? 'bg-[#1A1A1A] text-white' : 'bg-[#F1F1ED] text-[#5F5F5B]'}`}>
                  {renderIcon(sc.iconName, "w-4 h-4")}
                </div>
                <div>
                  <h4 className="font-bold text-[#1A1A1A] text-sm font-serif italic">{sc.name}</h4>
                  <p className="text-xs text-[#5F5F5B] mt-1 line-clamp-2 font-light leading-relaxed">{sc.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Normalization Form Horizontal Stepper */}
      <div className="bg-white border border-[#E5E5E1] rounded-sm p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#E5E5E1]">
          <div>
            <span className="px-2.5 py-1 text-[9px] font-bold font-mono text-[#1A1A1A] bg-[#F7F7F3] border border-[#E5E5E1] uppercase tracking-wider">
              Interactive Stepper
            </span>
            <h3 className="text-xl font-serif font-light text-[#1A1A1A] mt-2 italic">Active Target State</h3>
            <p className="text-xs text-[#5F5F5B] font-light">Click a tab to simulate database transformation rules</p>
          </div>
          
          <div className="grid grid-cols-4 bg-[#F7F7F3] p-1 border border-[#E5E5E1] w-full md:w-auto max-w-sm rounded-none">
            {formsList.map((item) => {
              const isActive = activeForm === item.form;
              return (
                <button
                  key={item.form}
                  id={`form-btn-${item.form}`}
                  onClick={() => {
                     setActiveForm(item.form);
                     setActiveAnomalySimulation(null);
                  }}
                  className={`py-1.5 px-3 text-xs font-bold transition-all duration-200 rounded-none ${
                    isActive
                      ? 'bg-[#1A1A1A] text-white'
                      : 'text-[#5F5F5B] hover:text-[#1A1A1A] hover:bg-[#F1F1ED]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Meta Displayed above tables */}
        <div className="bg-[#FAF9F5] p-5 border border-[#E5E5E1] rounded-none grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-2">
            <h4 className="text-base font-serif font-light italic text-[#1A1A1A] flex items-center">
              <span className="p-1.5 bg-[#1A1A1A] text-white mr-2.5 rounded-none">
                <Icons.Layers className="w-3.5 h-3.5" />
              </span>
              {step.title}
            </h4>
            <p className="text-[10px] font-mono tracking-widest text-[#8C8C88] uppercase">{step.description}</p>
            <p className="text-xs md:text-sm text-[#5F5F5B] font-light leading-relaxed pt-1">{step.explanation}</p>
          </div>

          {/* Checklist Rules checked for active level */}
          <div className="bg-white p-4 border border-[#E5E5E1] rounded-none max-h-48 overflow-y-auto space-y-2.5">
            <h5 className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-[0.15em] flex items-center mb-1 font-sans border-b border-[#E5E5E1] pb-1.5">
              <Icons.ShieldCheck className="w-3.5 h-3.5 text-[#1A1A1A] mr-1.5" /> Normal Form Audit
            </h5>
            {step.rulesChecked.map((rule, idx) => (
              <div key={idx} className="flex items-start text-xs">
                {rule.passed ? (
                  <span className="text-emerald-600 font-mono text-[10px] font-bold shrink-0 mr-2">✓</span>
                ) : (
                  <span className="text-[#8C8C88] font-mono text-[10px] font-bold shrink-0 mr-2">✗</span>
                )}
                <div>
                  <p className={`font-semibold ${rule.passed ? 'text-[#1A1A1A]' : 'text-[#8C8C88] line-through font-light'}`}>{rule.rule}</p>
                  <p className="text-[10px] text-[#5F5F5B] font-light leading-normal mt-0.5">{rule.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Guide explaining Column Legends */}
      <div className="flex flex-wrap items-center gap-2.5 bg-[#FAF9F5] px-4 py-3 border border-[#E5E5E1] text-[11px] text-[#5F5F5B] rounded-none">
        <span className="font-bold uppercase tracking-widest mr-1 text-[10px] text-[#8C8C88]">Legend:</span>
        <span className="inline-flex items-center px-1.5 py-0.5 bg-white text-[#1A1A1A] text-[10px] font-mono border border-[#1A1A1A]">
          <span className="w-1.5 h-1.5 bg-[#1A1A1A] mr-1.5"></span> PK (Primary Key)
        </span>
        <span className="inline-flex items-center px-1.5 py-0.5 bg-white text-[#5F5F5B] text-[10px] font-mono border border-[#E5E5E1]">
          <span className="w-1.5 h-1.5 bg-[#8C8C88] mr-1.5"></span> FK (Foreign Key)
        </span>
        {activeForm === 'UNF' && (
          <span className="inline-flex items-center px-1.5 py-0.5 bg-[#FAF6F0] text-[#7A4F2A] text-[10px] font-mono border border-[#7A4F2A]/35">
            <span className="w-1.5 h-1.5 bg-[#7A4F2A] mr-1.5"></span> Non-Atomic Matrix (Violates 1NF)
          </span>
        )}
        {(activeForm === '1NF' || activeForm === 'UNF') && (
          <span className="inline-flex items-center px-1.5 py-0.5 bg-[#F1F2EF] text-[#4A4B45] text-[10px] font-mono border border-[#4A4B45]/35">
            <span className="w-1.5 h-1.5 bg-[#4A4B45] mr-1.5"></span> Partial Key Dep (Violates 2NF)
          </span>
        )}
        {(activeForm === '2NF' || activeForm === '1NF') && (
          <span className="inline-flex items-center px-1.5 py-0.5 bg-[#FAF7F2] text-[#63553E] text-[10px] font-mono border border-[#63553E]/35">
            <span className="w-1.5 h-1.5 bg-[#63553E] mr-1.5"></span> Transitive Dep (Violates 3NF)
          </span>
        )}
        <span className="text-[10px] text-[#8C8C88] italic ml-auto hidden xl:inline">💡 Hover columns to highlight dependent cells</span>
      </div>

      {/* Render Tables */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div 
            key={`${selectedScenarioId}-${activeForm}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className={`grid grid-cols-1 ${step.tables.length > 2 ? 'xl:grid-cols-2' : 'grid-cols-1'} gap-6`}
          >
            {step.tables.map((table: TableData) => (
              <div 
                key={table.id}
                id={`table-panel-${table.id}`} 
                className="bg-white border border-[#E5E5E1] rounded-none overflow-hidden flex flex-col transition-all duration-200"
              >
                {/* Table Title and Primary Key description */}
                <div className="bg-[#F7F7F3] px-5 py-3 border-b border-[#E5E5E1] flex items-center justify-between">
                  <div>
                    <h4 className="font-serif italic text-base text-[#1A1A1A] flex items-center">
                      <Icons.Table className="w-3.5 h-3.5 text-[#1A1A1A] mr-2 shrink-0" />
                      {table.name}
                    </h4>
                    <p className="text-[10px] text-[#8C8C88] mt-0.5 font-mono">
                      PK: {table.columns.filter(c => c.keyType?.includes('PK')).map(c => c.label).join(' + ') || 'None defined'}
                    </p>
                  </div>
                  {/* Status Indicator */}
                  <div>
                    {activeForm === '3NF' ? (
                      <span className="inline-flex items-center px-2 py-0.5 bg-white text-emerald-850 text-[9px] uppercase tracking-wider font-bold rounded-none border border-emerald-600">
                        <Icons.Compass className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Perfect 3NF
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 bg-white text-[#1A1A1A] text-[9px] uppercase tracking-wider font-bold rounded-none border border-[#1A1A1A]">
                        {activeForm}
                      </span>
                    )}
                  </div>
                </div>

                {/* Table Data Columns & Rows */}
                <div className="p-0 overflow-x-auto">
                  <table className="w-full min-w-max border-collapse">
                    <thead>
                      <tr>
                        {table.columns.map((col) => (
                          <th 
                            key={col.name}
                            className={getColumnStyle(col)}
                            onMouseEnter={() => setHoveredColumn(col.name)}
                            onMouseLeave={() => setHoveredColumn(null)}
                          >
                            <div className="flex flex-col">
                              <span className="flex items-center shrink-0">
                                {col.label}
                                {col.keyType === 'PK' && <span className="ml-1.5 px-1 py-[1px] border border-[#1A1A1A] bg-[#1A1A1A] text-white text-[7px] font-bold font-mono">PK</span>}
                                {col.keyType === 'COMPOSITE_PK' && <span className="ml-1.5 px-1 py-[1px] border border-[#1A1A1A] bg-[#1A1A1A] text-white text-[7px] font-bold font-mono">C-PK</span>}
                                {col.keyType === 'FK' && <span className="ml-1.5 px-1 py-[1px] border border-[#8C8C88] text-[#5F5F5B] text-[7px] font-bold font-mono">FK</span>}
                              </span>
                              {col.description && (
                                <span className="text-[9px] font-normal text-[#8C8C88] tracking-normal mt-0.5 transition-all lowercase">
                                  {col.description}
                                </span>
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {table.rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-[#FAF9F5]">
                          {table.columns.map((col) => (
                            <td 
                              key={col.name}
                              className={getCellClassName(col, row[col.name])}
                              onMouseEnter={() => setHoveredColumn(col.name)}
                              onMouseLeave={() => setHoveredColumn(null)}
                            >
                              {row[col.name] !== undefined ? String(row[col.name]) : <span className="text-[#8C8C88] italic">null</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table functional descriptions and anomaly simulation */}
                <div className="p-4 bg-[#FAF9F5]/30 border-t border-[#E5E5E1] space-y-3 mt-auto">
                  {table.functionalDependencies && table.functionalDependencies.length > 0 && (
                    <div className="text-xs">
                      <span className="font-bold text-[#8C8C88] uppercase tracking-widest text-[9px] block mb-1">Functional Dependencies:</span>
                      <ul className="space-y-1 bg-white rounded-none p-2.5 border border-[#E5E5E1] font-mono text-[11px] text-[#4A4A46] leading-tight">
                        {table.functionalDependencies.map((fd, i) => (
                          <li key={i} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-[#8C8C88] mr-2 shrink-0"></span>
                            {fd}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {table.issues && table.issues.length > 0 && (
                    <div className="space-y-1.5 pt-1.5 border-t border-[#E5E5E1]">
                      {table.issues.map((issue, idx) => (
                        <div 
                          key={idx} 
                          className={`flex items-start text-xs p-3 rounded-none border leading-relaxed ${
                            issue.type === 'error' 
                              ? 'bg-[#FAF6F0] text-[#7A4F2A] border-[#DFAFA0]/40' 
                              : issue.type === 'warning'
                                ? 'bg-[#FAF7F2] text-[#63553E] border-[#D5C29D]/40'
                                : 'bg-[#F1F2EF] text-[#4A4B45] border-[#D0D4CC]/40'
                          }`}
                        >
                          <Icons.AlertTriangle className={`w-4 h-4 shrink-0 mr-2 mt-0.5 ${issue.type === 'error' ? 'text-[#7A4F2A]' : 'text-[#63553E]'}`} />
                          <div>
                            <p className="font-bold text-[12px] uppercase tracking-wider">{issue.message}</p>
                            <p className="text-[11px] mt-0.5 text-[#5F5F5B] leading-relaxed font-light">{issue.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Simulator: Interactive Anomaly Explainer */}
      {activeForm !== '3NF' && (
        <div className="bg-[#FAF9F5] text-[#1A1A1A] border border-[#1A1A1A] p-6 rounded-none">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-6 pb-4 border-b border-[#E5E5E1]">
            <div>
              <span className="px-2 py-0.5 text-[9px] font-bold text-[#1A1A1A] bg-white border border-[#1A1A1A] uppercase tracking-widest font-mono">
                Real-Time Sandbox
              </span>
              <h3 className="text-lg font-serif italic text-black mt-2">Anomaly Simulator (Why is {activeForm} Dangerous?)</h3>
              <p className="text-xs text-[#5F5F5B] font-light mt-0.5">Explore how duplicate data breaks databases during standard write actions</p>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
              <button
                id="btn-sim-insert"
                onClick={() => runAnomalySimulation('insert')}
                className={`py-1.5 px-3 rounded-none text-xs font-bold uppercase tracking-widest border transition-all ${
                  activeAnomalySimulation === 'insert'
                    ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                    : 'bg-white border-[#E5E5E1] text-[#5F5F5B] hover:text-[#1A1A1A] hover:bg-[#F1F1ED]'
                }`}
              >
                Insertion Anomaly
              </button>
              <button
                id="btn-sim-delete"
                onClick={() => runAnomalySimulation('delete')}
                className={`py-1.5 px-3 rounded-none text-xs font-bold uppercase tracking-widest border transition-all ${
                  activeAnomalySimulation === 'delete'
                    ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                    : 'bg-white border-[#E5E5E1] text-[#5F5F5B] hover:text-[#1A1A1A] hover:bg-[#F1F1ED]'
                }`}
              >
                Deletion Anomaly
              </button>
              <button
                id="btn-sim-update"
                onClick={() => runAnomalySimulation('update')}
                className={`py-1.5 px-3 rounded-none text-xs font-bold uppercase tracking-widest border transition-all ${
                  activeAnomalySimulation === 'update'
                    ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                    : 'bg-white border-[#E5E5E1] text-[#5F5F5B] hover:text-[#1A1A1A] hover:bg-[#F1F1ED]'
                }`}
              >
                Update Anomaly
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeAnomalySimulation ? (
              <motion.div
                key={activeAnomalySimulation}
                initial={{ opacity: 0, filter: 'blur(2px)' }}
                animate={{ opacity: 1, filter: 'blur(0)' }}
                exit={{ opacity: 0, filter: 'blur(2px)' }}
                className="space-y-4"
              >
                {activeAnomalySimulation === 'insert' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white p-5 border border-[#1A1A1A]/20">
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold uppercase tracking-wide text-red-950 flex items-center">
                        <Icons.DatabaseBackup className="w-4 h-4 text-[#8C8C88] mr-2" /> Insufficient Primary Key Info (1NF Violation)
                      </h4>
                      <p className="text-xs text-[#5F5F5B] leading-relaxed font-light">
                        Say you want to create a brand new course <strong className="text-black font-semibold">"ADV-303 (Database Security)"</strong> which is taught by <strong className="text-black font-semibold">"Dr. Alice"</strong>.
                      </p>
                      <p className="text-xs text-[#1A1A1A] font-semibold border-t border-[#E5E5E1] pt-2">
                        Why this fails in {activeForm}:
                      </p>
                      <p className="text-xs text-[#5F5F5B] leading-relaxed font-light">
                        In {activeForm === 'UNF' ? 'UNF' : '1NF'}, our database is stored in one single flat row. The primary key relies on <span className="underline decoration-[#7A4F2A]/35 text-[#1A1A1A] font-medium">Student ID</span>. Because no student has enrolled in "Database Security" yet, we must set "student_id" to <code className="bg-[#FAF9F5] border border-[#E5E5E1] px-1 py-0.5 font-mono font-bold text-red-950">NULL</code>. But relational databases strictly forbid Null values in Primary Keys!
                      </p>
                      <div className="bg-[#FAF6F0] p-2.5 text-red-950 font-mono text-[10px] border border-red-950/20">
                        ❌ SQL Engine Error: Primary key Column 'Student_ID' cannot accept null values. Insertion rejected.
                      </div>
                    </div>
                    <div className="bg-[#FAF9F5] p-5 border-l-2 border-[#1A1A1A]">
                      <h5 className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-[0.2em] mb-2 font-mono">The 3NF Paradigm Cure:</h5>
                      <p className="text-xs text-[#1A1A1A] font-serif italic mb-2">Decoupled Entity Spaces</p>
                      <p className="text-xs text-[#5F5F5B] leading-relaxed font-light">
                        In <strong className="text-black">3NF</strong>, courses live safely inside their own isolated <code className="font-mono text-[11px] bg-white border border-[#E5E5E1] px-1 rounded-sm">Courses</code> dictionary. You can record a new course instantly without needing student enrollments, completely preventing entity schema locks.
                      </p>
                    </div>
                  </div>
                )}

                {activeAnomalySimulation === 'delete' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white p-5 border border-[#1A1A1A]/20">
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold uppercase tracking-wide text-red-950 flex items-center">
                        <Icons.Trash2 className="w-4 h-4 text-[#8C8C88] mr-2" /> Collateral deletion damage
                      </h4>
                      <p className="text-xs text-[#5F5F5B] leading-relaxed font-light">
                        Let's say Taylor Morse (<strong className="font-medium text-black">Student S103</strong>) cancels their enrollment in <strong className="text-black">"Calculus (MATH-201)"</strong>. We execute a delete row query.
                      </p>
                      <p className="text-xs text-[#7A4F2A] bg-[#FAF6F0] p-3 border border-red-900/10 font-light leading-relaxed">
                        💥 <strong className="font-bold">Severe Collision Error:</strong> Since they were the only student enrolled in Calculus, deleting that row completely erases the record that "Calculus (MATH-201) taught by Prof. Chen" even existed in university curriculum records!
                      </p>
                    </div>
                    <div className="bg-[#FAF9F5] p-5 border-l-2 border-[#1A1A1A]">
                      <h5 className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-[0.2em] mb-2 font-mono">The 3NF Paradigm Cure:</h5>
                      <p className="text-xs text-[#1A1A1A] font-serif italic mb-2">Isolation of Association Matrix</p>
                      <p className="text-xs text-[#5F5F5B] leading-relaxed font-light">
                        In 3NF, dropping enrollments only removes a clean record from a junction table called <code className="font-mono text-[11px] bg-white border border-[#E5E5E1] px-1">Enrollments</code>. The core <code className="font-mono text-[11px] bg-white border border-[#E5E5E1] px-1">Courses</code> list remains untouched. The database retains calculus in catalogs without loss of structural attributes.
                      </p>
                    </div>
                  </div>
                )}

                {activeAnomalySimulation === 'update' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white p-5 border border-[#1A1A1A]/20">
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold uppercase tracking-wide text-red-950 flex items-center">
                        <Icons.RefreshCw className="w-4 h-4 text-[#8C8C88] mr-2" /> Multi-row Update Inconsistency Risk
                      </h4>
                      <p className="text-xs text-[#5F5F5B] leading-relaxed font-light">
                        Imagine <strong className="text-black">Dr. Evelyn</strong> moves her office from <strong className="text-black font-semibold">Room 401</strong> to <strong className="text-black font-semibold">Room 505</strong>.
                      </p>
                      <p className="text-xs text-[#5F5F5B] leading-relaxed font-light">
                        In flat structures, her location is duplicated in every row representing her classes. If she teaches 100 students and our query updates only 99 rows due to system timeout or concurrent lockouts:
                      </p>
                      <div className="space-y-1 text-[11px] font-mono leading-tight bg-[#F7F7F3] p-2.5 border border-[#E5E5E1]">
                        <div className="text-green-800">✓ Row Student S101 teaches CS-101: Dr. Evelyn (Room 505)</div>
                        <div className="text-red-800 font-bold">✗ Row Student S102 teaches CS-101: Dr. Evelyn (Room 401) -- CONFLICT!</div>
                      </div>
                      <p className="text-xs text-[#5F5F5B] font-light italic leading-normal">
                        Your system state is corrupted: Which room data represents truth? Room 401 or Room 505?
                      </p>
                    </div>
                    <div className="bg-[#FAF9F5] p-5 border-l-2 border-[#1A1A1A]">
                      <h5 className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-[0.2em] mb-2 font-mono">The 3NF Paradigm Cure:</h5>
                      <p className="text-xs text-[#1A1A1A] font-serif italic mb-2">Atomic Relational Referencing</p>
                      <p className="text-xs text-[#5F5F5B] leading-relaxed font-light font-mono text-[10px] bg-white border border-[#E5E5E1] p-1.5 my-1.5 rounded-none text-[#1A1A1A]">
                        UPDATE Instructors SET Office = 'Room 505' WHERE ID = 'I01'
                      </p>
                      <p className="text-xs text-[#5F5F5B] leading-relaxed font-light mt-2">
                        Updating one single row instantly updates the entire state reference everywhere, avoiding multi-location write drifts.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-slate-400 text-xs">
                <Icons.Sparkles className="w-5 h-5 text-[#8C8C88] animate-pulse mb-2" />
                <span className="font-mono text-[#8C8C88] text-[10px] uppercase tracking-widest">Select an anomaly scenario button above</span>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
