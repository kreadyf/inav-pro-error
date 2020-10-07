import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {GridReadyEvent} from 'ag-grid-community';
import {BehaviorSubject, Subscription} from 'rxjs';
import {ResultFilterComponent} from "./result-filter.component";
import {DATA} from "./data";

@Component({
  selector: 'result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})

export class ResultComponent implements OnInit, OnDestroy {

  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<any>();
  @Output() sendGenerate = new EventEmitter<any>();
  @Input() showProfileRef: boolean;

  // Configuration AG-GRID
  public gridApi;
  public gridColumnApi;
  public gridOptions;
  public columnDefs;
  public defaultColDef;
  public rowClassRules;
  public context;
  public frameworkComponents;

  rowData = DATA;

  stepsSubs: Subscription;

  auxActivityResult = new BehaviorSubject<any>(null);
  auxActivityResults = [];

  disableCheck = new BehaviorSubject<boolean>(true);

  showTop = false;
  filterSource = "Default";

  constructor() {

    this.defaultColDef = {
      enableRowGroup: true,
      enablePivot: true,
      resizable: true,
      filter: 'text',
      sortable: true,
      editable: true,
      floatingFilter: true
    };

    this.context = {componentParent: this};
    this.frameworkComponents = {
      minInvestmentFilter: ResultFilterComponent
    };

    

    this.gridOptions = {
      headerHeight: 45,
      rowGroupPanelShow: 'always',
      onModelUpdated: (event:any)=> {
        console.log(this.filterSource);
        if ( event.api )
        {
          
          if (this.filterSource === "Default")
          {
            event.api.forEachLeafNode(function(rowNode) {
                rowNode.data.orgOrFirstAlt = true;
            });
            this.filterSource = "TopResultReset";
              event.api.getFilterInstance('orgOrFirstAlt')
                .setModel({filterType: 'set', values: null });
            event.api.onFilterChanged();
            return;
          }

          if (this.filterSource === "TopResultReset")
          {
            let processedItems = {};
            event.api.forEachNodeAfterFilterAndSort(function(rowNode) {
              if ( rowNode.data )
              {
                rowNode.data.orgOrFirstAlt = rowNode.data.originalISIN === rowNode.data.isin || processedItems[rowNode.data.hash] === undefined;

                if (rowNode.data.originalISIN !== rowNode.data.isin )
                  processedItems[rowNode.data.hash] = true;
              }
            });
            this.filterSource = "TopResultRefreshed";
            if (this.showTop)
              event.api.getFilterInstance('orgOrFirstAlt')
                .setModel({filterType: 'set', values: ["true"] });
            event.api.onFilterChanged();
            return;
          }
        }

        this.filterSource = "Default";  
        event.api.refreshCells();


      }
    };

    this.columnDefs = [
      {headerName: 'hash', field: 'hash', width: 300},
      {headerName: 'orgOrFirstAlt', field: 'orgOrFirstAlt', filter: 'agSetColumnFilter', width: 100},
      {
        headerName: 'Sort',
        field: 'calculated', width: 120
      },
      {headerName: 'ISIN', field: 'isin'},
    ];

    this.rowClassRules = {
      'isin-equals': params => {
        if (params && params.data) {
          return params.data.isin === params.data.originalISIN;
        }
      }
    };
  }

  ngOnInit() {
    // Generate success


  }

  ngOnDestroy(): void {
    this.stepsSubs ? this.stepsSubs.unsubscribe() : '';
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.setRowData(DATA);
  }

  changeCheck() {
    this.gridApi.onFilterChanged();
  }

  removeDuplicates(data, prop) {
    const newArray = [];
    const lookupObject = {};

    for (let i in data) {
      lookupObject[data[i][prop]] = data[i];
    }
    for (let i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }

  changeModeView() {


    this.gridApi.onFilterChanged();    
  }

}

