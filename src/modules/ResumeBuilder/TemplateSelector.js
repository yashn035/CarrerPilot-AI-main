import React, { useState } from 'react';
import { Check, Sparkles, Search, Filter, Layout } from 'lucide-react';
import { TEMPLATES, CATEGORIES } from './templatesCatalog';

export default function TemplateSelector({ selectedTemplate, onSelectTemplate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All (60)');

  // Filter templates based on Category and Search Query
  const filteredTemplates = TEMPLATES.filter((tmpl) => {
    const matchesCategory =
      selectedCategory === 'All (60)' || tmpl.category === selectedCategory;
    const matchesSearch =
      tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Title & Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111118] border border-border-subtle p-5 rounded-card">
        <div>
          <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent-primary" /> ATS Template Library
            <span className="bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs font-mono px-2.5 py-0.5 rounded-full">
              {TEMPLATES.length} ATS-Friendly Formats
            </span>
          </h3>
          <p className="text-xs text-text-secondary mt-1">
            Choose from 60 parser-optimized resume templates reflowing your data seamlessly.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search templates (e.g. FAANG, Ivy, Mono)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0A0A0F] border border-border-subtle rounded-btn pl-9 pr-4 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted hover:text-text-primary"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border-subtle scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-accent-primary text-white font-semibold shadow-md'
                  : 'bg-background-elevated border border-border-subtle text-text-secondary hover:text-text-primary hover:border-text-muted'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Templates Counter Header */}
      <div className="flex justify-between items-center text-xs text-text-muted">
        <span>Showing {filteredTemplates.length} of {TEMPLATES.length} templates</span>
        {selectedTemplate && (
          <span className="font-mono text-accent-primary font-semibold">
            Active Selection: {TEMPLATES.find(t => t.id === selectedTemplate)?.name || selectedTemplate}
          </span>
        )}
      </div>

      {/* Grid of Templates */}
      {filteredTemplates.length === 0 ? (
        <div className="p-12 text-center bg-background-elevated rounded-card border border-border-subtle">
          <Filter className="w-8 h-8 text-text-muted mx-auto mb-3" />
          <h4 className="font-bold text-sm text-text-primary">No templates matched your query</h4>
          <p className="text-xs text-text-secondary mt-1">Try clearing search filters or selecting another category tab.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All (60)'); }}
            className="mt-4 px-4 py-2 bg-accent-primary text-white text-xs font-semibold rounded-btn"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTemplates.map((tmpl) => {
            const isSelected = selectedTemplate === tmpl.id;
            const Icon = tmpl.icon || Layout;
            return (
              <div
                key={tmpl.id}
                onClick={() => onSelectTemplate(tmpl.id)}
                className={`cursor-pointer rounded-card p-5 border transition-all relative overflow-hidden flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-background-surface border-accent-primary shadow-xl shadow-accent-primary/15 ring-2 ring-accent-primary/50'
                    : 'bg-[#111118] border-border-subtle hover:border-accent-primary/40 hover:bg-background-surface'
                }`}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${tmpl.color} text-white shadow-md`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected ? (
                      <span className="bg-accent-primary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm animate-pulse">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-text-secondary font-mono bg-background-elevated px-2 py-0.5 rounded border border-border-subtle">
                        {tmpl.badge}
                      </span>
                    )}
                  </div>

                  <div className="text-[10px] text-accent-primary uppercase font-bold tracking-wider mb-1">{tmpl.category}</div>
                  <h4 className="font-bold text-sm text-text-primary mb-1 group-hover:text-accent-primary transition-colors">{tmpl.name}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed mb-4 line-clamp-2">{tmpl.description}</p>
                </div>

                {/* Visual Layout Mock Card */}
                <div className="border border-border-subtle rounded-btn p-3 bg-[#0A0A0F] space-y-1.5 opacity-85 group-hover:opacity-100 transition-all group-hover:border-border-muted">
                  <div className={`h-2 rounded w-3/4 bg-gradient-to-r ${tmpl.color}`}></div>
                  <div className="h-1 bg-border-subtle rounded w-full"></div>
                  <div className="h-1 bg-border-subtle rounded w-4/5"></div>
                  <div className="flex gap-1 pt-1">
                    <div className="h-1.5 w-5 bg-accent-primary/30 rounded"></div>
                    <div className="h-1.5 w-5 bg-accent-primary/30 rounded"></div>
                    <div className="h-1.5 w-5 bg-accent-primary/30 rounded"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
