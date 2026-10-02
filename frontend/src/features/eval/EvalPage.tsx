// Developer-only evaluation page: English strings are intentionally not internationalized.
import React, { useState, useRef } from 'react';
import { Download, Play, FolderOpen, AlertTriangle } from 'lucide-react';
import { getClassifier } from '../scan/classifier';
import { MODEL_ID } from '../scan/classifier/modelConfig';
import { loadImageFromFile, processSource } from '../scan/imageUtils';
import type { HazardCategory } from '../../types';
import {
  EVAL_CLASSES,
  PRED_COLUMNS,
  computeEvalReport,
  type EvalReport,
  type ImageEvalResult,
} from './evalMetrics';

interface ParsedFile {
  file: File;
  trueClass: HazardCategory;
}

const EvalPage: React.FC = () => {
  const [parsedFiles, setParsedFiles] = useState<ParsedFile[]>([]);
  const [ignoredCount, setIgnoredCount] = useState<number>(0);
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentFile, setCurrentFile] = useState<string>('');
  const [report, setReport] = useState<EvalReport | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const valid: ParsedFile[] = [];
    let ignored = 0;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const relPath = file.webkitRelativePath || file.name;
      const parts = relPath.split('/');
      const parentDir = (parts.length >= 2 ? parts[parts.length - 2] : '').toLowerCase();

      const isValidClass = (EVAL_CLASSES as readonly string[]).includes(parentDir);
      const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp)$/i.test(file.name);

      if (isValidClass && isImage) {
        valid.push({ file, trueClass: parentDir as HazardCategory });
      } else {
        ignored++;
      }
    }

    setParsedFiles(valid);
    setIgnoredCount(ignored);
    setReport(null);
    setProgress(0);
  };

  const runEvaluation = async () => {
    if (parsedFiles.length === 0 || evaluating) return;
    setEvaluating(true);
    setProgress(0);

    const classifier = getClassifier();
    const results: ImageEvalResult[] = [];

    for (let i = 0; i < parsedFiles.length; i++) {
      const item = parsedFiles[i];
      setCurrentFile(item.file.name);

      try {
        const img = await loadImageFromFile(item.file);
        const { canvas } = processSource(img);

        const t0 = performance.now();
        const res = await classifier.classify(canvas);
        const inferenceMs = performance.now() - t0;

        results.push({
          filename: item.file.name,
          trueClass: item.trueClass,
          predClass: res.category,
          confidence: res.confidence,
          inferenceMs,
        });
      } catch (err) {
        console.error('Failed evaluating image', item.file.name, err);
      }

      setProgress(Math.round(((i + 1) / parsedFiles.length) * 100));
    }

    const calculated = computeEvalReport(results, MODEL_ID);
    setReport(calculated);
    setEvaluating(false);
    setCurrentFile('');
  };

  const downloadJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eval-results-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 max-w-6xl mx-auto">
      {/* Warning banner */}
      <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-center gap-3 text-amber-900">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600" />
        <p className="text-sm font-semibold">
          Metrics are only meaningful on images the model was never tuned on.
        </p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Classifier Evaluation Tool</h1>
          <p className="text-sm text-slate-500">Model: {MODEL_ID} (Zero-shot CLIP q8 WASM)</p>
        </div>
        {report && (
          <button
            onClick={downloadJson}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition"
          >
            <Download className="w-4 h-4" /> Download results (JSON)
          </button>
        )}
      </div>

      {/* Dataset Picker */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            // @ts-expect-error webkitdirectory attribute is standard in modern browsers
            webkitdirectory=""
            className="hidden"
            onChange={handleFilesSelected}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={evaluating}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 font-medium rounded-lg hover:bg-slate-100 transition disabled:opacity-50"
          >
            <FolderOpen className="w-4 h-4" /> Select Labeled Folder
          </button>

          <span className="text-sm font-medium text-slate-600">
            {parsedFiles.length} images recognized in valid folders
          </span>
          {ignoredCount > 0 && (
            <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">
              {ignoredCount} non-image or unknown folder files ignored
            </span>
          )}

          {parsedFiles.length > 0 && (
            <button
              onClick={runEvaluation}
              disabled={evaluating}
              className="ml-auto flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
            >
              <Play className="w-4 h-4" /> {evaluating ? 'Running...' : 'Run Evaluation'}
            </button>
          )}
        </div>

        {evaluating && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Evaluating: {currentFile}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {report && (
        <div className="flex flex-col gap-6">
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <p className="text-xs font-medium text-slate-500">Accuracy</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {(report.overallAccuracy * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <p className="text-xs font-medium text-slate-500">Dangerous Miss Rate</p>
              <p className="text-2xl font-bold text-rose-600 mt-1">
                {(report.dangerousMissRate * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <p className="text-xs font-medium text-slate-500">Safe-Side Rate</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                {(report.safeSideRate * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <p className="text-xs font-medium text-slate-500">False Alarm Rate</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">
                {(report.falseAlarmRate * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <p className="text-xs font-medium text-slate-500">Median Time</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {report.medianInferenceMs} ms
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <p className="text-xs font-medium text-slate-500">P95 Time</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {report.p95InferenceMs} ms
              </p>
            </div>
          </div>

          {/* Per-Class Stats */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
            <h2 className="text-base font-bold mb-3">Per-Class Precision & Recall</h2>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-2">Class</th>
                  <th className="pb-2">Count</th>
                  <th className="pb-2">Precision</th>
                  <th className="pb-2">Recall</th>
                </tr>
              </thead>
              <tbody>
                {report.perClassStats.map((st) => (
                  <tr key={st.class} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-2.5 font-medium capitalize">{st.class}</td>
                    <td className="py-2.5 text-slate-600">{st.count}</td>
                    <td className="py-2.5 text-slate-600">{(st.precision * 100).toFixed(1)}%</td>
                    <td className="py-2.5 text-slate-600">{(st.recall * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Confusion Matrix */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
            <h2 className="text-base font-bold mb-3">Confusion Matrix (Rows: True, Cols: Predicted)</h2>
            <table className="w-full text-center text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="p-2 border border-slate-200 text-left font-semibold">True \ Pred</th>
                  {PRED_COLUMNS.map((col) => (
                    <th key={col} className="p-2 border border-slate-200 capitalize font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {EVAL_CLASSES.map((row) => (
                  <tr key={row}>
                    <td className="p-2 border border-slate-200 text-left font-medium capitalize bg-slate-50">
                      {row}
                    </td>
                    {PRED_COLUMNS.map((col) => {
                      const count = report.confusionMatrix[row]?.[col] || 0;
                      const isDiagonal = row === col;
                      return (
                        <td
                          key={col}
                          className={`p-2 border border-slate-200 font-medium ${
                            isDiagonal && count > 0
                              ? 'bg-emerald-100 text-emerald-900 font-bold'
                              : col === 'general' && row !== 'general' && count > 0
                                ? 'bg-rose-100 text-rose-800'
                                : count > 0
                                  ? 'bg-slate-100 text-slate-800'
                                  : 'text-slate-400'
                          }`}
                        >
                          {count}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvalPage;
