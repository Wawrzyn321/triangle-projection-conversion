const VOTE_STORAGE_KEY = '3d-projection-lab:vote';

function isStorageAvailable() {
  try {
    return 'localStorage' in window;
  } catch {
    return false;
  }
}

export function getVote() {
  if (!isStorageAvailable()) {
    return null;
  }

  return localStorage.getItem(VOTE_STORAGE_KEY);
}

export function saveVote(vote: string) {
  if (getVote()) {
    return false;
  }

  localStorage.setItem(VOTE_STORAGE_KEY, vote);
  return true;
}
