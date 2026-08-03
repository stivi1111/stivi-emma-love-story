// Cloud Sync for Stivi & Emma across PC, Android & iPhone

const CLOUD_ENDPOINT = 'https://api.jsonbin.io/v3/b/66ae2d42acd3cb34a86f789e';
// Secondary open mirror endpoint for 100% reliability
const BACKUP_ENDPOINT = 'https://kvdb.io/stivi_emma_love_db_2023/full_backup';

export const getLocalData = () => {
  return {
    notes: JSON.parse(localStorage.getItem('stivi_emma_real_notes') || '[]'),
    places: JSON.parse(localStorage.getItem('stivi_emma_real_places') || '[]'),
    timeline: JSON.parse(localStorage.getItem('stivi_emma_real_timeline') || '[]'),
    bucketlist: JSON.parse(localStorage.getItem('stivi_emma_real_bucketlist') || '[]'),
    photos: JSON.parse(localStorage.getItem('stivi_emma_real_photos') || '[]'),
    quote: localStorage.getItem('stivi_emma_custom_quote') || 'Scrivi qui la vostra frase speciale... ✨',
    hugCount: parseInt(localStorage.getItem('stivi_emma_hug_count') || '0', 10),
    startDate: localStorage.getItem('stivi_emma_start_date') || '2023-04-27'
  };
};

export const applyCloudData = (data) => {
  if (!data) return false;
  let updated = false;

  if (data.notes && Array.isArray(data.notes)) {
    localStorage.setItem('stivi_emma_real_notes', JSON.stringify(data.notes));
    updated = true;
  }
  if (data.places && Array.isArray(data.places)) {
    localStorage.setItem('stivi_emma_real_places', JSON.stringify(data.places));
    updated = true;
  }
  if (data.timeline && Array.isArray(data.timeline)) {
    localStorage.setItem('stivi_emma_real_timeline', JSON.stringify(data.timeline));
    updated = true;
  }
  if (data.bucketlist && Array.isArray(data.bucketlist)) {
    localStorage.setItem('stivi_emma_real_bucketlist', JSON.stringify(data.bucketlist));
    updated = true;
  }
  if (data.photos && Array.isArray(data.photos)) {
    localStorage.setItem('stivi_emma_real_photos', JSON.stringify(data.photos));
    updated = true;
  }
  if (data.quote) {
    localStorage.setItem('stivi_emma_custom_quote', data.quote);
    updated = true;
  }
  if (data.hugCount !== undefined) {
    localStorage.setItem('stivi_emma_hug_count', data.hugCount.toString());
    updated = true;
  }

  return updated;
};

// Push local additions to the Cloud
export const pushToCloud = async (data = getLocalData()) => {
  try {
    const res = await fetch(BACKUP_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.ok;
  } catch (e) {
    console.log('Cloud push status:', e);
    return false;
  }
};

// Pull latest changes from Cloud to PC / Mobile
export const pullFromCloud = async () => {
  try {
    const res = await fetch(BACKUP_ENDPOINT);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object') {
        const hasUpdates = applyCloudData(data);
        return { success: true, hasUpdates, data };
      }
    }
  } catch (e) {
    console.log('Cloud pull status:', e);
  }
  return { success: false, hasUpdates: false };
};
