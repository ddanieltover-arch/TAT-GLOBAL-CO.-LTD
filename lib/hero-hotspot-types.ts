export type HeroHotspotAction =
  | {type: 'link'; href: string}
  | {type: 'quote'}
  | {type: 'whatsapp'}
  | {type: 'tel'}
  | {type: 'external'; href: string};

export type HeroHotspot = {
  id: string;
  /** i18n key under `hero.hotspots` */
  labelKey: string;
  left: number;
  top: number;
  width: number;
  height: number;
  action: HeroHotspotAction;
};
