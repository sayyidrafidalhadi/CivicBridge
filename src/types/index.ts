export type Role = 'citizen' | 'officer' | 'admin'

export type AuthorityType =
  | 'mla'
  | 'mp'
  | 'ward_member'
  | 'panchayat'
  | 'municipality'
  | 'corporation'
  | 'water_authority'
  | 'electricity_board'
  | 'other'

export type ComplaintStatus =
  | 'submitted'
  | 'under_review'
  | 'in_progress'
  | 'resolved'

export interface Profile {
  id: string
  name: string
  email: string
  role: Role
  authority_id?: string
  created_at: string
}

export interface Authority {
  id: string
  name: string
  type: AuthorityType
  jurisdiction: string
  email: string
  phone?: string
  created_at: string
}

export interface Complaint {
  id: string
  case_number: string
  title: string
  description: string
  category: string
  image_url: string | null
  latitude: number | null
  longitude: number | null
  status: ComplaintStatus
  assigned_to: string
  user_id: string
  created_at: string
  updated_at: string
  profiles?: Pick<Profile, 'name'>
  authorities?: Pick<Authority, 'name' | 'type'>
}

export interface Comment {
  id: string
  complaint_id: string
  user_id: string
  message: string
  created_at: string
}

export const AUTHORITY_TYPES: { value: AuthorityType; label: string }[] = [
  { value: 'mla', label: 'MLA' },
  { value: 'mp', label: 'MP' },
  { value: 'ward_member', label: 'Ward Member' },
  { value: 'panchayat', label: 'Panchayat' },
  { value: 'municipality', label: 'Municipality' },
  { value: 'corporation', label: 'Corporation' },
  { value: 'water_authority', label: 'Water Authority' },
  { value: 'electricity_board', label: 'Electricity Board' },
  { value: 'other', label: 'Other' },
]
