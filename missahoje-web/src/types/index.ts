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

interface Timestamps {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Cidade extends Timestamps {
  id: string;
  nome: string;
  estado: string;
  slug: string;
  comunidades?: Comunidade[];
}

export interface Paroquia extends Timestamps {
  id: string;
  nome: string;
  telefone: string | null;
  siteOuRedeSocial: string | null;
  comunidades?: Comunidade[];
}

export interface Comunidade extends Timestamps {
  id: string;
  paroquia_id: string;
  cidade_id: string | null;
  nome: string;
  endereco: string;
  bairro: string;
  link_google_maps: string | null;
  paroquia?: Paroquia;
  cidade?: Cidade;
  horarios_missa?: HorarioMissa[];
}

export interface HorarioMissa extends Timestamps {
  id: string;
  comunidade_id: string;
  dia_semana: number;
  horario: string;
  observacao: string | null;
  comunidade?: Comunidade;
}
