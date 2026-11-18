import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  Lightbulb,
  RotateCcw,
} from 'lucide-react';
import { EXAM_SESSIONS, EXAM_YEARS, QUESTIONS } from '../data/questions';
import {
  AttemptRecord,
  ExamSessionId,
  ExamYear,
} from '../types/study';

interface CoverViewProps {
  selectedYear: ExamYear;
  selectedSessionId: ExamSessionId;
  records: Record<string, AttemptRecord>;
  activeWrongCount: number;
  overallAccuracy: number;
  onSelectYear: (year: ExamYear) => void;
  onSelectSession: (sessionId: ExamSessionId) => void;
  onStartQuiz: () => void;
  onStartWrongReview: () => void;
  onResetProgress: () => void;
}

export const CoverView: React.FC<CoverViewProps> = ({
  selectedYear,
  selectedSessionId,
  records,
  activeWrongCount,
  overallAccuracy,
  onSelectYear,
  onSelectSession,
  onStartQuiz,
  onStartWrongReview,
  onResetProgress,
}) => {
  const [guideOpen, setGuideOpen] = useState(true);
  const [confirmReset, setConfirmReset] = useState(false);

  const visibleSessions =
    selectedYear === 'all'
      ? EXAM_SESSIONS
      : EXAM_SESSIONS.filter((s) => s.year === selectedYear);

  // Calculate solved / total for currently selected session
  const selectedQuestions =
    selectedSessionId === 'all'
      ? QUESTIONS
      : QUESTIONS.filter((q) => q.sessionId === selectedSessionId);

  const selectedSolvedCount = selectedQuestions.filter(
    (q) => Boolean(records[q.id])
  ).length;

  const selectedSessionLabel =
    selectedSessionId === 'all'
      ? '전체 과년도 기출'
      : EXAM_SESSIONS.find((s) => s.id === selectedSessionId)?.label ??
        '과년도 기출';

  const totalSolvedAll = Object.keys(records).length;

  return (
    <div className="lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:gap-6 lg:items-start">
      {/* Left Column: Cover Header & Year/Session Selection */}
      <div className="flex flex-col gap-4">
        {/* Front Cover Title Card */}
        <section className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-[0_2px_10px_-2px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-2 text-[12px] font-medium text-[#475569] mb-1.5">
            <div className="flex items-center gap-2">
              <span>국가기술자격 전기기사 필기</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#1D4ED8] font-semibold">1과목</span>
            </div>
            {(totalSolvedAll > 0 || activeWrongCount > 0) && !confirmReset && (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#64748B] hover:text-[#E11D48] transition-colors py-1 px-1.5 -mr-1.5 rounded-lg"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                기록 초기화
              </button>
            )}
          </div>

          {confirmReset && (
            <div className="mb-3 rounded-xl bg-[#FFF1F2] border border-[#E11D48]/30 p-3 flex items-center justify-between gap-2">
              <span className="text-[12.5px] font-semibold text-[#93000A]">
                풀이 및 오답 기록을 초기화할까요?
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-[12px] font-semibold text-[#475569]"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onResetProgress();
                    setConfirmReset(false);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-[#E11D48] text-white text-[12px] font-semibold"
                >
                  초기화
                </button>
              </div>
            </div>
          )}

          <h1 className="text-[24px] leading-[34px] font-bold text-[#0F172A] tracking-tight mb-1">
            전력공학 과년도 기출
          </h1>
          <p className="text-[14px] leading-[22px] text-[#475569] mb-4">
            연도별 기출 회차를 선택해 출퇴근길 한 손으로 빠르게 풀어보세요.
          </p>

          {/* Clean unboxed metrics bar */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#F1F5F9]">
            <div>
              <span className="block text-[11px] font-medium text-[#64748B]">
                누적 풀이
              </span>
              <span className="font-mono-tech text-[17px] font-bold text-[#0F172A] tabular-nums">
                {totalSolvedAll}/{QUESTIONS.length}
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-medium text-[#64748B]">
                평균 정답률
              </span>
              <span className="font-mono-tech text-[17px] font-bold text-[#1D4ED8] tabular-nums">
                {overallAccuracy}%
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-medium text-[#64748B]">
                오답노트
              </span>
              <span className="font-mono-tech text-[17px] font-bold text-[#E11D48] tabular-nums">
                {activeWrongCount}문항
              </span>
            </div>
          </div>
        </section>

        {/* Year & Session Selection */}
        <section className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-[0_2px_10px_-2px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="text-[15px] font-bold text-[#0F172A]">
              과년도 회차 선택
            </h2>
            <span className="font-mono-tech text-[12px] text-[#64748B]">
              2021–2024
            </span>
          </div>

          {/* Year Tabs */}
          <div
            className="grid grid-cols-5 gap-1 p-1 bg-[#F1F5F9] rounded-xl mb-3"
            role="tablist"
            aria-label="과년도 연도 선택"
          >
            {EXAM_YEARS.map((y) => {
              const active = selectedYear === y.id;
              return (
                <button
                  key={y.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onSelectYear(y.id)}
                  className={`min-h-[38px] rounded-lg text-[13px] font-semibold transition-all whitespace-nowrap ${
                    active
                      ? 'bg-white text-[#1D4ED8] shadow-xs'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {y.label}
                </button>
              );
            })}
          </div>

          {/* Session Cards */}
          <div className="flex flex-col gap-2.5">
            {visibleSessions.map((session) => {
              const sessionQuestions = QUESTIONS.filter(
                (q) => q.sessionId === session.id
              );
              const solvedCount = sessionQuestions.filter(
                (q) => Boolean(records[q.id])
              ).length;
              const correctCount = sessionQuestions.filter((q) => {
                const rec = records[q.id];
                return rec && (rec.status === 'correct' || rec.status === 'mastered');
              }).length;
              const isSelected = selectedSessionId === session.id;
              const pct =
                sessionQuestions.length > 0
                  ? Math.round((solvedCount / sessionQuestions.length) * 100)
                  : 0;

              return (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => onSelectSession(session.id)}
                  aria-pressed={isSelected}
                  className={`w-full rounded-xl p-3.5 text-left transition-all ${
                    isSelected
                      ? 'bg-[#EFF6FF]/70 border-2 border-[#1D4ED8]'
                      : 'bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#94A3B8]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[15px] font-bold ${
                            isSelected ? 'text-[#1D4ED8]' : 'text-[#0F172A]'
                          }`}
                        >
                          {session.label}
                        </span>
                        {isSelected && (
                          <CheckCircle2
                            className="w-4 h-4 text-[#1D4ED8] shrink-0"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <p className="text-[12px] text-[#475569] mt-0.5">
                        {session.subtitle}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono-tech text-[13px] font-bold text-[#0F172A] tabular-nums">
                        {solvedCount}/{sessionQuestions.length}
                      </span>
                      {solvedCount > 0 && (
                        <span className="block font-mono-tech text-[11px] text-[#059669] tabular-nums">
                          정답 {correctCount}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Thin session progress bar */}
                  <div className="h-1.5 w-full bg-[#E2E8F0] rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full rounded-full transition-all duration-200 ${
                        isSelected ? 'bg-[#1D4ED8]' : 'bg-[#64748B]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </button>
              );
            })}

            {/* Option to solve all sessions together */}
            {selectedYear === 'all' && (
              <button
                type="button"
                onClick={() => onSelectSession('all')}
                aria-pressed={selectedSessionId === 'all'}
                className={`w-full rounded-xl p-3.5 text-left transition-all ${
                  selectedSessionId === 'all'
                    ? 'bg-[#EFF6FF]/70 border-2 border-[#1D4ED8]'
                    : 'bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#94A3B8]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span
                      className={`text-[15px] font-bold ${
                        selectedSessionId === 'all'
                          ? 'text-[#1D4ED8]'
                          : 'text-[#0F172A]'
                      }`}
                    >
                      전체 과년도 통합 풀기
                    </span>
                    <p className="text-[12px] text-[#475569] mt-0.5">
                      2021–2024년 수록 문항 전체 순차 학습
                    </p>
                  </div>
                  <span className="font-mono-tech text-[13px] font-bold text-[#0F172A] tabular-nums">
                    {totalSolvedAll}/{QUESTIONS.length}
                  </span>
                </div>
              </button>
            )}
          </div>
        </section>
      </div>

      {/* Right Column (or Lower Stack on Mobile): Study Guide Card + Replay Toggle + Start CTA */}
      <div className="flex flex-col gap-3.5 mt-4 lg:mt-0">
        {/* 이렇게 공부해보세요 Collapsible Guide Card */}
        {guideOpen && (
          <section
            aria-label="학습 가이드"
            className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-[0_2px_10px_-2px_rgba(15,23,42,0.04)]"
          >
            <button
              type="button"
              onClick={() => setGuideOpen(false)}
              aria-expanded={guideOpen}
              className="w-full flex items-center justify-between gap-2 pb-3 text-left"
            >
              <span className="flex items-center gap-2 text-[15px] font-bold text-[#0F172A]">
                <Lightbulb className="w-4 h-4 text-[#D97706] shrink-0" />
                이렇게 공부해보세요
              </span>
              <ChevronUp className="w-4 h-4 text-[#64748B] shrink-0" />
            </button>

            <div className="flex flex-col gap-3.5 pt-1">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#DBEAFE] text-[#1D4ED8] font-mono-tech text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <h3 className="text-[14px] font-bold text-[#0F172A]">
                    문제를 풀어요
                  </h3>
                  <p className="text-[13px] leading-[20px] text-[#475569] mt-0.5">
                    출퇴근길 한 손 조작으로 답안을 가볍게 터치하세요.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#FFEDD5] text-[#D97706] font-mono-tech text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <h3 className="text-[14px] font-bold text-[#0F172A]">
                    틀리거나 모르는 문제는 자동 저장돼요
                  </h3>
                  <p className="text-[13px] leading-[20px] text-[#475569] mt-0.5">
                    애매한 문제는 고민 없이 하단 &apos;모르겠어요&apos;를 누르세요.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#D1FAE5] text-[#059669] font-mono-tech text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <h3 className="text-[14px] font-bold text-[#0F172A]">
                    오답노트에서 다시 풀어요
                  </h3>
                  <p className="text-[13px] leading-[20px] text-[#475569] mt-0.5">
                    상세한 수식 풀이와 핵심 요약 공식으로 완벽히 정복합니다.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3초 사용 방법 다시보기 Toggle Link */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setGuideOpen((prev) => !prev)}
            className="min-h-[36px] px-3 py-1 rounded-lg text-[13px] font-medium text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] inline-flex items-center gap-1.5 transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-[#64748B]" />
            <Lightbulb className="w-3.5 h-3.5 text-[#D97706]" />
            <span>{guideOpen ? '3초 사용 방법 접기' : '3초 사용 방법 다시보기'}</span>
            {!guideOpen && <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />}
          </button>
        </div>

        {/* Primary Bottom Start CTA Button */}
        <button
          type="button"
          onClick={onStartQuiz}
          className="w-full h-[56px] rounded-2xl bg-[#1D4ED8] hover:bg-[#1E40AF] active:scale-[0.98] text-white font-bold text-[17px] px-5 flex items-center justify-center gap-2 shadow-[0_4px_14px_-2px_rgba(29,78,216,0.32)] transition-all whitespace-nowrap"
        >
          <span className="truncate">
            {selectedSessionLabel} 시작하기 ({selectedSolvedCount}/
            {selectedQuestions.length})
          </span>
          <ArrowRight className="w-5 h-5 shrink-0" />
        </button>

        {/* Secondary quick shortcut to review wrong answers */}
        {activeWrongCount > 0 && (
          <button
            type="button"
            onClick={onStartWrongReview}
            className="w-full h-[48px] rounded-2xl border border-[#E2E8F0] bg-white hover:bg-[#FFF1F2]/60 hover:border-[#E11D48]/40 text-[#E11D48] font-semibold text-[14px] flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4 shrink-0" />
            미해결 오답만 바로 풀기 ({activeWrongCount}문항)
          </button>
        )}
      </div>
    </div>
  );
};
