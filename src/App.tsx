import React, { useState } from 'react';
import Playground from './components/Playground';
import TransformationVisualizer from './components/TransformationVisualizer';
import StrategyGuide from './components/StrategyGuide';
import ComparisonTable from './components/ComparisonTable';
import Quiz from './components/Quiz';
import * as Icons from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'playground' | 'visualizer' | 'diagnosis' | 'comparison' | 'quiz'>('visualizer');

  // Mini summary cards
  const summaryPillars = [
    {
      form: '1NF',
      num: '01',
      title: 'First Normal Form',
      rule: 'Eliminate Lists',
      desc: 'All attributes represent singular, indivisible (atomic) values. No repeating structures or comma arrays exist, and each row has a primary key.',
      bg: 'bg-[#F7F7F3] border-[#E5E5E1]'
    },
    {
      form: '2NF',
      num: '02',
      title: 'Second Normal Form',
      rule: 'Eliminate Partial Keys',
      desc: 'Inherits 1NF. Every non-key column depends completely on the entire candidate key. Pulls out partial subsets from composite tables.',
      bg: 'bg-[#F7F7F3] border-[#E5E5E1]'
    },
    {
      form: '3NF',
      num: '03',
      title: 'Third Normal Form',
      rule: 'Eliminate Transitive Keys',
      desc: 'Inherits 2NF+1NF. All non-key columns depend exclusively on the primary key, directly and immediately. Disposes of transitives.',
      bg: 'bg-[#1A1A1A] text-[#FDFDFB] border-[#1A1A1A]'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-[#1A1A1A] font-sans antialiased selection:bg-[#1A1A1A] selection:text-white pb-20">
      {/* Decorative ultra-thin top grid-line */}
      <div className="h-1 w-full bg-[#1A1A1A]"></div>

      {/* Hero Header Section */}
      <header className="max-w-7xl mx-auto px-6 pt-12 pb-8 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 pb-6 border-b border-[#E5E5E1]">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#8C8C88] uppercase font-sans">
                Technical Monograph v.04 / Academic Sandbox
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif italic font-light tracking-tight text-[#1A1A1A] leading-tight">
              Database Normalization
            </h1>
            <p className="text-xs md:text-sm text-[#5F5F5B] max-w-2xl leading-relaxed font-light">
              Normalization structures relational databases to <span className="italic underline decoration-[#D4D4D0] decoration-2">reduce data redundancy</span> and assure functional dependencies. Explore 1NF, 2NF, and 3NF side-by-side using real-world academic data pipelines.
            </p>
          </div>
          
          <div className="text-left md:text-right shrink-0">
            <div className="text-xs font-mono text-[#8C8C88] mb-1 uppercase tracking-widest">Efficiency Protocol</div>
            <div className="text-2xl font-serif italic font-light tracking-tighter text-[#1A1A1A]">
              1NF / 2NF / 3NF
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
        
        {/* Core Pillars Quick-Guide Slider */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {summaryPillars.map((pillar) => {
            const isDark = pillar.form === '3NF';
            return (
              <div 
                key={pillar.form} 
                className={`p-6 border rounded-sm shadow-xs flex flex-col justify-between transition duration-200 ${pillar.bg}`}
              >
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-serif italic font-light">
                      {pillar.num}.
                    </span>
                    <span className={`text-[9px] font-bold font-mono tracking-widest uppercase ${isDark ? 'text-[#8C8C88]' : 'text-[#8C8C88]'}`}>
                      {pillar.rule}
                    </span>
                  </div>
                  <div>
                    <h3 className={`font-bold uppercase tracking-wide text-xs ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
                      {pillar.title}
                    </h3>
                    <p className={`text-xs mt-2 leading-relaxed font-light ${isDark ? 'text-slate-300' : 'text-[#5F5F5B]'}`}>
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Tab-driven visual environment */}
        <section className="space-y-8">
          {/* Editorial custom tab design */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#E5E5E1] pb-4">
            <button
              id="tab-playground"
              onClick={() => setActiveTab('playground')}
              className={`py-2.5 px-5 text-xs font-bold uppercase tracking-widest transition-all duration-150 flex items-center border ${
                activeTab === 'playground'
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-[#F7F7F3] border-[#E5E5E1] text-[#5F5F5B] hover:text-[#1A1A1A] hover:bg-[#F1F1ED]'
              }`}
            >
              <Icons.Shuffle className="w-3.5 h-3.5 mr-2" />
              Interactive Sandbox
            </button>

            <button
              id="tab-visualizer"
              onClick={() => setActiveTab('visualizer')}
              className={`py-2.5 px-5 text-xs font-bold uppercase tracking-widest transition-all duration-150 flex items-center border ${
                activeTab === 'visualizer'
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-[#F7F7F3] border-[#E5E5E1] text-[#5F5F5B] hover:text-[#1A1A1A] hover:bg-[#F1F1ED]'
              }`}
            >
              <Icons.Workflow className="w-3.5 h-3.5 mr-2" />
              Transformation & Infographics
            </button>
            
            <button
              id="tab-diagnosis"
              onClick={() => setActiveTab('diagnosis')}
              className={`py-2.5 px-5 text-xs font-bold uppercase tracking-widest transition-all duration-150 flex items-center border ${
                activeTab === 'diagnosis'
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-[#F7F7F3] border-[#E5E5E1] text-[#5F5F5B] hover:text-[#1A1A1A] hover:bg-[#F1F1ED]'
              }`}
            >
              <Icons.ShieldCheck className="w-3.5 h-3.5 mr-2" />
              Symptom Estimator
            </button>

            <button
              id="tab-comparison"
              onClick={() => setActiveTab('comparison')}
              className={`py-2.5 px-5 text-xs font-bold uppercase tracking-widest transition-all duration-150 flex items-center border ${
                activeTab === 'comparison'
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-[#F7F7F3] border-[#E5E5E1] text-[#5F5F5B] hover:text-[#1A1A1A] hover:bg-[#F1F1ED]'
              }`}
            >
              <Icons.Sliders className="w-3.5 h-3.5 mr-2" />
              Trade-offs Matrix
            </button>

            <button
              id="tab-quiz"
              onClick={() => setActiveTab('quiz')}
              className={`py-2.5 px-5 text-xs font-bold uppercase tracking-widest transition-all duration-150 flex items-center border ${
                activeTab === 'quiz'
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-[#F7F7F3] border-[#E5E5E1] text-[#5F5F5B] hover:text-[#1A1A1A] hover:bg-[#F1F1ED]'
              }`}
            >
              <Icons.Award className="w-3.5 h-3.5 mr-2" />
              Test Your Skills
            </button>
          </div>

          {/* Active Tab Component Render */}
          <div className="pt-2">
            {activeTab === 'playground' && <Playground />}
            {activeTab === 'visualizer' && <TransformationVisualizer />}
            {activeTab === 'diagnosis' && <StrategyGuide />}
            {activeTab === 'comparison' && <ComparisonTable />}
            {activeTab === 'quiz' && <Quiz />}
          </div>
        </section>

      </main>

      <footer className="mt-20 border-t border-[#E5E5E1] bg-[#F7F7F3] py-10 px-8 text-center text-[#8C8C88]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em]">
          <div>Conceptual Design Paradigm</div>
          <div>Ref: ISO/IEC 9075-1:2016</div>
          <div>© {new Date().getFullYear()} Database Archives Corporation</div>
        </div>
      </footer>
    </div>
  );
}

