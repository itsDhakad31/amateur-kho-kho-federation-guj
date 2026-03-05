export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  date: string;
  image: string;
}

export interface EventItem {
  id: number;
  title: string;
  date: string;
  location: string;
  category: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
}

export interface RegistrationData {
  unique_id?: string;
  name: string;
  dob: string;
  address_city: string;
  address_country: string;
  gender: string;
  email: string;
  mobile: string;
  experience: string;
  role: 'Coach' | 'Student';
  status?: string;
  // Docs
  doc_photo?: string;
  doc_aadhar?: string;
  doc_pan?: string;
  doc_birth?: string;
  // Student specific
  level_passing?: string;
  year_passing?: string;
  coaching_cert?: string;
  edu_qualification?: string;
  referee_cert?: string;
}
