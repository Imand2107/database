import React from 'react';
import * as Icons from 'lucide-react';

interface MetricRowProps {
  label: string;
  icon: React.ReactNode;
  unf: string;
  nf1: string;
  nf2: string;
  nf3: string;
}

export default function ComparisonTable() {
  const normalForms = [
    {
      name: 'UNF (Unnormalized)',
      icon: <Icons.FolderX className="w-4 h-4 text-rose-500" />,
      tag: 'Raw Data',
      tagClass: 'bg-rose-50 text-rose-700 border-rose-200',
      definition: 'Data loaded into flat files or spreadsheets without design structures, repeating groups, or compound attributes.',
      solved: 'None',
      redundancy: 95, // scale out of 100
      writeSpeed: 20, // prone to locks/corruptions
      readSpeed: 90, // single flat scan, list splits needed but no joins. wait, let's represent read speeds carefully!
      joinsNeeded: '0 (Everything is in 1 massive file)'
    },
    {
      name: '1NF (1st Normal Form)',
      icon: <Icons.TableCellsSplit className="w-4 h-4 text-amber-500" />,
      tag: 'Atomic values',
      tagClass: 'bg-amber-50 text-amber-700 border-amber-200',
      definition: 'All column cells contain single, atomic values. No repeating rows. Distinct records identified by a primary key (often composite).',
      solved: 'Repeating groups, Multi-valued cells',
      redundancy: 70,
      writeSpeed: 30,
      readSpeed: 85,
      joinsNeeded: '0-1 (No relational split, master tables are wide)'
    },
    {
      name: '2NF (2nd Normal Form)',
      icon: <Icons.GitMerge className="w-4 h-4 text-indigo-500" />,
      tag: 'No Partial Keys',
      tagClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      definition: 'Must be in 1NF. All non-key attributes must rely on the full primary key (eliminates partial-key dependencies).',
      solved: 'Partial Key Dependencies, Initial anomalies',
      redundancy: 35,
      writeSpeed: 75,
      readSpeed: 60,
      joinsNeeded: '1-2 (Composite keys split into clean relation junctions)'
    },
    {
      name: '3NF (3rd Normal Form)',
      icon: <Icons.Workflow className="w-4 h-4 text-emerald-500" />,
      tag: 'No Transitive Keys',
      tagClass: 'bg-emerald-50 text-emerald-700 border-emerald-250',
      definition: 'Must be in 2NF. No non-key attribute can depend on another non-key attribute (eliminates transitive dependencies).',
      solved: 'Transitive Dependencies, Almost all write anomalies',
      redundancy: 10,
      writeSpeed: 95,
      readSpeed: 45,
      joinsNeeded: '2-4 (Entities are fully isolated, high JOIN density)'
    }
  ];

  return (
    <div className="space-y-10">
      {/* Intro comparative card */}
      <div className="bg-white border border-[#E5E5E1] p-6 rounded-none">
        <h3 className="text-xl font-serif italic font-light text-[#1A1A1A] flex items-center">
          <Icons.Sliders className="w-4 h-4 text-[#1A1A1A] mr-2.5" /> Normal Forms Performance & Trade-offs Matrix
        </h3>
        <p className="text-xs text-[#5F5F5B] font-light mt-1.5 leading-relaxed">
          Normalizing database structures is always a <strong className="font-medium text-[#1A1A1A]">trade-off</strong>. As you climb from UNF to 3NF, you gain absolute <strong className="font-medium text-[#1A1A1A]">write integrity</strong> (solving anomalies) but pay with higher <strong className="font-medium text-[#1A1A1A]">query complexity</strong> and execution cost due to JOIN speeds. Refer to this side-by-side guide.
        </p>
      </div>

      {/* Side by side desktop table */}
      <div className="bg-white border-2 border-[#1A1A1A] shadow-none overflow-hidden rounded-none font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#FAF9F5] border-b-2 border-[#1A1A1A]">
                <th className="px-5 py-4 text-[10px] font-mono font-bold text-[#8C8C88] uppercase tracking-[0.2em] w-64">Dimensions</th>
                {normalForms.map((nf) => (
                  <th key={nf.name} className="px-5 py-4 border-r border-[#E5E5E1] last:border-r-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-[#1A1A1A]">{nf.icon}</span>
                      <span className="font-serif italic font-medium text-[#1A1A1A] text-[14px]">{nf.name}</span>
                    </div>
                    <span className="inline-block mt-1.5 px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider bg-white table border border-[#E5E5E1] text-[#1A1A1A]">
                      {nf.tag}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E1]">
              {/* Definition */}
              <tr>
                <td className="px-5 py-4 text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-[0.15em] bg-[#FAF9F5]">
                  Core Mandate
                </td>
                {normalForms.map((nf) => (
                  <td key={nf.name} className="px-5 py-4 text-xs text-[#5F5F5B] border-r border-[#E5E5E1] last:border-r-0 leading-relaxed font-light">
                    {nf.definition}
                  </td>
                ))}
              </tr>

              {/* Violations Eliminated */}
              <tr>
                <td className="px-5 py-4 text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-[0.15em] bg-[#FAF9F5]">
                  Violations Solved
                </td>
                {normalForms.map((nf) => (
                  <td key={nf.name} className="px-5 py-4 text-xs font-medium text-[#1A1A1A] border-r border-[#E5E5E1] last:border-r-0">
                    <div className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-[#1A1A1A] mr-2 shrink-0"></span>
                      <span>{nf.solved}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Data Redundancy Score */}
              <tr>
                <td className="px-5 py-4 text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-[0.15em] bg-[#FAF9F5]">
                  <div className="flex flex-col">
                    <span>Data Redundancy</span>
                    <span className="text-[9px] font-normal text-[#8C8C88] lowercase tracking-normal mt-0.5">Lower is preferred</span>
                  </div>
                </td>
                {normalForms.map((nf) => (
                  <td key={nf.name} className="px-5 py-4 border-r border-[#E5E5E1] last:border-r-0">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold font-mono text-[11px] text-[#1A1A1A]">{nf.redundancy}%</span>
                        <span className="text-[9px] font-mono uppercase font-bold text-[#8C8C88]">
                          {nf.redundancy > 70 ? 'Extreme' : nf.redundancy > 30 ? 'Moderate' : 'Negligible'}
                        </span>
                      </div>
                      <div className="w-full bg-[#FAF9F5] border border-[#E5E5E1] h-1.5 rounded-none overflow-hidden">
                        <div 
                          className="h-full bg-[#1A1A1A]"
                          style={{ width: `${nf.redundancy}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Write Safety (Updates/Inserts) */}
              <tr>
                <td className="px-5 py-4 text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-[0.15em] bg-[#FAF9F5]">
                  <div className="flex flex-col">
                    <span>Write Integrity</span>
                    <span className="text-[9px] font-normal text-[#8C8C88] lowercase tracking-normal mt-0.5">Anomalies prevented</span>
                  </div>
                </td>
                {normalForms.map((nf) => (
                  <td key={nf.name} className="px-5 py-4 border-r border-[#E5E5E1] last:border-r-0">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold font-mono text-[11px] text-[#1A1A1A]">{nf.writeSpeed}%</span>
                        <span className="text-[9px] font-mono uppercase font-bold text-[#8C8C88]">
                          {nf.writeSpeed < 40 ? 'Anomalous' : nf.writeSpeed < 80 ? 'Good' : 'Bulletproof'}
                        </span>
                      </div>
                      <div className="w-full bg-[#FAF9F5] border border-[#E5E5E1] h-1.5 rounded-none overflow-hidden">
                        <div 
                          className="h-full bg-[#1A1A1A]"
                          style={{ width: `${nf.writeSpeed}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Read Latency (JOINS Overhead) */}
              <tr>
                <td className="px-5 py-4 text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-[0.15em] bg-[#FAF9F5]">
                  <div className="flex flex-col">
                    <span>Read Velocity</span>
                    <span className="text-[9px] font-normal text-[#8C8C88] lowercase tracking-normal mt-0.5">No JOINs fast-path</span>
                  </div>
                </td>
                {normalForms.map((nf) => (
                  <td key={nf.name} className="px-5 py-4 border-r border-[#E5E5E1] last:border-r-0">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold font-mono text-[11px] text-[#1A1A1A]">{nf.readSpeed}%</span>
                        <span className="text-[9px] font-mono uppercase font-bold text-[#8C8C88]">
                          {nf.readSpeed < 50 ? 'Join-Heavy' : nf.readSpeed < 80 ? 'Fast' : 'Blazing'}
                        </span>
                      </div>
                      <div className="w-full bg-[#FAF9F5] border border-[#E5E5E1] h-1.5 rounded-none overflow-hidden">
                        <div 
                          className="h-full bg-[#1A1A1A]"
                          style={{ width: `${nf.readSpeed}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Query Joins Requirement */}
              <tr>
                <td className="px-5 py-4 text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-[0.15em] bg-[#FAF9F5]">
                  Required JOINs
                </td>
                {normalForms.map((nf) => (
                  <td key={nf.name} className="px-5 py-4 text-xs text-[#1A1A1A] border-r border-[#E5E5E1] last:border-r-0 font-mono font-medium leading-relaxed">
                    {nf.joinsNeeded}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* OLTP vs OLAP Denormalization Discussion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
        <div className="bg-[#FAF9F5] p-6 border border-[#E5E5E1] space-y-4 rounded-none">
          <div className="space-y-1.5">
            <h4 className="font-bold text-[#1A1A1A] text-xs uppercase tracking-wider flex items-center">
              <Icons.TrendingUp className="w-4 h-4 text-[#1A1A1A] mr-2 shrink-0" />
              When to fully Normalize (3NF)
            </h4>
            <span className="inline-block px-2.5 py-0.5 bg-[#1A1A1A] text-white text-[9px] font-bold uppercase tracking-wider">
              Transactional Engines (OLTP)
            </span>
          </div>
          <p className="text-xs text-[#5F5F5B] leading-relaxed pt-1 font-light">
            Use 3NF in <strong className="text-black font-semibold">Online Transaction Processing (OLTP)</strong> contexts where users write, insert and edit data continuously. Think of banking transfers, inventory changes, flight check-ins, or e-commerce purchases. Since writes are frequent, eliminating anomalies via 3NF saves computation by keeping records pristine.
          </p>
          <ul className="text-xs text-[#1A1A1A] space-y-2 font-medium">
            <li className="flex items-center font-light">
              <span className="text-[#1A1A1A] mr-2 shrink-0">—</span> Minimizes file sizes per transaction.
            </li>
            <li className="flex items-center font-light">
              <span className="text-[#1A1A1A] mr-2 shrink-0">—</span> High concurrency is ultra-stable due to isolated locks.
            </li>
          </ul>
        </div>

        <div className="bg-[#FAF9F5] p-6 border border-[#E5E5E1] space-y-4 rounded-none">
          <div className="space-y-1.5">
            <h4 className="font-bold text-[#1A1A1A] text-xs uppercase tracking-wider flex items-center">
              <Icons.ZapOff className="w-4 h-4 text-[#1A1A1A] mr-2 shrink-0" />
              When to Denormalize
            </h4>
            <span className="inline-block px-2.5 py-0.5 bg-white border border-[#1A1A1A] text-[#1A1A1A] text-[9px] font-bold uppercase tracking-wider">
              Analytics Engines (OLAP)
            </span>
          </div>
          <p className="text-xs text-[#5F5F5B] leading-relaxed pt-1 font-light">
            Data Warehouses and <strong className="text-black font-semibold">Online Analytical Processing (OLAP)</strong> prioritize fast read speeds and aggregations (e.g. "Total Sales in SF last quarter"). Running joins across 10 separate tables slows down queries. Engineers deliberately denormalize (using Star or Snowflake layouts) to evade JOIN costs.
          </p>
          <ul className="text-xs text-[#1A1A1A] space-y-2 font-medium">
            <li className="flex items-center font-light">
              <span className="text-[#1A1A1A] mr-2 shrink-0">—</span> Blazing analytics queries using single pre-joined flat templates.
            </li>
            <li className="flex items-center font-light">
              <span className="text-[#1A1A1A] mr-2 shrink-0">—</span> Perfect for columns-oriented databases (Snowflake, BigQuery).
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
