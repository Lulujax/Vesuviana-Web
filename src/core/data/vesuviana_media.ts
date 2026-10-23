export const VESUVIANA_MEDIA = {
  logos: {
    defile_dark: "/5118493774723091967.jpg",
    defile_light: "/5118493774723091969.jpg",
    oleos_icon: "/5118493774723091949.jpg",
    oleos_wordmark: "/5118493774723091959.jpg"
  },
  hero: {
    campaign: "/5118493774723091970.jpg",
    editorial: "/5118493774723091971.jpg",
    portrait: "/5118493774723092002.jpg"
  },
  lifestyle: {
    defile_woman: "/5118493774723091977.jpg",
    defile_pink: "/5118493774723091981.jpg",
    oleos_campaign: "/5118493774723091987.jpg",
    defile_ad: "/5118493774723091992.jpg",
    tricomplex_woman: "/5118493774723092004.jpg",
    oleos_spa: "/5118493774723092005.jpg"
  },
  products: {
    oleos_control_caida: "/productos/oleos-control-caida.png",
    oleos_control_frizz: "/productos/oleos-control-frizz.png",
    oleos_restaurador: "/productos/oleos-restaurador.png",
    oleos_cuidado_diario: "/productos/oleos-cuidado-diario.png",
    oleos_control_caspa: "/productos/oleos-control-caspa.png",
    oleos_rizos_definidos: "/productos/oleos-rizos-definidos.png",
    tricomplex_matizador: "/productos/tricomplex-matizador.png",
    tricomplex_vit_e: "/productos/tricomplex-vit-e.png",
    tricomplex_hialuronico: "/productos/tricomplex-hialuronico.png",
    tricomplex_linea_blanca: "/productos/tricomplex-linea-blanca.png",
    tricomplex_ph_shampoo: "/productos/tricomplex-ph-shampoo.png",
    tricomplex_ph_galon: "/productos/tricomplex-ph-neutral-galon.png",
    tricomplex_activador: "/productos/tricomplex-activador-rizos.png",
    tricomplex_desenredante: "/productos/tricomplex-desenredante.png",
    tricomplex_crespos: "/productos/tricomplex-crespos-definidos.png",
    defile_ampolla_azul: "/5118493774723091974 (1).jpg",
    defile_ampolla_beige: "/5118493774723091975.jpg",
    defile_ampolla_dorada: "/5118493774723091993.jpg",
    defile_ampolla_roja: "/5118493774723091995.jpg",
    defile_ampolla_violeta: "/5118493774723092012.jpg",
    defile_mascarilla: "/5118493774723091985.jpg",
    defile_crema: "/5118493774723092003.jpg",
    defile_tratamiento: "/5118493774723092006.jpg"
  }
} as const;

export const BRAND_LOGOS: Record<string, string> = {
  defile: VESUVIANA_MEDIA.logos.defile_dark,
  oleos: VESUVIANA_MEDIA.logos.oleos_wordmark
};
