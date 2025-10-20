import EngineWorker from './engineWorker.ts?worker';

export type Difficulty = 'Beginner' | 'Casual' | 'Challenging' | 'Hard' | 'Insane';

export const PRESETS: Record<Difficulty, { skill: number; depth: number; movetime: number }> = {
  Beginner: { skill: 1, depth: 2, movetime: 150 },
  Casual: { skill: 5, depth: 6, movetime: 300 },
  Challenging: { skill: 10, depth: 10, movetime: 500 },
  Hard: { skill: 15, depth: 14, movetime: 800 },
  Insane: { skill: 20, depth: 18, movetime: 1200 },
};

export class Engine {
  private worker: Worker;
  private ready: Promise<void>;

  constructor(preset: Difficulty) {
    const { skill, depth, movetime } = PRESETS[preset];
    this.worker = new EngineWorker();
    this.ready = new Promise((resolve) => {
      this.worker.onmessage = () => resolve();
      this.worker.postMessage({ type: 'init', skill, depth, movetime });
    });
  }

  async bestMove(fen: string): Promise<{ from: string; to: string; san: string }> {
    await this.ready;
    return new Promise((resolve) => {
      this.worker.onmessage = (e: MessageEvent<any>) => {
        const d = e.data;
        if (d.type === 'bestmove') {
          resolve({ from: d.from, to: d.to, san: d.san });
        }
      };
      this.worker.postMessage({ type: 'bestmove', fen });
    });
  }
}
