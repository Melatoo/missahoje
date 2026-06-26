export interface PaginationMeta {
  itemCount: number;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface Cidade {
  id: string;
  nome: string;
  estado: string;
  ibge_id: string;
}

export interface Paroquia {
  id: string;
  nome: string;
  cidade_id: string;
  cidade?: Cidade;
}

export interface Comunidade {
  id: string;
  nome: string;
  endereco: string;
  bairro: string;
  cep: string;
  paroquia_id: string;
  paroquia?: Paroquia;
}

export interface HorarioMissa {
  id: string;
  comunidade_id: string;
  dia_semana: number;
  horario: string;
  observacao?: string;
  comunidade?: Comunidade;
}
