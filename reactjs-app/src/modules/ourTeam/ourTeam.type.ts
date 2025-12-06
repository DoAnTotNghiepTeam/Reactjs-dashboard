export interface OurTeam {
  id: number;
  ourTeam: string;
  ourTeamTitle: string;
  ourTeamDescription: string;
  name: string;
  viTri: string;
  location: string;
  imageUrl: string;
}

export interface CreateOurTeamRequest {
  ourTeam: string;
  ourTeamTitle: string;
  ourTeamDescription: string;
  name: string;
  viTri: string;
  location: string;
  imageUrl: string;
}

export type UpdateOurTeamRequest = Partial<CreateOurTeamRequest>;
