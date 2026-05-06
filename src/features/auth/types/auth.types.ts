export interface UserProfile {
  id: string
  name: string
  email: string
  role: 'superadmin' | 'admin'
  region_id: string | null
}
