export default interface User {
  id: string;
  login: string;
  displayName: string;
  userType: string;
  broadcasterType: string;
  description: string;
  profileImageURL: string;
  offlineImageURL: string;
  viewCount: number;
  email?: string;
  created_at: string;
}
