import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from "@angular/core";
import { GridReadyEvent, ValueGetterParams } from "ag-grid-community";
import { BehaviorSubject, Subscription } from "rxjs";
import { ResultFilterComponent } from "./result-filter.component";
import { DATA } from "./data";

@Component({
  selector: "result",
  templateUrl: "./result.component.html",
  styleUrls: ["./result.component.scss"]
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
      filter: "text",
      sortable: true,
      editable: true,
      floatingFilter: true
    };

    this.context = { componentParent: this };
    this.frameworkComponents = {
      minInvestmentFilter: ResultFilterComponent
    };

    this.gridOptions = {
      headerHeight: 45,
      rowGroupPanelShow: "always",
      onModelUpdated: (event: any) => {
        if (event.api) {
          if (this.filterSource === "Default") {
            event.api.forEachLeafNode(function(rowNode) {
              rowNode.data.orgOrFirstAlt = true;
            });
            this.filterSource = "TopResultReset";
            event.api.onFilterChanged();
            return;
          }

          if (this.filterSource === "TopResultReset") {
            let processedItems = {};
            event.api.forEachNodeAfterFilterAndSort(function(rowNode) {
              if (rowNode.data) {
                rowNode.data.orgOrFirstAlt =
                  rowNode.data.originalISIN === rowNode.data.isin ||
                  processedItems[rowNode.data.hash] === undefined;

                if (rowNode.data.originalISIN !== rowNode.data.isin)
                  processedItems[rowNode.data.hash] = true;
              }
            });
            this.filterSource = "TopResultRefreshed";
            event.api.onFilterChanged();
            return;
          }
        }
        this.filterSource = "Default";
        event.api.refreshCells();
      }
    };

    this.columnDefs = [
      { headerName: "hash", field: "hash", width: 300 },
      {
        headerName: "orgOrFirstAlt",
        field: "orgOrFirstAlt",
        filter: "agSetColumnFilter",
        width: 100
      },
      {
        headerName: "Sort",
        field: "calculated",
        width: 120
      },
      { headerName: "ISIN", field: "isin" },
      { ...this.CreateNumberFilterParams("Ong. Charges", "ongoingCharges") }
    ];

    this.rowClassRules = {
      "isin-equals": params => {
        if (params && params.data) {
          return params.data.isin === params.data.originalISIN;
        }
      }
    };
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.stepsSubs ? this.stepsSubs.unsubscribe() : "";
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
    if (!this.showTop)
      this.gridApi
        .getFilterInstance("orgOrFirstAlt")
        .setModel({ filterType: "set", values: null });
    else
      this.gridApi
        .getFilterInstance("orgOrFirstAlt")
        .setModel({ filterType: "set", values: ["true"] });

    this.gridApi.onFilterChanged();
  }

  CreateNumberFilterParams(headerName: string, columnName: string): any {
    let createFilterOption = (key: string, label: string, func: any) => ({
      displayKey: key,
      displayName: label,
      test: (filterValue, cellValue) =>
        cellValue.isOriginal ||
        (cellValue.cellValue != null && func(filterValue, cellValue.cellValue))
    });

    return {
      headerName: headerName,
      field: columnName,
      filter: "agNumberColumnFilter",
      filterParams: {
        defaultOption: "lessThanOrEqual",
        filterOptions: [
          "empty",
          {
            ...createFilterOption(
              "lessThanOrEqual",
              "Less Than or Equal",
              (filterVal, val) => val <= filterVal
            )
          },
          {
            ...createFilterOption(
              "lessThan",
              "Less Than",
              (filterVal, val) => val < filterVal
            )
          },
          {
            ...createFilterOption(
              "greaterThanOrEqual",
              "Greater Than or Equal",
              (filterVal, val) => val >= filterVal
            )
          },
          {
            ...createFilterOption(
              "greaterThan",
              "Greater Than",
              (filterVal, val) => val > filterVal
            )
          }
        ],
        suppressAndOrCondition: true
      },
      filterValueGetter: (params: ValueGetterParams) => {
        const rowData = params.data;
        return {
          isOriginal: rowData.calculated === "Original",
          cellValue: rowData[columnName]
        }; // pass all row data
      }
    };
  }
}
