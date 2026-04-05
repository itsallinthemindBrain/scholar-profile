// ===== REAL-TIME CITATION & PUBLICATION COUNT (OpenAlex) =====

var AUTHOR_ID = 'A5019932260'
var FALLBACK_CITATIONS = '1,213+'
var FALLBACK_WORKS = '64+'
var TIMEOUT_MS = 5000
var API_URL = 'https://api.openalex.org/authors/' + AUTHOR_ID + '?select=cited_by_count,works_count'

export function initLiveStats() {
  var elCitations = document.getElementById('stat-citations')
  var elPublications = document.getElementById('stat-publications')
  if (!elCitations && !elPublications) { return Promise.resolve() }

  var controller = new AbortController()
  var timer = setTimeout(function () { controller.abort() }, TIMEOUT_MS)

  return fetch(API_URL, {
    method: 'GET',
    signal: controller.signal,
    headers: { 'Accept': 'application/json' }
  })
    .then(function (res) {
      clearTimeout(timer)
      if (!res.ok) { throw new Error('Network response was not ok') }
      return res.json()
    })
    .then(function (data) {
      if (!data || typeof data !== 'object') { throw new Error('Invalid response') }

      var citations = data.cited_by_count
      if (
        elCitations &&
        typeof citations === 'number' &&
        Number.isFinite(citations) &&
        citations >= 0
      ) {
        elCitations.textContent = citations.toLocaleString() + '+'
      }

      var works = data.works_count
      if (
        elPublications &&
        typeof works === 'number' &&
        Number.isFinite(works) &&
        works >= 0
      ) {
        elPublications.textContent = works.toLocaleString() + '+'
      }
    })
    .catch(function () {
      clearTimeout(timer)
      if (elCitations) { elCitations.textContent = FALLBACK_CITATIONS }
      if (elPublications) { elPublications.textContent = FALLBACK_WORKS }
    })
}
