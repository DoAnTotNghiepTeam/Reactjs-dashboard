export interface AboutUs {
  id: number;
  companyName: string;
  companyTitle: string;
  companyDescription: string;
  servicesSectionTitle: string;
  servicesSectionDescription: string;
  imageUrl: string;
}

export interface CreateAboutUs {
  companyName: string;
  companyTitle: string;
  companyDescription: string;
  servicesSectionTitle: string;
  servicesSectionDescription: string;
  imageUrl: string;
}

export type UpdateAboutUs = Partial<CreateAboutUs>;
