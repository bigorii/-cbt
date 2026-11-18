import React, { useState } from 'react';
import {
  Bookmark,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { AttemptRecord, Question, ReviewStatus } from '../types/study';
import { SchematicDiagram } from './SchematicDiagram';

const OPTION_CIRCLES = ['①', '②', '③', '④'] as const;

interface WrongNoteCardProps {
  question: Question;
  record: AttemptRecord;
  onChangeStatus: (questionId: string, status: ReviewStatus) => void;
  onToggleBookmark: (questionId: string) => void;
  onReSolve: (questionId: string) => void;
}

export const WrongNoteCard: React.FC<WrongNoteCardProps> = ({
  question,
  record,
  onChangeStatus,
  onToggleBookmark,
  onReSolve,
}) => {
  const [expanded, setExpanded] = useState(false);

  const renderStatusBadge = () => {
    if (record.status === 'mastered') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] text-[#059669] px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5" />
          복습완료
        </span>
      );
    }
    if (record.status === 'hold') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] text-[#D97706] px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap shrink-0">
          <Clock className="w-3.5 h-3.5" />
          오답보류
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF1F2] text-[#E11D48] px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap shrink-0">
        <XCircle className="w-3.5 h-3.5" />
        오답
      </span>
    );
  };

  const myAnswerText =
    record.selectedIndex === null
      ? '모름(건너뜀)'
      : `${OPTION_CIRCLES[record.selectedIndex]} ${question.options[record.selectedIndex]}`;

  return (
    <article className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-[0_2px_10px_-2px_rgba(15,23,42,0.04)]">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
            <span className="font-mono-tech text-[16px] font-bold text-[#1D4ED8]">
              {question.numberLabel}
            </span>
            <span className="text-[#CBD5E1]" aria-hidden="true">·</span>
            <span className="font-mono-tech text-[12px] text-[#475569]">
              {question.examSession}
            </span>
            <span className="text-[#CBD5E1]" aria-hidden="true">·</span>
            <span className="text-[12px] text-[#475569]">
              {question.chapterLabel}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {renderStatusBadge()}
            <span className="font-mono-tech text-[11px] text-[#64748B]">
              풀이 {record.attemptsCount}회
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleBookmark(question.id)}
          aria-label={record.bookmarked ? '북마크 해제' : '북마크 저장'}
          aria-pressed={record.bookmarked}
          className={`min-h-[44px] min-w-[44px] -mt-1 -mr-1 rounded-xl flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-[#1D4ED8] ${
            record.bookmarked
              ? 'text-[#D97706] bg-[#FEF3C7]/60'
              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
          }`}
        >
          <Bookmark
            className="w-5 h-5"
            fill={record.bookmarked ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      {/* Question statement */}
      <p className="text-[15px] font-medium leading-[24px] text-[#0F172A] mb-3">
        {question.prompt}
      </p>

      {/* Answer comparison summary */}
      <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3 mb-3 flex flex-col gap-1.5">
        <div className="flex items-start gap-2 text-[13px] leading-[19px]">
          <span className="font-semibold text-[#E11D48] shrink-0 w-14">내 답안</span>
          <span className="text-[#475569]">{myAnswerText}</span>
        </div>
        <div className="flex items-start gap-2 text-[13px] leading-[19px]">
          <span className="font-semibold text-[#059669] shrink-0 w-14">정답</span>
          <span className="text-[#0F172A] font-medium">
            {OPTION_CIRCLES[question.correctIndex]} {question.options[question.correctIndex]}
          </span>
        </div>
      </div>

      {/* Collapsible Explanation Accordion */}
      <div className="rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] overflow-hidden mb-3">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          className="w-full min-h-[44px] px-3.5 py-2 flex items-center justify-between text-left hover:bg-[#E2E8F0]/50 transition-colors"
        >
          <span className="text-[13.5px] font-semibold text-[#0F172A]">
            {expanded ? '풀이 공식 접기' : '풀이 공식 및 도해 보기'}
          </span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-[#475569] shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#475569] shrink-0" />
          )}
        </button>

        {expanded && (
          <div className="px-3.5 pb-3.5 pt-2 border-t border-[#E2E8F0] flex flex-col gap-3">
            {question.schematic && (
              <SchematicDiagram
                type={question.schematic}
                formulaBox={question.formulaBox}
              />
            )}
            <p className="text-[13.5px] leading-[21px] text-[#334155]">
              {question.explanation}
            </p>
            <div className="rounded-lg bg-white border border-[#E2E8F0] p-2.5 overflow-x-auto formula-scroll">
              <div className="flex flex-col gap-1">
                {question.formulaSteps.map((step, i) => (
                  <p
                    key={i}
                    className="font-mono-tech text-[12px] leading-[18px] text-[#0F172A] whitespace-nowrap"
                  >
                    {step}
                  </p>
                ))}
              </div>
            </div>
            <p className="text-[12.5px] font-medium text-[#1D4ED8]">
              핵심 포인트 · {question.keyTakeaway}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons Row */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() =>
            onChangeStatus(
              question.id,
              record.status === 'hold' ? 'incorrect' : 'hold'
            )
          }
          className={`min-h-[44px] rounded-xl px-2 text-[13px] font-semibold flex items-center justify-center gap-1 border transition-colors whitespace-nowrap ${
            record.status === 'hold'
              ? 'bg-[#FEF3C7] border-[#D97706] text-[#904D00]'
              : 'bg-white border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]'
          }`}
        >
          <Clock className="w-3.5 h-3.5 shrink-0" />
          오답보류
        </button>

        <button
          type="button"
          onClick={() =>
            onChangeStatus(
              question.id,
              record.status === 'mastered' ? 'incorrect' : 'mastered'
            )
          }
          className={`min-h-[44px] rounded-xl px-2 text-[13px] font-semibold flex items-center justify-center gap-1 border transition-colors whitespace-nowrap ${
            record.status === 'mastered'
              ? 'bg-[#ECFDF5] border-[#059669] text-[#059669]'
              : 'bg-white border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          복습완료
        </button>

        <button
          type="button"
          onClick={() => onReSolve(question.id)}
          className="min-h-[44px] rounded-xl px-2 text-[13px] font-semibold flex items-center justify-center gap-1 bg-[#1D4ED8] text-white hover:bg-[#1E40AF] active:scale-[0.98] transition-all whitespace-nowrap"
        >
          <RotateCcw className="w-3.5 h-3.5 shrink-0" />
          다시 풀기
        </button>
      </div>
    </article>
  );
};
