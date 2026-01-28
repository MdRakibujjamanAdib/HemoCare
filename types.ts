export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Donor {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: BloodGroup;
  phone: string;
  address: string;
  lastDonationDate?: string;
  isAvailableForEmergency: boolean;
  isApproved: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialist: string;
  hospital: string;
  phone: string;
  image?: string;
  useCentralContact?: boolean;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  services: string[];
  phone: string;
  image?: string;
}

export interface SystemSettings {
  centralPhone: string;
  useCentralPhone: boolean;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface DonationRequest {
  id: string;
  fullName: string;
  mobileNumber: string;
  description: string;
  isApproved: boolean;
  createdAt?: any;
}
