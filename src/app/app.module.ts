import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';

// AG-GRID
import {AgGridModule} from 'ag-grid-angular';
import {LicenseManager} from 'ag-grid-enterprise';
import {ResultFilterComponent} from "./result/result-filter.component";
import {environment} from "../environments/environment";
import {ResultComponent} from "./result/result.component";
import {FormsModule} from "@angular/forms";

LicenseManager.setLicenseKey(environment.agGridLicense);

@NgModule({
  declarations: [
    AppComponent,
    ResultComponent,
    ResultFilterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AgGridModule.withComponents([
      ResultFilterComponent
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
