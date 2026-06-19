const VOTE_STORAGE_KEY = '3d-projection-lab:vote';

function isStorageAvailable() {
  try {
    return 'localStorage' in window;
  } catch {
    return false;
  }
}

export function getVote() {
  const STORAGE_UNAVAILABLE = 'STORAGE_UNAVAILABLE';

  if (!isStorageAvailable()) {
    return STORAGE_UNAVAILABLE;
  }

  return localStorage.getItem(VOTE_STORAGE_KEY);
}

export function saveVote(vote: string) {
  if (!isStorageAvailable() || !!getVote()) {
    return;
  }

  localStorage.setItem(VOTE_STORAGE_KEY, vote);
}
