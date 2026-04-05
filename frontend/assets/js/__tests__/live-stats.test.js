import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { initLiveStats } from '../live-stats.js'

function setupDOM() {
  document.body.innerHTML = `
    <div id="stat-citations">1,213+</div>
    <div id="stat-publications">64+</div>
  `
}

describe('initLiveStats', () => {
  beforeEach(() => {
    setupDOM()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('updates citations and publications with live API data', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ cited_by_count: 1500, works_count: 80 }),
    }))

    await initLiveStats()

    expect(document.getElementById('stat-citations').textContent).toBe('1,500+')
    expect(document.getElementById('stat-publications').textContent).toBe('80+')
  })

  it('shows fallback values when fetch throws a network error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

    await initLiveStats()

    expect(document.getElementById('stat-citations').textContent).toBe('1,213+')
    expect(document.getElementById('stat-publications').textContent).toBe('64+')
  })

  it('shows fallback values when API returns a non-ok HTTP response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({}),
    }))

    await initLiveStats()

    expect(document.getElementById('stat-citations').textContent).toBe('1,213+')
    expect(document.getElementById('stat-publications').textContent).toBe('64+')
  })

  it('does not call fetch when stat elements are absent from the DOM', async () => {
    document.body.innerHTML = ''
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await initLiveStats()

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('calls the correct OpenAlex API URL with GET method', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ cited_by_count: 100, works_count: 10 }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await initLiveStats()

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.openalex.org/authors/A5019932260?select=cited_by_count,works_count',
      expect.objectContaining({ method: 'GET' })
    )
  })

  it('aborts the fetch request after the 5-second timeout', () => {
    vi.useFakeTimers()
    const abortMock = vi.fn()
    vi.stubGlobal('AbortController', function AbortControllerMock() {
      this.abort = abortMock
      this.signal = {}
    })
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})))

    initLiveStats()
    vi.advanceTimersByTime(5000)

    expect(abortMock).toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('keeps fallback for citations when cited_by_count is not a valid number', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ cited_by_count: 'N/A', works_count: 80 }),
    }))

    await initLiveStats()

    expect(document.getElementById('stat-citations').textContent).toBe('1,213+')
    expect(document.getElementById('stat-publications').textContent).toBe('80+')
  })
})
