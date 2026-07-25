export type Role = 'citizen' | 'officer' | 'admin'

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
  created_at: string
}

export interface Complaint {
  id: string
  title: string
  description: string
  category: string
  image_url: string | null
  latitude: number | null
  longitude: number | null
  status: ComplaintStatus
  user_id: string
  created_at: string
  updated_at: string
  profiles?: Pick<Profile, 'name'>
}

export interface Comment {
  id: string
  complaint_id: string
  user_id: string
  message: string
  created_at: string
}
