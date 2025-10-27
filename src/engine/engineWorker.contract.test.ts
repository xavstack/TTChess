import { beforeEach, describe, expect, it, vi } from 'vitest'

type WorkerScope = {
  postMessage: ReturnType<typeof vi.fn>
  onmessage: ((event: { data: any }) => void) | null
  setTimeout: typeof setTimeout
  clearTimeout: typeof clearTimeout
  console: Console
  self: WorkerScope
}

function createWorkerScope(): WorkerScope {
  const postMessage = vi.fn()
  const scope: any = {
    postMessage,
    onmessage: null,
    setTimeout,
    clearTimeout,
    console: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), log: vi.fn(), debug: vi.fn() },
  }
  scope.self = scope
  vi.stubGlobal('self', scope)
  vi.stubGlobal('console', scope.console)
  return scope as WorkerScope
}

describe('engineWorker contract behaviors', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllGlobals()
  })

  it('emits a single ready event on load and stays silent on newgame', async () => {
    const scope = createWorkerScope()
    await import('./engineWorker')
    expect(scope.postMessage).toHaveBeenCalledTimes(1)
    expect(scope.postMessage).toHaveBeenCalledWith({ type: 'ready' })

    scope.postMessage.mockClear()
    scope.onmessage?.({ data: { type: 'newgame' } })
    expect(scope.postMessage).not.toHaveBeenCalled()
  })

  it('returns NO_MOVE error when no legal moves exist', async () => {
    vi.useFakeTimers()
    const scope = createWorkerScope()
    await import('./engineWorker')
    scope.postMessage.mockClear()

    scope.onmessage?.({ data: { type: 'bestmove', fen: '7k/5Q2/7K/8/8/8/8/8 b - - 0 1' } })
    await vi.runAllTimersAsync()

    expect(scope.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'error', code: 'NO_MOVE' })
    )
    vi.useRealTimers()
  })
})
