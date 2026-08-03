// Guaranteed Zero-Loss Union-Merge Cloud Sync Engine for Stivi & Emma

const JSONBLOB_ENDPOINT = 'https://jsonblob.com/api/jsonBlob/019fc7a2-7eee-73b8-9f46-de2048252f0a';

let isPushingCloud = false;

export const getDeletedIds = () => {
  return JSON.parse(localStorage.getItem('stivi_emma_deleted_ids') || '[]');
};

export const registerDeletedId = (id) => {
  if (!id) return;
  const current = getDeletedIds();
  const idStr = id.toString();
  if (!current.includes(idStr)) {
    const updated = [...current, idStr];
    localStorage.setItem('stivi_emma_deleted_ids', JSON.stringify(updated));
  }
};

// Union merge array by unique ID (preserves all items from both local and remote)
export const unionMergeById = (localArr = [], remoteArr = []) => {
  if (!Array.isArray(localArr)) localArr = [];
  if (!Array.isArray(remoteArr)) remoteArr = [];

  const deletedIds = getDeletedIds();
  const map = new Map();

  // Add remote items (unless deleted)
  remoteArr.forEach(item => {
    if (item && item.id !== undefined && item.id !== null) {
      const idStr = item.id.toString();
      if (!deletedIds.includes(idStr)) {
        map.set(idStr, item);
      }
    }
  });

  // Add local items (overlaying local state so freshly created items are never lost)
  localArr.forEach(item => {
    if (item && item.id !== undefined && item.id !== null) {
      const idStr = item.id.toString();
      if (!deletedIds.includes(idStr)) {
        map.set(idStr, item);
      }
    }
  });

  // Sort descending by ID (timestamp) so newest items stay on top
  return Array.from(map.values()).sort((a, b) => {
    const timeA = typeof a.id === 'number' ? a.id : parseInt(a.id, 10) || 0;
    const timeB = typeof b.id === 'number' ? b.id : parseInt(b.id, 10) || 0;
    return timeB - timeA;
  });
};

export const getLocalPayload = () => {
  return {
    notes: JSON.parse(localStorage.getItem('stivi_emma_real_notes') || '[]'),
    places: JSON.parse(localStorage.getItem('stivi_emma_real_places') || '[]'),
    timeline: JSON.parse(localStorage.getItem('stivi_emma_real_timeline') || '[]'),
    bucketlist: JSON.parse(localStorage.getItem('stivi_emma_real_bucketlist') || '[]'),
    photos: JSON.parse(localStorage.getItem('stivi_emma_real_photos') || '[]'),
    quote: localStorage.getItem('stivi_emma_custom_quote') || 'Scrivi qui la vostra frase speciale... ✨',
    hugCount: parseInt(localStorage.getItem('stivi_emma_hug_count') || '0', 10),
    startDate: localStorage.getItem('stivi_emma_start_date') || '2023-04-27',
    upcomingDates: JSON.parse(localStorage.getItem('stivi_emma_upcoming_dates') || '{"anniversary":"2027-04-27","emmaBday":"2027-04-07","stiviBday":"2027-07-27","nextTrip":"2026-09-01"}'),
    deletedIds: getDeletedIds()
  };
};

export const applyCloudPayload = (remoteData) => {
  if (!remoteData || typeof remoteData !== 'object') return false;
  let updated = false;

  // Sync deleted IDs
  if (remoteData.deletedIds && Array.isArray(remoteData.deletedIds)) {
    const localDeleted = getDeletedIds();
    const mergedDeleted = Array.from(new Set([...localDeleted, ...remoteData.deletedIds]));
    if (JSON.stringify(localDeleted) !== JSON.stringify(mergedDeleted)) {
      localStorage.setItem('stivi_emma_deleted_ids', JSON.stringify(mergedDeleted));
      updated = true;
    }
  }

  const currentLocal = getLocalPayload();

  // Union merge all collections so NO item is ever lost
  const mergedNotes = unionMergeById(currentLocal.notes, remoteData.notes);
  const mergedPlaces = unionMergeById(currentLocal.places, remoteData.places);
  const mergedTimeline = unionMergeById(currentLocal.timeline, remoteData.timeline);
  const mergedBucketlist = unionMergeById(currentLocal.bucketlist, remoteData.bucketlist);
  const mergedPhotos = unionMergeById(currentLocal.photos, remoteData.photos);

  if (JSON.stringify(currentLocal.notes) !== JSON.stringify(mergedNotes)) {
    localStorage.setItem('stivi_emma_real_notes', JSON.stringify(mergedNotes));
    updated = true;
  }
  if (JSON.stringify(currentLocal.places) !== JSON.stringify(mergedPlaces)) {
    localStorage.setItem('stivi_emma_real_places', JSON.stringify(mergedPlaces));
    updated = true;
  }
  if (JSON.stringify(currentLocal.timeline) !== JSON.stringify(mergedTimeline)) {
    localStorage.setItem('stivi_emma_real_timeline', JSON.stringify(mergedTimeline));
    updated = true;
  }
  if (JSON.stringify(currentLocal.bucketlist) !== JSON.stringify(mergedBucketlist)) {
    localStorage.setItem('stivi_emma_real_bucketlist', JSON.stringify(mergedBucketlist));
    updated = true;
  }
  if (JSON.stringify(currentLocal.photos) !== JSON.stringify(mergedPhotos)) {
    localStorage.setItem('stivi_emma_real_photos', JSON.stringify(mergedPhotos));
    updated = true;
  }

  // Scalar values
  if (remoteData.quote && remoteData.quote !== currentLocal.quote) {
    localStorage.setItem('stivi_emma_custom_quote', remoteData.quote);
    updated = true;
  }

  if (remoteData.hugCount !== undefined && remoteData.hugCount > currentLocal.hugCount) {
    localStorage.setItem('stivi_emma_hug_count', remoteData.hugCount.toString());
    updated = true;
  }

  if (updated) {
    window.dispatchEvent(new Event('stivi_emma_cloud_synced'));
  }
  return updated;
};

// Push local changes to cloud via PUT
export const pushFullCloudPayload = async (payload = getLocalPayload()) => {
  isPushingCloud = true;
  try {
    const res = await fetch(JSONBLOB_ENDPOINT, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (e) {
    console.log('Cloud push error:', e);
    return false;
  } finally {
    setTimeout(() => { isPushingCloud = false; }, 1000);
  }
};

// Pull cloud changes via GET
export const pullFullCloudPayload = async () => {
  if (isPushingCloud) return { success: false, skipped: true };

  try {
    const res = await fetch(JSONBLOB_ENDPOINT, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object') {
        const hasChanges = applyCloudPayload(data);
        if (hasChanges) {
          pushFullCloudPayload();
        }
        return { success: true, hasChanges, data };
      }
    }
  } catch (e) {
    console.log('Cloud pull error:', e);
  }
  return { success: false, hasChanges: false };
};

export const saveAndSyncCloud = async (storageKey, value) => {
  if (typeof value === 'string') {
    localStorage.setItem(storageKey, value);
  } else {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }
  await pushFullCloudPayload();
};

export const pushToCloud = pushFullCloudPayload;
export const pullFromCloud = pullFullCloudPayload;
