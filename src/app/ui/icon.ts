import { Component, input } from '@angular/core';

export type IconName = 'arrow-right' | 'arrow-left' | 'arrow-up-right' | 'chevron-right' | 'grid' | 'full';

const PATHS: Record<IconName, string> = {
  'arrow-right': 'M1 8h13M9 3l5 5-5 5',
  'arrow-left': 'M15 8H2M7 3 2 8l5 5',
  'arrow-up-right': 'M3 13 13 3M5 3h8v8',
  'chevron-right': 'm5 2 6 6-6 6',
  grid: 'M1.5 1.5h5v5h-5zM9.5 1.5h5v5h-5zM1.5 9.5h5v5h-5zM9.5 9.5h5v5h-5z',
  full: 'M1.5 5.5v-4h4M10.5 1.5h4v4M14.5 10.5v4h-4M5.5 14.5h-4v-4',
};

/** Iconos finos (trazo 1.5 px) en SVG inline. */
@Component({
  selector: 'app-icon',
  template: `<svg
    [attr.width]="size()"
    [attr.height]="size()"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="square"
    aria-hidden="true"
  >
    <path [attr.d]="path()" />
  </svg>`,
  host: { class: 'inline-flex shrink-0' },
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(12);
  protected path() {
    return PATHS[this.name()];
  }
}
