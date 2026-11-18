import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  HelpCircle,
  NotebookPen,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import {
  CHAPTER_TABS,
  CORE_FORMULAS,
  EXAM_SESSIONS,
  QUESTIONS,
} from './data/questions';
import {
  AttemptRecord,
  ChapterId,
  ExamSessionId,
  ExamYear,
  NotesFilter,
  QuizStage,
  ReviewStatus,
  TabId,
} from './types/study';
import { CoverView } from './components/CoverView';
import { QuestionCard } from './components/QuestionCard';
import { WrongNoteCard } from './components/WrongNoteCard';
import { FormulaModal } from './components/FormulaModal';

const STORAGE_KEY = 'power-circuit-study-records-v2';

const INITIAL_RECORDS: Record<string, AttemptRecord> = {
  'q-2021-2-02': {
    questionId: 'q-2021-2-02',
    selectedIndex: 0,
    isCorrect: false,
    status: 'incorrect',
    bookmarked: true,
    attemptsCount: 1,
    updatedAt: Date.now() - 3600 * 1000 * 5,
  },
  'q-2021-2-04': {
    questionId: 'q-2021-2-04',
    selectedIndex: 0,
    isCorrect: false,
    status: 'hold',
    bookmarked: false,
    attemptsCount: 1,
    updatedAt: Date.now() - 3600 * 1000 * 2,
  },
};

function loadInitialRecords(): Record<string, AttemptRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_RECORDS;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
    return INITIAL_RECORDS;
  } catch {
    return INITIAL_RECORDS;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('quiz');
  const [quizStage, setQuizStage] = useState<QuizStage>('cover');
  const [selectedYear, setSelectedYear] = useState<ExamYear>('2021');
  const [selectedSessionId, setSelectedSessionId] =
    useState<ExamSessionId>('2021-2');

  const [chapterFilter, setChapterFilter] = useState<ChapterId>('all');
  const [notesFilter, setNotesFilter] = useState<NotesFilter>('all');
  const [records, setRecords] =
    useState<Record<string, AttemptRecord>>(loadInitialRecords);

  // Quiz session state
  const [reviewOnlyMode, setReviewOnlyMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formulaModalOpen, setFormulaModalOpen] = useState(false);
  const [confirmResetNotes, setConfirmResetNotes] = useState(false);

  // Persist records
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch {
      // Ignore storage quota errors
    }
  }, [records]);

  // Base questions for selected past-exam session (or review-only mode)
  const sessionBaseQuestions = useMemo(() => {
    if (reviewOnlyMode) {
      const reviewList = QUESTIONS.filter((q) => {
        const rec = records[q.id];
        return rec && (rec.status === 'incorrect' || rec.status === 'hold');
      });
      if (reviewList.length > 0) return reviewList;
    }
    if (selectedSessionId === 'all') return QUESTIONS;
    return QUESTIONS.filter((q) => q.sessionId === selectedSessionId);
  }, [selectedSessionId, reviewOnlyMode, records]);

  // Filtered by chapter inside solving view
  const filteredQuestions = useMemo(() => {
    if (chapterFilter === 'all') return sessionBaseQuestions;
    const byChapter = sessionBaseQuestions.filter(
      (q) => q.chapter === chapterFilter
    );
    return byChapter.length > 0 ? byChapter : sessionBaseQuestions;
  }, [sessionBaseQuestions, chapterFilter]);

  useEffect(() => {
    if (currentIndex >= filteredQuestions.length) {
      setCurrentIndex(0);
    }
  }, [filteredQuestions.length, currentIndex]);

  const currentQuestion = filteredQuestions[currentIndex] ?? QUESTIONS[0];

  // Note items
  const noteItems = useMemo(() => {
    return QUESTIONS.map((q) => ({
      question: q,
      record: records[q.id],
    })).filter(({ record }) => {
      if (!record) return false;
      return (
        record.status === 'incorrect' ||
        record.status === 'hold' ||
        record.status === 'mastered' ||
        record.bookmarked
      );
    });
  }, [records]);

  const activeWrongCount = useMemo(() => {
    return Object.values(records).filter(
      (r) => r.status === 'incorrect' || r.status === 'hold'
    ).length;
  }, [records]);

  const filteredNoteItems = useMemo(() => {
    return noteItems.filter(({ record }) => {
      if (!record) return false;
      switch (notesFilter) {
        case 'unresolved':
          return record.status === 'incorrect';
        case 'hold':
          return record.status === 'hold';
        case 'mastered':
          return record.status === 'mastered';
        case 'bookmarked':
          return record.bookmarked;
        default:
          return true;
      }
    });
  }, [noteItems, notesFilter]);

  // Study statistics
  const stats = useMemo(() => {
    const allRecs = Object.values(records);
    const totalAnswered = allRecs.length;
    const correctCount = allRecs.filter(
      (r) => r.status === 'correct' || r.status === 'mastered'
    ).length;
    const holdCount = allRecs.filter((r) => r.status === 'hold').length;
    const incorrectCount = allRecs.filter(
      (r) => r.status === 'incorrect'
    ).length;
    const accuracy =
      totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    return {
      totalQuestions: QUESTIONS.length,
      totalAnswered,
      correctCount,
      holdCount,
      incorrectCount,
      accuracy,
    };
  }, [records]);

  const handleSelectYearOnCover = (year: ExamYear) => {
    setSelectedYear(year);
    if (year === 'all') {
      setSelectedSessionId('all');
      return;
    }
    const matching = EXAM_SESSIONS.filter((s) => s.year === year);
    if (matching.length > 0 && !matching.some((s) => s.id === selectedSessionId)) {
      setSelectedSessionId(matching[0].id);
    }
  };

  const handleStartFromCover = () => {
    setReviewOnlyMode(false);
    setChapterFilter('all');

    // Jump to first unsolved question in the selected session if any
    const targetList =
      selectedSessionId === 'all'
        ? QUESTIONS
        : QUESTIONS.filter((q) => q.sessionId === selectedSessionId);
    const firstUnsolvedIdx = targetList.findIndex((q) => !records[q.id]);

    setCurrentIndex(firstUnsolvedIdx >= 0 ? firstUnsolvedIdx : 0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setQuizStage('solving');
    setActiveTab('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCover = () => {
    setQuizStage('cover');
    setActiveTab('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectChapter = (nextChapter: ChapterId) => {
    setReviewOnlyMode(false);
    setChapterFilter(nextChapter);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentIndex(index);
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isSubmitted) return;
    const isCorrect = selectedOption === currentQuestion.correctIndex;
    setIsSubmitted(true);

    setRecords((prev) => {
      const existing = prev[currentQuestion.id];
      const wasWrongBefore =
        existing &&
        (existing.status === 'incorrect' || existing.status === 'hold');

      return {
        ...prev,
        [currentQuestion.id]: {
          questionId: currentQuestion.id,
          selectedIndex: selectedOption,
          isCorrect,
          status: isCorrect
            ? wasWrongBefore
              ? 'mastered'
              : 'correct'
            : 'incorrect',
          bookmarked: existing?.bookmarked ?? false,
          attemptsCount: (existing?.attemptsCount ?? 0) + 1,
          updatedAt: Date.now(),
        },
      };
    });
  };

  const handleSkipUnknown = () => {
    if (isSubmitted) return;
    setSelectedOption(null);
    setIsSubmitted(true);

    setRecords((prev) => {
      const existing = prev[currentQuestion.id];
      return {
        ...prev,
        [currentQuestion.id]: {
          questionId: currentQuestion.id,
          selectedIndex: null,
          isCorrect: false,
          status: 'incorrect',
          bookmarked: existing?.bookmarked ?? false,
          attemptsCount: (existing?.attemptsCount ?? 0) + 1,
          updatedAt: Date.now(),
        },
      };
    });
  };

  const handleToggleHoldCurrent = () => {
    const existing = records[currentQuestion.id];
    const nextStatus: ReviewStatus =
      existing?.status === 'hold'
        ? existing.isCorrect
          ? 'mastered'
          : 'incorrect'
        : 'hold';

    setRecords((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        selectedIndex: existing?.selectedIndex ?? selectedOption,
        isCorrect: existing?.isCorrect ?? false,
        status: nextStatus,
        bookmarked: existing?.bookmarked ?? false,
        attemptsCount: existing?.attemptsCount ?? 1,
        updatedAt: Date.now(),
      },
    }));
  };

  const handleNextQuestion = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
    setSelectedOption(null);
    setIsSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleToggleBookmark = (questionId: string) => {
    setRecords((prev) => {
      const existing = prev[questionId];
      if (existing) {
        return {
          ...prev,
          [questionId]: {
            ...existing,
            bookmarked: !existing.bookmarked,
            updatedAt: Date.now(),
          },
        };
      }
      return {
        ...prev,
        [questionId]: {
          questionId,
          selectedIndex: null,
          isCorrect: false,
          status: 'hold',
          bookmarked: true,
          attemptsCount: 0,
          updatedAt: Date.now(),
        },
      };
    });
  };

  const handleChangeNoteStatus = (questionId: string, status: ReviewStatus) => {
    setRecords((prev) => {
      const existing = prev[questionId];
      if (!existing) return prev;
      return {
        ...prev,
        [questionId]: {
          ...existing,
          status,
          updatedAt: Date.now(),
        },
      };
    });
  };

  const handleReSolveFromNote = (questionId: string) => {
    const targetQ = QUESTIONS.find((q) => q.id === questionId);
    if (!targetQ) return;

    setReviewOnlyMode(false);
    setChapterFilter('all');
    setSelectedYear(targetQ.examYear);
    setSelectedSessionId(targetQ.sessionId);

    const sessionList = QUESTIONS.filter(
      (q) => q.sessionId === targetQ.sessionId
    );
    const idx = sessionList.findIndex((q) => q.id === questionId);

    setCurrentIndex(idx >= 0 ? idx : 0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setQuizStage('solving');
    setActiveTab('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartReviewQuiz = () => {
    if (activeWrongCount === 0) return;
    setReviewOnlyMode(true);
    setChapterFilter('all');
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setQuizStage('solving');
    setActiveTab('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetProgress = () => {
    setRecords({});
    setReviewOnlyMode(false);
    setChapterFilter('all');
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  // Keyboard shortcuts for desktop ergonomics
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== 'quiz' || quizStage !== 'solving' || formulaModalOpen) {
        return;
      }
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (!isSubmitted && ['1', '2', '3', '4'].includes(e.key)) {
        setSelectedOption(Number(e.key) - 1);
      } else if (e.key === 'Enter') {
        if (!isSubmitted && selectedOption !== null) {
          handleSubmitAnswer();
        } else if (isSubmitted) {
          handleNextQuestion();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const currentRecord = records[currentQuestion.id];
  const isCurrentHold = currentRecord?.status === 'hold';
  const progressPercent = Math.round(
    ((currentIndex + 1) / Math.max(filteredQuestions.length, 1)) * 100
  );

  const activeSessionTitle = reviewOnlyMode
    ? '오답 집중 풀이'
    : selectedSessionId === 'all'
    ? '전체 과년도'
    : EXAM_SESSIONS.find((s) => s.id === selectedSessionId)?.label ?? '기출 풀이';

  const chapterFormulas = useMemo(
    () => CORE_FORMULAS.filter((f) => f.chapter === currentQuestion.chapter),
    [currentQuestion.chapter]
  );

  return (
    <div className="min-h-dvh bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 h-14 lg:h-16 flex items-center justify-between gap-4 lg:gap-8">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              handleBackToCover();
            }}
            className="text-[17px] lg:text-[18px] font-bold tracking-tight text-[#0F172A] whitespace-nowrap shrink-0"
          >
            전기기사 전력공학
          </a>

          {/* Zone 2: Desktop Navigation Links */}
          <nav
            className="hidden lg:flex items-center gap-8"
            aria-label="주 메뉴"
          >
            <button
              type="button"
              onClick={() => {
                setActiveTab('quiz');
              }}
              className={`relative py-5 text-[15px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'quiz'
                  ? 'text-[#1D4ED8]'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              문제 풀기
              {activeTab === 'quiz' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1D4ED8] rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('notes')}
              className={`relative py-5 text-[15px] font-semibold transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'notes'
                  ? 'text-[#1D4ED8]'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              오답노트
              {activeWrongCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#E11D48] text-white font-mono-tech text-[11px] font-bold">
                  {activeWrongCount}
                </span>
              )}
              {activeTab === 'notes' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1D4ED8] rounded-full" />
              )}
            </button>
          </nav>

          {/* Zone 3: Single Primary Action (Formula Reference) */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setFormulaModalOpen(true)}
              className="min-h-[40px] px-3.5 py-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#EFF6FF] hover:border-[#1D4ED8]/40 text-[13px] font-semibold text-[#1D4ED8] flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              핵심 공식집
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-[440px] lg:max-w-6xl mx-auto px-4 lg:px-6 pt-4 pb-24 lg:py-8">
        {activeTab === 'quiz' ? (
          quizStage === 'cover' ? (
            /* 앞표지 (Front Cover & Past-Exam Selector) */
            <CoverView
              selectedYear={selectedYear}
              selectedSessionId={selectedSessionId}
              records={records}
              activeWrongCount={activeWrongCount}
              overallAccuracy={stats.accuracy}
              onSelectYear={handleSelectYearOnCover}
              onSelectSession={(sessionId) => {
                setSelectedSessionId(sessionId);
                if (sessionId !== 'all') {
                  const found = EXAM_SESSIONS.find((s) => s.id === sessionId);
                  if (found) setSelectedYear(found.year);
                }
              }}
              onStartQuiz={handleStartFromCover}
              onStartWrongReview={handleStartReviewQuiz}
              onResetProgress={handleResetProgress}
            />
          ) : (
            /* 문제 풀기 화면 */
            <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)_300px] lg:gap-6 lg:items-start">
              {/* Desktop Left Rail: Back to Cover + Chapter Filter + Question Navigator */}
              <aside className="hidden lg:flex flex-col gap-4">
                <button
                  type="button"
                  onClick={handleBackToCover}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#1D4ED8]/50 text-[13.5px] font-semibold text-[#0F172A] flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4 text-[#1D4ED8]" />
                    과년도 표지로
                  </span>
                  <span className="font-mono-tech text-[11px] text-[#475569]">
                    {activeSessionTitle}
                  </span>
                </button>

                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
                  <h2 className="text-[14px] font-bold text-[#0F172A] mb-3">
                    단원별 필터
                  </h2>
                  <div className="flex flex-col gap-1.5">
                    {CHAPTER_TABS.map((tab) => {
                      const count =
                        tab.id === 'all'
                          ? sessionBaseQuestions.length
                          : sessionBaseQuestions.filter(
                              (q) => q.chapter === tab.id
                            ).length;
                      if (tab.id !== 'all' && count === 0) return null;
                      const isActive =
                        !reviewOnlyMode && chapterFilter === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => handleSelectChapter(tab.id)}
                          className={`w-full px-3 py-2.5 rounded-xl text-left text-[13.5px] font-semibold transition-colors flex items-center justify-between ${
                            isActive
                              ? 'bg-[#EFF6FF] text-[#1D4ED8]'
                              : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                          }`}
                        >
                          <span className="truncate">{tab.label}</span>
                          <span className="font-mono-tech text-[11px] opacity-80">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {activeWrongCount > 0 && (
                    <button
                      type="button"
                      onClick={handleStartReviewQuiz}
                      className={`mt-3 w-full py-2.5 px-3 rounded-xl text-[13px] font-semibold border transition-colors flex items-center justify-between ${
                        reviewOnlyMode
                          ? 'bg-[#FFF1F2] border-[#E11D48] text-[#E11D48]'
                          : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#E11D48] hover:bg-[#FFF1F2]'
                      }`}
                    >
                      <span>오답 집중 풀이</span>
                      <span className="font-mono-tech text-[12px] font-bold">
                        {activeWrongCount}문항
                      </span>
                    </button>
                  )}
                </div>

                {/* Numbered Question Grid */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[14px] font-bold text-[#0F172A]">
                      문항 이동
                    </h2>
                    <span className="font-mono-tech text-[12px] text-[#64748B]">
                      {currentIndex + 1}/{filteredQuestions.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {filteredQuestions.map((q, idx) => {
                      const rec = records[q.id];
                      const isCurrent = idx === currentIndex;
                      let cellStyle =
                        'bg-[#F8FAFC] border-[#E2E8F0] text-[#475569] hover:border-[#94A3B8]';

                      if (
                        rec?.status === 'correct' ||
                        rec?.status === 'mastered'
                      ) {
                        cellStyle =
                          'bg-[#ECFDF5] border-[#059669]/40 text-[#059669]';
                      } else if (rec?.status === 'hold') {
                        cellStyle =
                          'bg-[#FEF3C7] border-[#D97706]/50 text-[#904D00]';
                      } else if (rec?.status === 'incorrect') {
                        cellStyle =
                          'bg-[#FFF1F2] border-[#E11D48]/40 text-[#E11D48]';
                      }

                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => handleJumpToQuestion(idx)}
                          className={`h-10 rounded-xl border font-mono-tech text-[12.5px] font-semibold transition-all ${cellStyle} ${
                            isCurrent ? 'ring-2 ring-[#1D4ED8] ring-offset-1' : ''
                          }`}
                        >
                          {q.numberLabel.replace('Q.', '')}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </aside>

              {/* Center Stage: Mobile Back + Session Header + Question Card + Thumb-Zone Actions */}
              <section className="flex flex-col gap-3.5">
                {/* Mobile Back-to-Cover & Active Session Strip */}
                <div className="lg:hidden flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleBackToCover}
                    className="min-h-[38px] px-3 py-1.5 rounded-xl bg-white border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] inline-flex items-center gap-1.5 hover:bg-[#F1F5F9] transition-colors shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#1D4ED8]" />
                    과년도 표지
                  </button>

                  <span className="font-mono-tech text-[12.5px] font-semibold text-[#1D4ED8] truncate">
                    {activeSessionTitle}
                  </span>
                </div>

                {/* Compact Progress Bar Row */}
                <div className="flex items-center justify-between gap-3 px-0.5">
                  <div className="flex items-center gap-2 min-w-0">
                    {reviewOnlyMode && (
                      <span className="text-[12px] font-semibold text-[#E11D48] shrink-0">
                        오답 집중 ·
                      </span>
                    )}
                    <span className="font-mono-tech text-[13px] font-semibold text-[#475569] tabular-nums">
                      {String(currentIndex + 1).padStart(2, '0')} /{' '}
                      {String(filteredQuestions.length).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex-1 max-w-[180px] h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1D4ED8] rounded-full transition-all duration-200"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handlePrevQuestion}
                      disabled={currentIndex === 0}
                      aria-label="이전 문제"
                      className="min-h-[36px] min-w-[36px] rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-center text-[#475569] disabled:opacity-40 hover:bg-[#F1F5F9] transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      aria-label="다음 문제"
                      className="min-h-[36px] min-w-[36px] rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-center text-[#475569] hover:bg-[#F1F5F9] transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Active Question Card */}
                <QuestionCard
                  question={currentQuestion}
                  selectedOption={selectedOption}
                  isSubmitted={isSubmitted}
                  attemptRecord={currentRecord}
                  onSelectOption={setSelectedOption}
                  onToggleBookmark={handleToggleBookmark}
                />

                {/* Ergonomic Thumb-Zone Action Controls (56px height, dual split) */}
                <div className="pt-1">
                  {!isSubmitted ? (
                    <div className="grid grid-cols-[1fr_1.45fr] gap-2.5">
                      <button
                        type="button"
                        onClick={handleSkipUnknown}
                        className="h-[56px] rounded-2xl border border-[#CBD5E1] bg-white text-[#475569] font-semibold text-[15px] flex items-center justify-center gap-1.5 hover:bg-[#F1F5F9] active:scale-[0.98] transition-all whitespace-nowrap"
                      >
                        <HelpCircle className="w-4 h-4 shrink-0" />
                        모르겠어요
                      </button>

                      <button
                        type="button"
                        onClick={handleSubmitAnswer}
                        disabled={selectedOption === null}
                        className="h-[56px] rounded-2xl bg-[#1D4ED8] text-white font-bold text-[17px] flex items-center justify-center hover:bg-[#1E40AF] active:scale-[0.98] disabled:bg-[#CBD5E1] disabled:text-[#64748B] disabled:active:scale-100 transition-all whitespace-nowrap shadow-[0_4px_12px_-2px_rgba(29,78,216,0.28)] disabled:shadow-none"
                      >
                        정답 확인
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-[1fr_1.45fr] gap-2.5">
                      <button
                        type="button"
                        onClick={handleToggleHoldCurrent}
                        className={`h-[56px] rounded-2xl border font-semibold text-[15px] flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all whitespace-nowrap ${
                          isCurrentHold
                            ? 'bg-[#FEF3C7] border-[#D97706] text-[#904D00]'
                            : 'bg-white border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        <Clock className="w-4 h-4 shrink-0" />
                        {isCurrentHold ? '오답보류 해제' : '오답보류'}
                      </button>

                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        className="h-[56px] rounded-2xl bg-[#1D4ED8] text-white font-bold text-[17px] flex items-center justify-center gap-1.5 hover:bg-[#1E40AF] active:scale-[0.98] transition-all whitespace-nowrap shadow-[0_4px_12px_-2px_rgba(29,78,216,0.28)]"
                      >
                        {currentIndex < filteredQuestions.length - 1
                          ? '다음 문제'
                          : '처음 문항으로'}
                        <ChevronRight className="w-5 h-5 shrink-0" />
                      </button>
                    </div>
                  )}

                  <p className="hidden lg:block text-center text-[12px] text-[#64748B] mt-2.5 font-mono-tech">
                    단축키: 1–4 보기 선택 · Enter 정답 확인 / 다음 문제
                  </p>
                </div>
              </section>

              {/* Desktop Right Rail: Accuracy Metrics & Contextual Formula Preview */}
              <aside className="hidden lg:flex flex-col gap-4">
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[14px] font-bold text-[#0F172A]">
                      학습 현황
                    </h2>
                    <button
                      type="button"
                      onClick={handleResetProgress}
                      className="text-[12px] font-medium text-[#64748B] hover:text-[#E11D48] transition-colors flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      초기화
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 mb-3">
                    <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3">
                      <span className="text-[12px] text-[#475569] block mb-0.5">
                        정답률
                      </span>
                      <span className="font-mono-tech text-[22px] font-bold text-[#1D4ED8] tabular-nums">
                        {stats.accuracy}%
                      </span>
                    </div>
                    <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3">
                      <span className="text-[12px] text-[#475569] block mb-0.5">
                        누적 진도
                      </span>
                      <span className="font-mono-tech text-[22px] font-bold text-[#0F172A] tabular-nums">
                        {stats.totalAnswered}/{stats.totalQuestions}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[13px] py-1.5 border-t border-[#F1F5F9]">
                    <span className="text-[#475569]">정답 및 복습완료</span>
                    <span className="font-mono-tech font-semibold text-[#059669] tabular-nums">
                      {stats.correctCount}문항
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[13px] py-1.5 border-t border-[#F1F5F9]">
                    <span className="text-[#475569]">미해결 오답</span>
                    <span className="font-mono-tech font-semibold text-[#E11D48] tabular-nums">
                      {stats.incorrectCount}문항
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[13px] py-1.5 border-t border-[#F1F5F9]">
                    <span className="text-[#475569]">오답보류</span>
                    <span className="font-mono-tech font-semibold text-[#D97706] tabular-nums">
                      {stats.holdCount}문항
                    </span>
                  </div>
                </div>

                {/* Contextual Chapter Formulas */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[14px] font-bold text-[#0F172A]">
                      {currentQuestion.chapterLabel} 공식
                    </h2>
                    <button
                      type="button"
                      onClick={() => setFormulaModalOpen(true)}
                      className="text-[12px] font-semibold text-[#1D4ED8] hover:underline"
                    >
                      전체 보기
                    </button>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {chapterFormulas.map((f) => (
                      <div
                        key={f.id}
                        className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-3"
                      >
                        <p className="text-[12.5px] font-semibold text-[#0F172A] mb-1">
                          {f.title}
                        </p>
                        <p className="font-mono-tech text-[12px] font-medium text-[#1D4ED8] overflow-x-auto formula-scroll whitespace-nowrap pb-0.5">
                          {f.equation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          )
        ) : (
          /* 오답노트 (Incorrect Review Notebook) View */
          <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6 lg:items-start">
            {/* Summary & Filter Controls */}
            <aside className="mb-4 lg:mb-0 flex flex-col gap-3">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div>
                    <h1 className="text-[20px] font-bold text-[#0F172A]">
                      오답노트
                    </h1>
                    <p className="text-[13px] text-[#475569]">
                      틀린 문제와 보류 문항 집중 복습
                    </p>
                  </div>
                  <span className="font-mono-tech text-[22px] font-bold text-[#E11D48] tabular-nums">
                    {activeWrongCount}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                  <div className="rounded-xl bg-[#FFF1F2] py-2 px-1">
                    <span className="block text-[11px] font-semibold text-[#E11D48]">
                      오답
                    </span>
                    <span className="font-mono-tech text-[16px] font-bold text-[#E11D48] tabular-nums">
                      {stats.incorrectCount}
                    </span>
                  </div>
                  <div className="rounded-xl bg-[#FEF3C7] py-2 px-1">
                    <span className="block text-[11px] font-semibold text-[#904D00]">
                      오답보류
                    </span>
                    <span className="font-mono-tech text-[16px] font-bold text-[#D97706] tabular-nums">
                      {stats.holdCount}
                    </span>
                  </div>
                  <div className="rounded-xl bg-[#ECFDF5] py-2 px-1">
                    <span className="block text-[11px] font-semibold text-[#059669]">
                      복습완료
                    </span>
                    <span className="font-mono-tech text-[16px] font-bold text-[#059669] tabular-nums">
                      {
                        noteItems.filter((i) => i.record?.status === 'mastered')
                          .length
                      }
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleStartReviewQuiz}
                  disabled={activeWrongCount === 0}
                  className="w-full h-[48px] rounded-xl bg-[#1D4ED8] text-white font-semibold text-[15px] flex items-center justify-center gap-2 hover:bg-[#1E40AF] active:scale-[0.98] disabled:bg-[#CBD5E1] disabled:text-[#64748B] transition-all"
                >
                  <RotateCcw className="w-4 h-4 shrink-0" />
                  미해결 오답 다시 풀기 ({activeWrongCount})
                </button>

                {(noteItems.length > 0 || stats.totalAnswered > 0) && (
                  <div className="mt-2.5 pt-2.5 border-t border-[#F1F5F9]">
                    {!confirmResetNotes ? (
                      <button
                        type="button"
                        onClick={() => setConfirmResetNotes(true)}
                        className="w-full h-[40px] rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#FFF1F2] hover:border-[#E11D48]/40 text-[#475569] hover:text-[#E11D48] font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                        오답노트·풀이 기록 초기화
                      </button>
                    ) : (
                      <div className="rounded-xl bg-[#FFF1F2] border border-[#E11D48]/30 p-3 flex flex-col gap-2">
                        <p className="text-[12.5px] font-semibold text-[#93000A] text-center">
                          미해결 오답과 모든 풀이 기록을 초기화할까요?
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setConfirmResetNotes(false)}
                            className="h-[36px] rounded-lg bg-white border border-[#E2E8F0] text-[12.5px] font-semibold text-[#475569]"
                          >
                            취소
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleResetProgress();
                              setConfirmResetNotes(false);
                            }}
                            className="h-[36px] rounded-lg bg-[#E11D48] text-white text-[12.5px] font-semibold"
                          >
                            초기화 확인
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Status Filter Segmented Controls */}
              <div className="overflow-x-auto formula-scroll -mx-4 px-4 lg:mx-0 lg:px-0">
                <div className="flex lg:flex-col gap-1.5 w-max lg:w-full bg-transparent lg:bg-white lg:rounded-2xl lg:border lg:border-[#E2E8F0] lg:p-3">
                  {(
                    [
                      { id: 'all', label: '전체 기록', icon: FileText },
                      { id: 'unresolved', label: '미해결 오답', icon: XCircle },
                      { id: 'hold', label: '오답보류', icon: Clock },
                      { id: 'mastered', label: '복습완료', icon: CheckCircle2 },
                      { id: 'bookmarked', label: '북마크', icon: Bookmark },
                    ] as const
                  ).map((f) => {
                    const active = notesFilter === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setNotesFilter(f.id)}
                        className={`min-h-[40px] px-3 py-2 rounded-xl text-[13px] font-semibold flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors ${
                          active
                            ? 'bg-[#1D4ED8] text-white'
                            : 'bg-white lg:bg-transparent border border-[#E2E8F0] lg:border-0 text-[#475569] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        <f.icon className="w-4 h-4 shrink-0" />
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* Notes Feed */}
            <section className="flex flex-col gap-3.5 max-w-2xl">
              {filteredNoteItems.length > 0 ? (
                filteredNoteItems.map(({ question, record }) =>
                  record ? (
                    <WrongNoteCard
                      key={question.id}
                      question={question}
                      record={record}
                      onChangeStatus={handleChangeNoteStatus}
                      onToggleBookmark={handleToggleBookmark}
                      onReSolve={handleReSolveFromNote}
                    />
                  ) : null
                )
              ) : (
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-[16px] font-bold text-[#0F172A] mb-1">
                    해당 조건의 오답 기록이 없습니다
                  </h3>
                  <p className="text-[14px] text-[#475569] mb-4">
                    문제 풀기 탭에서 기출문제를 풀면 틀리거나 보류한 문항이 자동으로 정리됩니다.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('quiz');
                      setQuizStage('cover');
                    }}
                    className="h-[46px] px-5 rounded-xl bg-[#1D4ED8] text-white text-[14px] font-semibold hover:bg-[#1E40AF] transition-colors"
                  >
                    과년도 문제 풀러 가기
                  </button>
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Mobile Sticky Bottom Navigation Bar (Fixed 64px + safe-area inset, 2 primary tabs) */}
      <nav
        aria-label="하단 탭 내비게이션"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E2E8F0] shadow-[0_-4px_16px_-2px_rgba(15,23,42,0.06)] pb-[env(safe-area-inset-bottom)]"
      >
        <div className="max-w-[440px] mx-auto grid grid-cols-2 h-16">
          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            aria-current={activeTab === 'quiz' ? 'page' : undefined}
            className={`relative flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'quiz' ? 'text-[#1D4ED8]' : 'text-[#64748B]'
            }`}
          >
            {activeTab === 'quiz' && (
              <span
                aria-hidden="true"
                className="w-[4px] h-[4px] rounded-full bg-[#1D4ED8] absolute top-1.5"
              />
            )}
            <FileText className="w-[22px] h-[22px]" />
            <span className="text-[11px] font-semibold tracking-tight">
              문제 풀기
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            aria-current={activeTab === 'notes' ? 'page' : undefined}
            className={`relative flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'notes' ? 'text-[#1D4ED8]' : 'text-[#64748B]'
            }`}
          >
            {activeTab === 'notes' && (
              <span
                aria-hidden="true"
                className="w-[4px] h-[4px] rounded-full bg-[#1D4ED8] absolute top-1.5"
              />
            )}
            <div className="relative">
              <NotebookPen className="w-[22px] h-[22px]" />
              {activeWrongCount > 0 && (
                <span className="absolute -top-1.5 -right-3 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E11D48] text-white font-mono-tech text-[10px] font-bold flex items-center justify-center leading-none">
                  {activeWrongCount}
                </span>
              )}
            </div>
            <span className="text-[11px] font-semibold tracking-tight">
              오답노트
            </span>
          </button>
        </div>
      </nav>

      {/* Quick Formula Sheet Modal */}
      <FormulaModal
        isOpen={formulaModalOpen}
        initialChapter={currentQuestion.chapter}
        onClose={() => setFormulaModalOpen(false)}
      />
    </div>
  );
}
