import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { defineComponents, IgcRatingComponent } from 'igniteui-webcomponents';
defineComponents(IgcRatingComponent);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
