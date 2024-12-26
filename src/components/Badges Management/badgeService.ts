import { db } from '@/util/firebaseConfig';
import {  doc, getDoc, setDoc } from 'firebase/firestore';
import { Badge } from '../../features/badgeSlice';

export const fetchUserBadges = async (userEmail: string) => {
  try {
    const userBadgesDoc = await getDoc(doc(db, 'badges', userEmail));
    if (userBadgesDoc.exists()) {
      return userBadgesDoc.data().badges as Badge[];
    }
    return [];
  } catch (error) {
    console.error('Error fetching badges:', error);
    return [];
  }
};

export const saveUserBadges = async (userEmail: string, badges: Badge[]) => {
  try {
    await setDoc(doc(db, 'badges', userEmail), { badges }, { merge: true });
  } catch (error) {
    console.error('Error saving badges:', error);
  }
};

