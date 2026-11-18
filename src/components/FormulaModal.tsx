import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { CHAPTER_TABS, CORE_FORMULAS } from '../data/questions';
import { ChapterId } from '../types/study';

interface FormulaModalProps {
  isOpen: boolean;
  initialChapter?: ChapterId;
  onClose: () => void;
}

export const FormulaModal: React.FC<FormulaModalProps> = ({
  isOpen,
  initialChapter = 'all',
  onClose,
}) => {
  const [chapter, setChapter] = useState<ChapterId>(initialChapter);

  useEffect(() => {
    if (isOpen) {
      setChapter(initialChapter);
    }
  }, [isOpen, initialChapter]);

  if (!isOpen) return null;

  const filtered =
    chapter === 'all'
      ? CORE_FORMULAS
      : CORE_FORMULAS.filter((f) => f.chapter === chapter);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0F172A]/45 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="formula-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] max-h-[85dvh] bg-white rounded-t-3xl sm:rounded-2xl border border-[#E2E8F0] shadow-xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile grab handle */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center">
          <div className="w-10 h-1.5 rounded-full bg-[#CBD5E1]" />
        </div>

        {/* Header */}
        <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between gap-3">
          <div>
            <h2
              id="formula-modal-title"
              className="text-[18px] font-bold text-[#0F172A]"
            >
              전력공학 핵심 공식집
            </h2>
            <p className="text-[12px] text-[#475569]">
              단원별 빈출 계산 공식 요약
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="공식집 닫기"
            className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-4 py-2.5 border-b border-[#E2E8F0] bg-[#F8FAFC] overflow-x-auto formula-scroll">
          <div className="flex items-center gap-1.5">
            {CHAPTER_TABS.map((tab) => {
              const active = chapter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setChapter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap shrink-0 transition-colors ${
                    active
                      ? 'bg-[#1D4ED8] text-white'
                      : 'bg-white border border-[#E2E8F0] text-[#475569] hover:text-[#0F172A]'
                  }`}
                >
                  {tab.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Formula list */}
        <div className="p-4 overflow-y-auto flex flex-col gap-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-[#E2E8F0] bg-white p-3.5"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[14px] font-semibold text-[#0F172A]">
                  {item.title}
                </span>
                <span className="text-[11px] font-medium text-[#475569] whitespace-nowrap">
                  {item.chapterLabel}
                </span>
              </div>
              <div className="rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-3 py-2 mb-1.5 overflow-x-auto formula-scroll">
                <p className="font-mono-tech text-[13px] font-semibold text-[#1D4ED8] whitespace-nowrap">
                  {item.equation}
                </p>
              </div>
              <p className="text-[12px] leading-[18px] text-[#475569]">
                {item.variables}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
