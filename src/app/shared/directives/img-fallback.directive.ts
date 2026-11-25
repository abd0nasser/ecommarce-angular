import { Directive } from '@angular/core';
const PLACEHOLDER = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="100%" height="100%" fill="#e6efdf"/><text x="50%" y="50%" fill="#66756b" font-family="sans-serif" text-anchor="middle">No image</text></svg>');
/** Swaps a broken image for a neutral placeholder. */
@Directive({ selector: 'img[appImgFallback]', host: { '(error)': 'onError($event)' } })
export class ImgFallbackDirective {
  onError(e: Event) { const img = e.target as HTMLImageElement; if (img.src !== PLACEHOLDER) img.src = PLACEHOLDER; }
}
