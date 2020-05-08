import { NgModule } from '@angular/core';
import { UppercaseFirstLetterPipe } from './uppercase-first-letter.pipe';

@NgModule({
  declarations: [UppercaseFirstLetterPipe],
  exports: [UppercaseFirstLetterPipe]
})
export class PipesModule {}
