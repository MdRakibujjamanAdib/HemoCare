import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, Timestamp } from 'firebase/firestore';
import { Donor, Doctor, Hospital, DonationRequest } from '../types';

const COLLECTIONS = {
  DONORS: 'donors',
  DOCTORS: 'doctors',
  HOSPITALS: 'hospitals',
  DONATION_REQUESTS: 'donation_requests',
};

// Seed Data
const MOCK_DOCTORS: Doctor[] = [
  { id: '1', name: 'Dr. Sarah Ahmed', specialist: 'Cardiologist', hospital: 'Dhaka Medical College', phone: '+880 1711-000000', image: 'https://picsum.photos/100/100?random=1' },
  { id: '2', name: 'Dr. Rafiqul Islam', specialist: 'Neurologist', hospital: 'Square Hospital', phone: '+880 1711-111111', image: 'https://picsum.photos/100/100?random=2' },
  { id: '3', name: 'Dr. Anika Tabassum', specialist: 'Hematologist', hospital: 'Evercare Hospital', phone: '+880 1711-222222', image: 'https://picsum.photos/100/100?random=3' },
  { id: '4', name: 'Dr. Kamal Hossain', specialist: 'Pediatrician', hospital: 'Bangladesh Shishu Hospital', phone: '+880 1711-333333', image: 'https://picsum.photos/100/100?random=4' },
];

const MOCK_HOSPITALS: Hospital[] = [
  { id: '1', name: 'Square Hospital', address: '18/F, Bir Uttam Qazi Nuruzzaman Sarak, Dhaka', services: ['ICU', 'Emergency', 'Blood Bank'], phone: '10616', image: 'https://picsum.photos/200/150?random=5' },
  { id: '2', name: 'Dhaka Medical College', address: 'Secretariat Rd, Dhaka 1000', services: ['General Medicine', 'Surgery', 'Burn Unit'], phone: '02-55165088', image: 'https://picsum.photos/200/150?random=6' },
  { id: '3', name: 'Evercare Hospital', address: 'Plot 81, Block E, Bashundhara R/A, Dhaka', services: ['Cardiology', 'Neurosurgery', 'Oncology'], phone: '10678', image: 'https://picsum.photos/200/150?random=7' },
];

export const seedDatabase = async () => {
  // Check if doctors exist before seeding
  const doctorsSnapshot = await getDocs(collection(db, COLLECTIONS.DOCTORS));
  if (doctorsSnapshot.empty) {
    // console.log("Seeding Doctors...");
    for (const docData of MOCK_DOCTORS) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...data } = docData; // Remove ID to let Firestore generate one
      await addDoc(collection(db, COLLECTIONS.DOCTORS), data);
    }
  }

  // Check if hospitals exist before seeding
  const hospitalsSnapshot = await getDocs(collection(db, COLLECTIONS.HOSPITALS));
  if (hospitalsSnapshot.empty) {
    // console.log("Seeding Hospitals...");
    for (const hospData of MOCK_HOSPITALS) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...data } = hospData; // Remove ID to let Firestore generate one
      await addDoc(collection(db, COLLECTIONS.HOSPITALS), data);
    }
  }
};

export const getDoctors = async (): Promise<Doctor[]> => {
  let querySnapshot = await getDocs(collection(db, COLLECTIONS.DOCTORS));

  if (querySnapshot.empty) {
    await seedDatabase();
    // Re-fetch after seeding
    querySnapshot = await getDocs(collection(db, COLLECTIONS.DOCTORS));
  }

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
};

export const getHospitals = async (): Promise<Hospital[]> => {
  let querySnapshot = await getDocs(collection(db, COLLECTIONS.HOSPITALS));

  if (querySnapshot.empty) {
    await seedDatabase();
    // Re-fetch after seeding
    querySnapshot = await getDocs(collection(db, COLLECTIONS.HOSPITALS));
  }

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Hospital));
};

export const getDonors = async (): Promise<Donor[]> => {
  const querySnapshot = await getDocs(collection(db, COLLECTIONS.DONORS));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Donor));
};

export const addDonor = async (donor: Omit<Donor, 'id'>): Promise<void> => {
  await addDoc(collection(db, COLLECTIONS.DONORS), {
    ...donor,
    isApproved: false,
    createdAt: Timestamp.now(),
  });
};

// Settings
export const getSettings = async (): Promise<{ centralPhone: string; useCentralPhone: boolean }> => {
  const querySnapshot = await getDocs(collection(db, 'settings'));
  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data() as any;
  }
  return { centralPhone: '', useCentralPhone: false };
};

export const updateSettings = async (settings: { centralPhone: string; useCentralPhone: boolean }) => {
  const q = query(collection(db, 'settings'));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    await addDoc(collection(db, 'settings'), settings);
  } else {
    // Logic handled by server usually, but here for reference
  }
};

// Donation Requests
export const getDonationRequests = async (): Promise<DonationRequest[]> => {
  const querySnapshot = await getDocs(collection(db, COLLECTIONS.DONATION_REQUESTS));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DonationRequest));
};

export const addDonationRequest = async (request: Omit<DonationRequest, 'id' | 'isApproved'>): Promise<void> => {
  await addDoc(collection(db, COLLECTIONS.DONATION_REQUESTS), {
    ...request,
    isApproved: false,
    createdAt: Timestamp.now(),
  });
};

export const approveDonationRequest = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.DONATION_REQUESTS, id);
  await updateDoc(docRef, {
    isApproved: true,
  });
};

export const deleteDonationRequest = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.DONATION_REQUESTS, id);
  await deleteDoc(docRef);
};

