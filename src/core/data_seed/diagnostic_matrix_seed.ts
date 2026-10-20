import { PortfolioDiagnosticMatrix } from "../diagnostics/portfolio_diagnostic_matrix";

export const diagnostic_matrix_headers: string[] = [
  "Línea",
  "Capa anatómica",
  "Diagnóstico",
  "Complejo activo",
  "Gesto de uso",
  "Nivel",
];

export const diagnostic_matrix_rows: string[][] = [
  [
    "Defilé",
    "Cutícula y cuero cabelludo",
    "Acumulación de residuos y pérdida de brillo",
    "Biotina · Keratina · Romero",
    "Champú detox de 2 a 3 veces por semana",
    "Cuidado en casa",
  ],
  [
    "Defilé",
    "Cutícula y piel",
    "Deshidratación y frizz superficial",
    "Seda · Coco · Pantenol",
    "Acondicionador o baño de crema",
    "Cuidado en casa",
  ],
  [
    "Defilé",
    "Cutícula y piel",
    "Rubios o canas con reflejo amarillo",
    "Pigmento violeta · Jojoba",
    "Mascarilla matizadora semanal",
    "Formulación técnica",
  ],
  [
    "Tricomplex",
    "Corteza profunda",
    "Fibra quebradiza y elasticidad reducida",
    "Ácido hialurónico · Colágeno",
    "Ampolla de choque 1 o 2 veces por semana",
    "Formulación técnica",
  ],
  [
    "Tricomplex",
    "Corteza profunda",
    "Daño químico severo y pérdida de masa",
    "17 aminoácidos · Ceramidas",
    "Protocolo de cauterización en salón",
    "Nivel profesional",
  ],
  [
    "Oleo's",
    "Escudo exterior",
    "Fricción, frizz y calor de herramientas",
    "Argán · Macadamia · Ceramidas",
    "Sérum de 2 a 3 gotas en medios y puntas",
    "Cuidado en casa",
  ],
  [
    "Oleo's",
    "Escudo exterior",
    "Brillo apagado y puntas abiertas",
    "Uva · Coco · Vitamina E",
    "Óleo de acabado en seco",
    "Cuidado en casa",
  ],
  [
    "Vesuviana",
    "Tres capas",
    "Mantenimiento integral después del protocolo",
    "Defilé + Tricomplex + Oleo's",
    "Rutina semanal por capas",
    "Ecosistema Vesuviana",
  ],
];

export const portfolio_diagnostic_matrix = new PortfolioDiagnosticMatrix(
  diagnostic_matrix_headers,
  diagnostic_matrix_rows,
);
