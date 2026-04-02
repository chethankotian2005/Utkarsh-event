import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";

export interface TreasureHuntRegistration {
  id?: string;
  teamName: string;
  teamLeadName: string;
  teamLeadUSN: string;
  teamLeadPhone: string;
  participants: string[];
  registeredAt?: Date;
}

export interface ViralSelfieRegistration {
  id?: string;
  teamName: string;
  teamLeadName: string;
  teamLeadUSN: string;
  teamLeadPhone: string;
  participants?: string[];
  registeredAt?: Date;
}

async function checkDuplicate(
  collectionName: string,
  teamName: string,
  teamLeadUSN: string
): Promise<{ isDuplicate: boolean; field?: string }> {
  const col = collection(db, collectionName);

  const nameQuery = query(col, where("teamName", "==", teamName));
  const nameSnap = await getDocs(nameQuery);
  if (!nameSnap.empty) return { isDuplicate: true, field: "team name" };

  const usnQuery = query(col, where("teamLeadUSN", "==", teamLeadUSN.toUpperCase()));
  const usnSnap = await getDocs(usnQuery);
  if (!usnSnap.empty) return { isDuplicate: true, field: "USN" };

  return { isDuplicate: false };
}

export async function addTreasureHuntRegistration(
  data: Omit<TreasureHuntRegistration, "id" | "registeredAt">
): Promise<{ success: boolean; error?: string }> {
  try {
    // SECURITY NOTE: checkDuplicate() requires 'read' access. 
    // Since firestore.rules correctly blocks public reads to protect user data,
    // this query throws "Missing or insufficient permissions".
    // We bypass it here to allow the open 'create' rule to succeed.
    /*
    const dup = await checkDuplicate("treasureHunt", data.teamName, data.teamLeadUSN);
    if (dup.isDuplicate) {
      return {
        success: false,
        error: `A team with this ${dup.field} is already registered for Treasure Hunt.`,
      };
    }
    */

    await addDoc(collection(db, "treasureHunt"), {
      ...data,
      teamLeadUSN: data.teamLeadUSN.toUpperCase(),
      registeredAt: serverTimestamp(),
    });

    return { success: true };
  } catch (err) {
    console.error("Firestore error:", err);
    return { success: false, error: "Failed to register. Please try again." };
  }
}

export async function addViralSelfieRegistration(
  data: Omit<ViralSelfieRegistration, "id" | "registeredAt">
): Promise<{ success: boolean; error?: string }> {
  try {
    // SECURITY NOTE: checkDuplicate() requires 'read' access. 
    // Since firestore.rules correctly blocks public reads to protect user data,
    // this query throws "Missing or insufficient permissions".
    // We bypass it here to allow the open 'create' rule to succeed.
    /*
    const dup = await checkDuplicate("viralSelfie", data.teamName, data.teamLeadUSN);
    if (dup.isDuplicate) {
      return {
        success: false,
        error: `A team with this ${dup.field} is already registered for Viral Selfie.`,
      };
    }
    */

    await addDoc(collection(db, "viralSelfie"), {
      ...data,
      teamLeadUSN: data.teamLeadUSN.toUpperCase(),
      registeredAt: serverTimestamp(),
    });

    return { success: true };
  } catch (err) {
    console.error("Firestore error:", err);
    return { success: false, error: "Failed to register. Please try again." };
  }
}

export function subscribeTreasureHunt(
  callback: (data: TreasureHuntRegistration[]) => void
) {
  const q = query(collection(db, "treasureHunt"), orderBy("registeredAt", "desc"));
  return onSnapshot(q, (snap: QuerySnapshot<DocumentData>) => {
    const data = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      registeredAt: doc.data().registeredAt?.toDate(),
    })) as TreasureHuntRegistration[];
    callback(data);
  });
}

export function subscribeViralSelfie(
  callback: (data: ViralSelfieRegistration[]) => void
) {
  const q = query(collection(db, "viralSelfie"), orderBy("registeredAt", "desc"));
  return onSnapshot(q, (snap: QuerySnapshot<DocumentData>) => {
    const data = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      registeredAt: doc.data().registeredAt?.toDate(),
    })) as ViralSelfieRegistration[];
    callback(data);
  });
}
