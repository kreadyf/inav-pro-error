import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { HelloComponent } from "./hello.component";
import { ResultComponent } from "./result/result.component";

// AG-GRID
import {AgGridModule} from 'ag-grid-angular';
import {LicenseManager} from 'ag-grid-enterprise';

LicenseManager.setLicenseKey('CompanyName=Investment Navigator AG,LicensedGroup=Multi,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=2,LicensedProductionInstancesCount=1,AssetReference=AG-008087,ExpiryDate=12_May_2021_[v2]_MTYyMDc3NDAwMDAwMA==01ce29f693a74c11c41ae7e4effb865f');

@NgModule({
  imports: [BrowserModule, FormsModule, AgGridModule.withComponents([])],
  declarations: [
    AppComponent, 
    HelloComponent,
    ResultComponent
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
