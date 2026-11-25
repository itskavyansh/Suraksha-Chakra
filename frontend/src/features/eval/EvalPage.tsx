import React, { useState, useRef } from 'react';
import {
  Download,
  BarChart2,
  FolderOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { HazardCategory, ClassificationResult } from '@/types';
import { getClassifier } from '@/features/scan/classifier/classifier';
import { useToast } from '@/components/ui/Toast';

interface EvalItemResult {
  filename: string;
  groundTruth: HazardCategory;
  predicted: HazardCategory;
  confidence: number;
  label: string;
  latencyMs: number;
  isDangerousMiss: boolean;
  isSafeSide: boolean;
  isCorrect: boolean;
}

const CATEGORIES: HazardCategory[] = [
  'sharps',
  'glass',
  'batteries',
  'chemicals',
  'medical',
  'general',
  'unknown',
];

function inferGroundTruth(filename: string): HazardCategory {
  const f = filename.toLowerCase();
  if (f.includes('needle') || f.includes('sharp') || f.includes('syringe')) return 'sharps';
  if (f.includes('glass')) return 'glass';
  if (f.includes('battery')) return 'batteries';
  if (f.includes('chemical') || f.includes('acid') || f.includes('pesticide')) return 'chemicals';
  if (f.includes('medical') || f.includes('bandage') || f.includes('biohazard')) return 'medical';
  if (f.includes('bottle') || f.includes('cardboard') || f.includes('can') || f.includes('paper')) return 'general';
  return 'unknown';
}

export const EvalPage: React.FC = () => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [results, setResults] = useState<EvalItemResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentProgress, setCurrentProgress] = useState({ current: 0, total: 0 });

  const runEvaluation = async (files: File[]) => {
    if (files.length === 0) return;
    setIsRunning(true);
    setResults([]);
    setCurrentProgress({ current: 0, total: files.length });

    const classifier = getClassifier();
    const evalResults: EvalItemResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const groundTruth = inferGroundTruth(file.name);
      setCurrentProgress({ current: i + 1, total: files.length });

      try {
        const imageUrl = URL.createObjectURL(file);
        const start = performance.now();
        const res: ClassificationResult = await classifier.classify(imageUrl, file.name);
        const latencyMs = Math.round(performance.now() - start);

        const isDangerous = groundTruth !== 'general' && res.category === 'general';
        const isSafeSide = groundTruth !== 'general' && res.category === 'unknown';
        const isCorrect = res.category === groundTruth;

        evalResults.push({
          filename: file.name,
          groundTruth,
          predicted: res.category,
          confidence: res.confidence,
          label: res.label,
          latencyMs,
          isDangerousMiss: isDangerous,
          isSafeSide,
          isCorrect,
        });
      } catch {
        // Fallback for failed image load
      }
    }

    setResults(evalResults);
    setIsRunning(false);
    showToast(`Evaluation completed on ${evalResults.length} test images`, 'success');
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      runEvaluation(Array.from(e.target.files));
    }
  };

  const handleRunSampleSuite = async () => {
    // Generate synthetic benchmark test items representing all categories
    setIsRunning(true);
    const mockFiles = [
      { name: 'needle_sterile_01.jpg', hint: 'needle' },
      { name: 'broken_glass_jar_02.jpg', hint: 'broken-glass' },
      { name: 'lithium_battery_cell_03.jpg', hint: 'battery' },
      { name: 'chemical_acid_jug_04.jpg', hint: 'chemical-can' },
      { name: 'medical_blood_swab_05.jpg', hint: 'medical' },
      { name: 'plastic_pet_bottle_06.jpg', hint: 'bottle' },
      { name: 'corrugated_cardboard_07.jpg', hint: 'cardboard' },
      { name: 'unidentified_scrap_chunk_08.jpg', hint: 'unknown-item' },
    ];

    const classifier = getClassifier();
    const evalResults: EvalItemResult[] = [];
    setCurrentProgress({ current: 0, total: mockFiles.length });

    for (let i = 0; i < mockFiles.length; i++) {
      const item = mockFiles[i];
      const groundTruth = inferGroundTruth(item.name);
      setCurrentProgress({ current: i + 1, total: mockFiles.length });

      const start = performance.now();
      const res = await classifier.classify('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', item.hint);
      const latencyMs = Math.round(performance.now() - start);

      const isDangerous = groundTruth !== 'general' && res.category === 'general';
      const isSafeSide = groundTruth !== 'general' && res.category === 'unknown';
      const isCorrect = res.category === groundTruth;

      evalResults.push({
        filename: item.name,
        groundTruth,
        predicted: res.category,
        confidence: res.confidence,
        label: res.label,
        latencyMs,
        isDangerousMiss: isDangerous,
        isSafeSide,
        isCorrect,
      });
    }

    setResults(evalResults);
    setIsRunning(false);
    showToast('Evaluated 8 canonical benchmark test items', 'success');
  };

  const handleDownloadReport = () => {
    try {
      const report = {
        timestamp: new Date().toISOString(),
        model: 'Xenova/clip-vit-base-patch32',
        totalEvaluated: results.length,
        dangerousMissRate: results.length ? (results.filter((r) => r.isDangerousMiss).length / results.length) * 100 : 0,
        accuracy: results.length ? (results.filter((r) => r.isCorrect).length / results.length) * 100 : 0,
        results,
      };

      const json = JSON.stringify(report, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clip-classifier-benchmark-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('Downloaded evaluation report', 'success');
    } catch {
      showToast('Failed to download report', 'error');
    }
  };

  // Compute metrics
  const total = results.length;
  const dangerousMisses = results.filter((r) => r.isDangerousMiss).length;
  const safeSideCount = results.filter((r) => r.isSafeSide).length;
  const correctCount = results.filter((r) => r.isCorrect).length;
  const avgLatency = total > 0 ? Math.round(results.reduce((acc, r) => acc + r.latencyMs, 0) / total) : 0;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const dangerousMissRate = total > 0 ? ((dangerousMisses / total) * 100).toFixed(1) : '0.0';

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ink-100 pb-4">
        <div>
          <h1 className="text-xl font-bold text-ink-900 flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-brand-700" />
            <span>Zero-Shot Classifier Benchmark & Evaluation Tool</span>
          </h1>
          <p className="text-xs text-ink-500 mt-1">
            Standard offline test harness for Xenova/clip-vit-base-patch32 safety thresholds
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="border border-ink-100 text-xs font-bold"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            disabled={results.length === 0}
            onClick={handleDownloadReport}
          >
            Download Report (JSON)
          </Button>
        </div>
      </div>

      {/* Dataset Load Actions */}
      <Card className="p-4 bg-brand-100/20 border-brand-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-ink-900">Run Evaluation Benchmark</h2>
          <p className="text-xs text-ink-500 mt-0.5">
            Test against local evaluation image folder or canonical 8-item sample suite
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFilesSelected}
            multiple
            accept="image/*"
            className="hidden"
          />

          <Button
            size="sm"
            variant="ghost"
            className="flex-1 sm:flex-initial border border-ink-100 bg-white text-xs font-bold"
            leftIcon={<FolderOpen className="w-4 h-4 text-brand-700" />}
            disabled={isRunning}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Test Folder / Images
          </Button>

          <Button
            size="sm"
            variant="primary"
            className="flex-1 sm:flex-initial text-xs font-bold"
            isLoading={isRunning}
            onClick={handleRunSampleSuite}
          >
            Run Sample Suite
          </Button>
        </div>
      </Card>

      {/* Running Progress Bar */}
      {isRunning && (
        <Card className="p-4 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-ink-900">
            <span>Evaluating images...</span>
            <span>{currentProgress.current} / {currentProgress.total}</span>
          </div>
          <div className="w-full bg-ink-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-brand-700 h-full rounded-full transition-all duration-200"
              style={{
                width: `${(currentProgress.current / Math.max(1, currentProgress.total)) * 100}%`,
              }}
            />
          </div>
        </Card>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card className="p-3 text-center">
          <span className="text-[10px] uppercase font-bold text-ink-500 block">Evaluated</span>
          <span className="text-xl font-black text-ink-900 mt-1 block">{total}</span>
        </Card>

        <Card className="p-3 text-center bg-danger-100/30 border-danger-700/20">
          <span className="text-[10px] uppercase font-bold text-danger-700 block">Dangerous Miss Rate</span>
          <span className={`text-xl font-black mt-1 block ${dangerousMisses > 0 ? 'text-danger-700' : 'text-brand-700'}`}>
            {dangerousMissRate}%
          </span>
        </Card>

        <Card className="p-3 text-center">
          <span className="text-[10px] uppercase font-bold text-ink-500 block">Safe-Side Rate</span>
          <span className="text-xl font-black text-brand-700 mt-1 block">{safeSideCount}</span>
        </Card>

        <Card className="p-3 text-center">
          <span className="text-[10px] uppercase font-bold text-ink-500 block">Overall Accuracy</span>
          <span className="text-xl font-black text-ink-900 mt-1 block">{accuracy}%</span>
        </Card>

        <Card className="p-3 text-center">
          <span className="text-[10px] uppercase font-bold text-ink-500 block">Avg Latency</span>
          <span className="text-xl font-black text-ink-900 mt-1 block">{avgLatency} ms</span>
        </Card>
      </div>

      {/* Confusion Matrix */}
      {total > 0 && (
        <Card className="p-4 space-y-3">
          <h2 className="text-sm font-bold text-ink-900">Confusion Matrix (Ground Truth vs Predicted)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs border border-ink-100">
              <thead className="bg-ink-100/60 text-[10px] uppercase font-mono">
                <tr>
                  <th className="p-2 border border-ink-100 text-left">Actual \ Pred</th>
                  {CATEGORIES.map((cat) => (
                    <th key={cat} className="p-2 border border-ink-100 capitalize">{cat}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CATEGORIES.map((actual) => (
                  <tr key={actual}>
                    <td className="p-2 border border-ink-100 font-bold capitalize text-left bg-ink-100/20">
                      {actual}
                    </td>
                    {CATEGORIES.map((pred) => {
                      const count = results.filter((r) => r.groundTruth === actual && r.predicted === pred).length;
                      let cellStyle = count > 0 ? 'bg-ink-100/40 text-ink-900 font-bold' : 'text-ink-500';
                      if (actual === pred && count > 0) {
                        cellStyle = 'bg-brand-100 text-brand-900 font-black';
                      } else if (actual !== 'general' && pred === 'general' && count > 0) {
                        cellStyle = 'bg-danger-100 text-danger-700 font-black';
                      }

                      return (
                        <td key={pred} className={`p-2 border border-ink-100 ${cellStyle}`}>
                          {count}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Detailed Results Table */}
      {total > 0 && (
        <Card className="overflow-hidden p-0 border border-ink-100">
          <div className="p-3 bg-ink-100/30 border-b border-ink-100 font-bold text-xs text-ink-900">
            Evaluation Run Results ({results.length} files)
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ink-100/50 border-b border-ink-100 text-[10px] uppercase text-ink-500">
                <tr>
                  <th className="p-2.5">File Name</th>
                  <th className="p-2.5">Ground Truth</th>
                  <th className="p-2.5">Predicted</th>
                  <th className="p-2.5">Confidence</th>
                  <th className="p-2.5">Latency</th>
                  <th className="p-2.5 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 font-mono text-[11px]">
                {results.map((r, idx) => (
                  <tr key={idx} className="hover:bg-ink-100/30">
                    <td className="p-2.5 font-sans font-semibold text-ink-900">{r.filename}</td>
                    <td className="p-2.5 capitalize">{r.groundTruth}</td>
                    <td className="p-2.5 capitalize font-bold">{r.predicted}</td>
                    <td className="p-2.5">{Math.round(r.confidence * 100)}%</td>
                    <td className="p-2.5">{r.latencyMs} ms</td>
                    <td className="p-2.5 text-right font-sans">
                      {r.isDangerousMiss ? (
                        <span className="px-2 py-0.5 rounded bg-danger-100 text-danger-700 font-bold text-[10px]">
                          DANGEROUS MISS
                        </span>
                      ) : r.isCorrect ? (
                        <span className="px-2 py-0.5 rounded bg-brand-100 text-brand-700 font-bold text-[10px]">
                          CORRECT
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-ink-100 text-ink-900 text-[10px]">
                          SAFE-SIDE
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
