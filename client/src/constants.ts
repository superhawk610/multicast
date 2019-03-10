export const COLORS = {
  black: 'hsl(0,0%,4%)',
  black2: 'hsl(0,0%,7%)',
  black3: 'hsl(0,0%,14%)',
  greyDarker: 'hsl(0,0%,21%)',
  greyDark: 'hsl(0,0%,29%)',
  grey: 'hsl(0,0%,48%)',
  greyTint: 'rgba(20,20,20,0.1)',
  greyLight: 'hsl(0,0%,71%)',
  greyLighter: 'hsl(0,0%,86%)',
  white3: 'hsl(0,0%,96%)',
  white2: 'hsl(0,0%,98%)',
  white: 'hsl(0,0%,100%)',
  orange: 'hsl(14,100%,53%)',
  yellow: 'hsl(48,100%,67%)',
  // green: 'hsl(141,71%,48%)',
  green: '#66b66a',
  greenTint: 'rgba(40,71,42,0.1)',
  turquoise: 'hsl(171,100%,41%)',
  cyan: 'hsl(204,86%,53%)',
  blue: 'hsl(217,71%,53%)',
  purple: 'hsl(271,100%,71%)',
  red: 'hsl(348,100%,61%)',
};

// we need the namespace here to allow components
// to specify which Themes they accept
// tslint:disable-next-line:no-namespace
export namespace Themes {
  export type none = '';
  export type white = 'is-white';
  export type light = 'is-light';
  export type dark = 'is-dark';
  export type black = 'is-black';
  export type text = 'is-text';
  export type primary = 'is-primary';
  export type link = 'is-link';
  export type info = 'is-info';
  export type success = 'is-success';
  export type warning = 'is-warning';
  export type danger = 'is-danger';
}

export type Theme =
  | Themes.none
  | Themes.white
  | Themes.light
  | Themes.dark
  | Themes.black
  | Themes.text
  | Themes.primary
  | Themes.link
  | Themes.info
  | Themes.success
  | Themes.warning
  | Themes.danger;

export const THEMES: {
  none: Themes.none;
  white: Themes.white;
  light: Themes.light;
  dark: Themes.dark;
  black: Themes.black;
  text: Themes.text;
  primary: Themes.primary;
  link: Themes.link;
  info: Themes.info;
  success: Themes.success;
  warning: Themes.warning;
  danger: Themes.danger;
} = {
  none: '',
  white: 'is-white',
  light: 'is-light',
  dark: 'is-dark',
  black: 'is-black',
  text: 'is-text',
  primary: 'is-primary',
  link: 'is-link',
  info: 'is-info',
  success: 'is-success',
  warning: 'is-warning',
  danger: 'is-danger',
};
