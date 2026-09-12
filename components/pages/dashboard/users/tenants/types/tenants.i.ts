export interface TenantData {
  companyName: string
  tradeName: string
  businessField: string
  npwp: string
  businessDescription: string
  address: string
  district: string
  postalCode: string
  province: string
  mapsQuery: string
  phone: string
  email: string
  website: string
  foundedYear: string
  productCount: string
  latitude: number | null
  longitude: number | null
}

export const emptyData: TenantData = {
  companyName: "",
  tradeName: "",
  businessField: "",
  npwp: "",
  businessDescription: "",
  address: "",
  district: "",
  postalCode: "",
  province: "",
  mapsQuery: "",
  phone: "",
  email: "",
  website: "",
  foundedYear: "",
  productCount: "",
  latitude: null,
  longitude: null
}

export interface ViewFieldProps {
  label: string
  value: string
}

export interface ContactPartialProps {
  data: TenantData
  isEditing: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}