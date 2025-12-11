export interface IExploreNearby {
  location: string;
  img: string;
  distance: string;
}

export interface ILiveAnywhere {
  img: string;
  title: string;
}

export interface IContactForm {
  firstName: string;
  lastName: string;
  phone: string;
  requirementType: string;
  propertyType: string;
  purpose: string;
  location: string;
  budget: string;
  propertyId?: string;
  propertyTitle?: string;
}
