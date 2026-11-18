import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Clock,
} from 'lucide-react';
import { AttemptRecord, Question } from '../types/study';
import { SchematicDiagram } from './SchematicDiagram';

const OPTION_CIRCLES = ['①', '②', '③', '④'] as const;

interface QuestionCardProps {
  question: Question;
  selectedOption: number | null;
  isSubmitted: boolean;
  attemptRecord?: AttemptRecord;
  onSelectOption: (index: number) => void;
  onToggleBookmark: (questionId: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOption,
  isSubmitted,
  attemptRecord,
  onSelectOption,
  onToggleBookmark,
}) => {
  const [explanationOpen, setExplanationOpen] = useState(true);

  useEffect(() => {
    setExplanationOpen(true);
  }, [question.id]);

  const isBookmarked = attemptRecord?.bookmarked ?? false;
  const isHold = attemptRecord?.status === 'hold';
  const wasSkipped = isSubmitted && selectedOption === null;
  const isCorrect = isSubmitted && selectedOption === question.correctIndex;

  return (
    <article className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-[0_2px_10px_-2px_rgba(15,23,42,0.04)]">
      {/* Header Slot */}
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <div className="min-w-0">
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
            <span className="font-mono-tech text-[18px] font-bold text-[#1D4ED8] tracking-tight">
              {question.numberLabel}
            </span>
            <span className="text-[#CBD5E1]" aria-hidden="true">·</span>
            <span className="font-mono-tech text-[12px] font-medium text-[#475569]">
              {question.examSession}
            </span>
            <span className="text-[#CBD5E1]" aria-hidden="true">·</span>
            <span className="text-[12px] font-medium text-[#475569]">
              {question.chapterLabel}
            </span>
          </div>

          {/* Explicit Post-Submit / Hold Status Line */}
          {(isSubmitted || isHold) && (
            <div className="mt-2 flex items-center flex-wrap gap-2">
              {isSubmitted && isCorrect && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] text-[#059669] px-2.5 py-1 text-[12px] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  정답
                </span>
              )}
              {isSubmitted && !isCorrect && !wasSkipped && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF1F2] text-[#E11D48] px-2.5 py-1 text-[12px] font-semibold">
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                  오답 (정답 {OPTION_CIRCLES[question.correctIndex]})
                </span>
              )}
              {wasSkipped && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF1F2] text-[#E11D48] px-2.5 py-1 text-[12px] font-semibold">
                  <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                  모름 처리 (정답 {OPTION_CIRCLES[question.correctIndex]})
                </span>
              )}
              {isHold && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF3C7] text-[#D97706] px-2.5 py-1 text-[12px] font-semibold">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  오답보류
                </span>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onToggleBookmark(question.id)}
          aria-label={isBookmarked ? '북마크 해제' : '북마크 저장'}
          aria-pressed={isBookmarked}
          className={`min-h-[44px] min-w-[44px] -mt-1 -mr-1 rounded-xl flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${
            isBookmarked
              ? 'text-[#D97706] bg-[#FEF3C7]/60'
              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
          }`}
        >
          <Bookmark
            className="w-5 h-5"
            fill={isBookmarked ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      {/* Question Prompt Body */}
      <h2 className="text-[17px] font-medium leading-[28px] text-[#0F172A] mb-4">
        {question.prompt}
      </h2>

      {/* Formula & Schematic Preview Box */}
      {(question.schematic || question.formulaBox) && (
        <div className="mb-4">
          {question.schematic ? (
            <SchematicDiagram
              type={question.schematic}
              formulaBox={isSubmitted ? question.formulaBox : undefined}
            />
          ) : (
            isSubmitted &&
            question.formulaBox && (
              <div className="rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-3 overflow-x-auto formula-scroll">
                <p className="font-mono-tech text-[13px] font-medium text-[#1D4ED8] whitespace-nowrap">
                  {question.formulaBox}
                </p>
              </div>
            )
          )}
        </div>
      )}

      {/* Multiple-Choice Option Rows */}
      <div className="flex flex-col gap-2.5" role="radiogroup" aria-label="객관식 보기">
        {question.options.map((optionText, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrectOption = idx === question.correctIndex;

          let rowStyle =
            'bg-white border border-[#E2E8F0] text-[#0F172A] hover:border-[#94A3B8] hover:bg-[#F8FAFC]';
          let circleStyle = 'text-[#475569]';
          let feedbackIcon: React.ReactNode = null;

          if (!isSubmitted && isSelected) {
            rowStyle =
              'bg-[#EFF6FF] border-2 border-[#1D4ED8] text-[#1D4ED8] font-medium';
            circleStyle = 'text-[#1D4ED8] font-bold';
          } else if (isSubmitted) {
            if (isCorrectOption) {
              rowStyle =
                'bg-[#ECFDF5] border-2 border-[#059669] text-[#059669] font-medium';
              circleStyle = 'text-[#059669] font-bold';
              feedbackIcon = (
                <CheckCircle2 className="w-5 h-5 text-[#059669] shrink-0" aria-hidden="true" />
              );
            } else if (isSelected && !isCorrectOption) {
              rowStyle =
                'bg-[#FFF1F2] border-2 border-[#E11D48] text-[#E11D48] font-medium';
              circleStyle = 'text-[#E11D48] font-bold';
              feedbackIcon = (
                <XCircle className="w-5 h-5 text-[#E11D48] shrink-0" aria-hidden="true" />
              );
            } else {
              rowStyle =
                'bg-white border border-[#E2E8F0] text-[#64748B] opacity-75';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isSubmitted}
              onClick={() => onSelectOption(idx)}
              className={`w-full min-h-[56px] rounded-xl px-3.5 py-3 flex items-center gap-3 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] disabled:cursor-default ${rowStyle}`}
            >
              <span
                className={`text-[17px] leading-none shrink-0 w-6 text-center ${circleStyle}`}
              >
                {OPTION_CIRCLES[idx]}
              </span>
              <span className="flex-1 text-[15px] leading-[22px]">
                {optionText}
              </span>
              {feedbackIcon}
            </button>
          );
        })}
      </div>

      {/* Collapsible Explanation & Formula Drawer */}
      {isSubmitted && (
        <div className="mt-4 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] overflow-hidden">
          <button
            type="button"
            onClick={() => setExplanationOpen((prev) => !prev)}
            aria-expanded={explanationOpen}
            className="w-full min-h-[46px] px-4 py-2.5 flex items-center justify-between text-left hover:bg-[#E2E8F0]/50 transition-colors focus-visible:outline-2 focus-visible:outline-[#1D4ED8]"
          >
            <span className="text-[14px] font-semibold text-[#0F172A]">
              해설 및 풀이 공식
            </span>
            {explanationOpen ? (
              <ChevronUp className="w-4 h-4 text-[#475569] shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#475569] shrink-0" />
            )}
          </button>

          {explanationOpen && (
            <div className="px-4 pb-4 pt-1 border-t border-[#E2E8F0]">
              <p className="text-[14px] leading-[22px] text-[#334155] mb-3">
                {question.explanation}
              </p>

              <div className="rounded-lg bg-white border border-[#E2E8F0] p-3 mb-3 overflow-x-auto formula-scroll">
                <div className="flex flex-col gap-1.5">
                  {question.formulaSteps.map((step, i) => (
                    <p
                      key={i}
                      className="font-mono-tech text-[12.5px] leading-[19px] text-[#0F172A] whitespace-nowrap"
                    >
                      {step}
                    </p>
                  ))}
                </div>
              </div>

              <p className="text-[13px] leading-[20px] font-medium text-[#1D4ED8]">
                핵심 포인트 · {question.keyTakeaway}
              </p>
            </div>
          )}
        </div>
      )}
    </article>
  );
};
