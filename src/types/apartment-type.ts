export default interface IApartment {
  id?: any | null;
  price?: String;
  description?: String;
  size?: String;
  address?: String;
  city?: String;
  country?: String;
}

export interface ApartmentComponentProps {
  canDelete: boolean;
  onDelete: (apartment: IApartment) => void;
  loadApartments: () => void;
  apartments: IApartment[];
}
