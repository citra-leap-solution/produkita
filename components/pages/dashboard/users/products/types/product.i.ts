export interface ICertBadge {
  type: "BPOM" | "HALAL" | "PIRT" | "COA"
  active?: boolean
}

export interface IProductTable {
  search: string
  onTotalChange: (total: number) => void
}

export interface IProductToolbar {
  search: string
  onSearch: (value: string) => void
}

export interface IToogle {
  checked: boolean
  onChange: (v: boolean) => void
  color: "blue" | "purple" | "green" | "orange"
  disabled?: boolean
}