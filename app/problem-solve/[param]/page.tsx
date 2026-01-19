'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { Question } from '@/interface/Question';
import MarkdownPreview from '@uiw/react-markdown-preview';
import Editor from '@monaco-editor/react';
import ElapsedTimer from '@/components/ElapsedTimer';
import { X, Code } from 'lucide-react';
import Split from 'react-split';
import LanguageDropdown from '@/components/LanguageDropdown';
import getLangKey from '@/util/LanguageMap';
import JudgeFormat from '@/util/JudgeFormat';
import submitCode from '@/util/Submit';
import { redisUpdateFunction } from '@/util/RedisUpdate';
import handleEditorWillMount from '@/util/EditorOnMount';

export default function ProblemSolve() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const params = useParams();
  const param = params.param as string;

  const [question, setQuestion] = useState<Question | null>(null);
  const [language, setLanguage] = useState('C++');
  const [code, setCode] = useState('// Write your code here');
  const [elapsed, setElapsedTime] = useState(0);
  const [showEditor, setShowEditor] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResultSummary, setTestResultSummary] = useState<{
    passedCount: number;
    failedCount: number;
    failedTest?: {
      test: number;
      expected: string;
      received: string | null;
    };
  } | null>(null);
  const [stats, setStats] = useState<{
  solvedCount: number;
  avgTime: number;
} | null>(null);

  const storageKey = `code-${param}-${language}`;


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/problems/stats?slug=${param}`);
        const data = await res.json();
        if (res.ok) setStats(data);
        else console.error(data.error);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };
    if (param) fetchStats();
  }, [param]);


 

  useEffect(() => {
    if (!isSignedIn) router.push('/');
  }, [isSignedIn]);

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const module = await import(`@/questions/${param}`);
        setQuestion(module.default);
      } catch (error) {
        console.error('Problem not found:', error);
      }
    };
    if (param) loadQuestion();
  }, [param]);

  useEffect(() => {
    const savedCode = localStorage.getItem(storageKey);
    setCode(savedCode || question?.code?.[getLangKey(language)]?.boilerplate || '// Write your code here');
  }, [storageKey, question, language]);

  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem(storageKey, code);
    }, 5000);
    return () => clearInterval(interval);
  }, [code, storageKey]);

  if (!isSignedIn) return null;

  const handleReset = () => {
    if (!question) return;
    const langKey = getLangKey(language);
    const boilerplate = question.code?.[langKey]?.boilerplate || '// Write your code here';
    setCode(boilerplate);
    localStorage.setItem(storageKey, boilerplate);
  };

  const handleSubmit = async () => {
    if (!question) return;
    setIsSubmitting(true);

    try {
      const langKey = getLangKey(language);
      const langMeta = question.code?.[langKey];
      if (!langMeta) return;

      const fullCode = `${code}\n\n${langMeta.wrapper}`;
      const finalCodeObject = JudgeFormat(question, fullCode, language);
      const testCaseResults = await submitCode(finalCodeObject, question);

      let passedCount = 0;
      let failedCount = 0;
      let failedTest;

      for (const result of testCaseResults) {
        if (result.passed) {
          passedCount++;
        } else {
          failedCount++;
          if (!failedTest) {
            failedTest = {
              test: result.test,
              expected: result.expected,
              received: result.received,
            };
          }
        }
      }
      if(failedCount === 0){
        // make redis call and increase the problem count and avg time
        await redisUpdateFunction(question.slug,elapsed);
      }
      setTestResultSummary({ passedCount, failedCount, failedTest });
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const SubmitButton = (
    <button
      onClick={handleSubmit}
      disabled={isSubmitting}
      className="bg-black hover:bg-gray-700 text-white px-3 py-1 rounded text-sm font-medium shadow transition cursor-pointer flex items-center gap-2"
    >
      {isSubmitting ? (
        <>
          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Submitting...
        </>
      ) : (
        'Submit'
      )}
    </button>
  );

  const editorTopBar = (
    <div className="flex justify-between items-center bg-gray-100 px-4 py-2 border-b font-semibold">
      <LanguageDropdown
        languages={['C++', 'Java', 'Python', 'Js']}
        selected={language}
        onSelect={(lang) => setLanguage(lang)}
      />
      <div className="flex items-center gap-2">
        <ElapsedTimer onTick={(val) => setElapsedTime(val)} />
        {SubmitButton}
      </div>
    </div>
  );

  const TestResultModal = () => {
    if (!testResultSummary) return null;
    return (
      <div className="fixed inset-0 z-50 bg-black/[0.5] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
          <button
            onClick={() => setTestResultSummary(null)}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
          >
            <X size={20} />
          </button>
          <h2 className="text-lg font-semibold mb-4">Test Results</h2>
          <p className="mb-2">
            ✅ Passed: <span className="text-green-600 font-medium">{testResultSummary.passedCount}</span> <br />
            ❌ Failed: <span className="text-red-600 font-medium">{testResultSummary.failedCount}</span>
          </p>
          {testResultSummary.failedTest && (
            <div className="bg-red-50 border border-red-300 text-red-800 p-3 rounded mt-2">
              <p className="font-semibold">❌ First Failed Test Case:</p>
              <p className="text-sm">Test #{testResultSummary.failedTest.test}</p>
              <p className="text-sm"><strong>Expected:</strong> {testResultSummary.failedTest.expected}</p>
              <p className="text-sm"><strong>Received:</strong> {testResultSummary.failedTest.received ?? 'null'}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen w-full bg-gray-100 relative">
      <TestResultModal />

      {!showEditor && (
        <>
          {/* Mobile View */}
          <div className="md:hidden flex flex-col h-full">
            <div className="flex-1 overflow-y-auto bg-white p-4">
              {question ? (
                <>
                  <div className="flex justify-between mb-2">
                    <h1 className="text-xl font-bold">{question.title}</h1>
                    <span className={`text-xs px-2 py-1 rounded font-semibold inline-block mt-1 ${
                      question.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {question.difficulty}
                    </span>
                  </div>
                  {/* ✅ Reset Button */}
                  <button
                    onClick={handleReset}
                    className="text-sm text-blue-600 hover:underline mb-4"
                  >
                    Reset Code
                  </button>
                    {stats && (
                      <div className="text-sm text-gray-500 mb-2">
                        Submissions: {stats.solvedCount} | ⏱ Avg Time: {Math.floor(stats.avgTime)}s
                      </div>
                    )}
                  <MarkdownPreview
                    source={question.description.replace(/^\s{4}/gm, '')}
                    className="prose p-2 bg-white"
                  />
                  <button
                    onClick={() => setShowEditor(true)}
                    className="mt-4 flex items-center gap-2 text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded shadow"
                  >
                    <Code size={16} /> Focus Mode
                  </button>
                </>
              ) : <p>Loading...</p>}
            </div>
            <div className="h-64 flex flex-col mt-4">
              {editorTopBar}
              <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value ?? '')}
                beforeMount={handleEditorWillMount}
              />
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden md:flex h-full">
            <Split
              className="flex w-full h-full"
              sizes={[50, 50]}
              minSize={200}
              expandToMin
              gutterSize={6}
              direction="horizontal"
              cursor="col-resize"
              gutter={() => {
                const gutter = document.createElement('div');
                gutter.className = 'bg-gray-300 hover:bg-gray-400 transition-all duration-150';
                gutter.style.width = '16px';
                gutter.style.cursor = 'col-resize';
                gutter.style.height = '100%';
                return gutter;
              }}
            >
              <div className="bg-white shadow p-4 overflow-y-auto">
                {question ? (
                  <>
                    <div className="flex justify-between mb-2">
                      <h1 className="text-2xl font-bold">{question.title}</h1>
                      <span className={`text-xs px-2 py-1 rounded font-semibold mt-1 inline-block ${
                        question.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                        question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {question.difficulty}
                      </span>
                    </div>
                    {/* ✅ Reset Button */}
                    {stats && (
                      <div className="text-sm text-gray-500 mb-2">
                        Submissions: {stats.solvedCount} | ⏱ Avg Time: {Math.floor(stats.avgTime)}s
                      </div>
                    )}
                    <button
                      onClick={handleReset}
                      className="text-sm text-blue-600 hover:underline mb-4"
                    >
                      Reset
                    </button>

                    <MarkdownPreview
                      source={question.description.replace(/^\s{4}/gm, '')}
                      className="prose p-4 bg-white rounded shadow"
                    />
                    <button
                      onClick={() => setShowEditor(true)}
                      className="mt-4 flex items-center gap-2 text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded shadow"
                    >
                      <Code size={16} /> Focus Mode
                    </button>
                  </>
                ) : <p>Loading question...</p>}
              </div>

              <div className="flex flex-col bg-white shadow rounded overflow-hidden">
                {editorTopBar}
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  theme="vs-dark"
                  value={code}
                  onChange={(value) => setCode(value ?? '')}
                  beforeMount={handleEditorWillMount}
                />
              </div>
            </Split>
          </div>
        </>
      )}

      {/* Focus Mode */}
      {showEditor && (
        <div className="absolute inset-0 z-40 bg-white flex flex-col shadow-lg">
          <div className="flex justify-between items-center bg-gray-100 px-4 py-2 border-b">
            <LanguageDropdown
              languages={['C++', 'Java', 'Python', 'Js']}
              selected={language}
              onSelect={(lang) => setLanguage(lang)}
            />
            <ElapsedTimer onTick={(val) => setElapsedTime(val)} />
            <button
              onClick={() => setShowEditor(false)}
              className="text-gray-600 hover:text-red-500"
            >
              <X size={20} />
            </button>
          </div>
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value ?? '')}
          />
        </div>
      )}
    </div>
  );
}
