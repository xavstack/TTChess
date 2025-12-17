import { beforeEach, describe, expect, it, vi } from 'vitest'

type WorkerScope = {
  postMessage: ReturnType<typeof vi.fn>
  onmessage: ((event: { data: unknown }) => void) | null
  setTimeout: typeof setTimeout
  clearTimeout: typeof clearTimeout
  console: Console
  self: WorkerScope
}

function createWorkerScope(): WorkerScope {
  const postMessage = vi.fn()
  const consoleMock: Console = {
    assert: vi.fn(),
    clear: vi.fn(),
    count: vi.fn(),
    countReset: vi.fn(),
    debug: vi.fn(),
    dir: vi.fn(),
    dirxml: vi.fn(),
    error: vi.fn(),
    group: vi.fn(),
    groupCollapsed: vi.fn(),
    groupEnd: vi.fn(),
    info: vi.fn(),
    log: vi.fn(),
    table: vi.fn(),
    time: vi.fn(),
    timeEnd: vi.fn(),
    timeLog: vi.fn(),
    trace: vi.fn(),
    warn: vi.fn(),
    timeStamp: vi.fn(),
    Console: vi.fn() as unknown as Console['Console'],
    profile: vi.fn(),
    profileEnd: vi.fn(),
  }
  const scope: Partial<WorkerScope> = {
    postMessage,
    onmessage: null,
    setTimeout,
    clearTimeout,
    console: consoleMock,
  }
  scope.self = scope as WorkerScope
  vi.stubGlobal('self', scope)
  vi.stubGlobal('console', consoleMock)
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
