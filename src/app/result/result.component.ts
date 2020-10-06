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

export class ResultComponent

  implements OnInit, OnDestroy {
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<any>();
  @Output() sendGenerate = new EventEmitter<any>();
  @Input() showProfileRef: boolean;

  actionSubs: Subscription[] = [];

  // Configuration AG-GRID
  public gridApi;
  public gridColumnApi;
  public gridOptions;
  public columnDefs;
  public defaultColDef;
  public rowClassRules;
  public context;
  public frameworkComponents;

  rowData = [];

  stepsSubs: Subscription;

  auxActivityResult = new BehaviorSubject<any>(null);
  auxActivityResults = [];

  disableCheck = new BehaviorSubject<boolean>(true);

  auxCount = 1;
  showTop = false;
  auxFilterModel: any;

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
      onFilterChanged: (event: any) => {
        this.auxCount++;
        if (this.auxCount === 1) {
          event.eventPrevented();
        }
        if (this.showTop && this.auxCount === 2) {
          this.auxCount = 0;
          this.getDataTop();
        }
      },
      onSortChanged: (event: any) => {
        this.auxCount++;
        if (this.auxCount === 1) {
          event.eventPrevented();
        }
        if (this.showTop && this.auxCount === 2) {
          this.auxCount = 0;
          this.getDataTop();
        }
      },
      isExternalFilterPresent: () => true
    };

    this.columnDefs = [

      {headerName: 'extra', field: 'extra', filter: 'agSetColumnFilter'},
      {headerName: 'Profile ref.', field: 'profileReference', filter: 'agSetColumnFilter'},
      {
        headerName: 'Suitability Result',
        field: 'ruleResult',
        minWidth: 150,
        maxWidth: 150
      },
      {
        headerName: 'Prospectus Description',
        field: 'prospectusDescription'
      },
      {
        headerName: 'Activity Result',
        field: 'activityResult'
      },
      {headerName: 'Original ISIN', field: 'originalISIN', rowGroup: false},
      {headerName: 'Fund Name', field: 'fundName'},
      {
        headerName: 'Sort',
        field: 'calculated'
      },
      {headerName: 'ISIN', field: 'isin'},
      {headerName: 'Security Name', field: 'securityName'},
      {headerName: 'Currency', field: 'currency'},
      {
        headerName: 'Hedged',
        field: 'isHedged',
        valueGetter: params =>
          params.data && params.data.isHedged ? 'Yes' : 'No'
      },
      {
        headerName: 'Distributing',
        field: 'distributing',
        valueGetter: params =>
          params.data && params.data.distributing ? 'Yes' : 'No'
      },
      {
        headerName: 'Trailer Fee Based',
        field: 'trailerFeeBased'
      },
      {
        headerName: 'Ongoing Charges',
        field: 'ongoingCharges',
        filter: 'agNumberColumnFilter',
        cellRenderer: param =>
          param.value !== null && param.value !== undefined
            ? param.value.toFixed(4)
            : ''
      },
      {
        headerName: 'Ongoing Charges Corrected',
        filter: 'agNumberColumnFilter',
        field: 'ongoingChargesCorrected',
        cellRenderer: param =>
          param.value !== null && param.value !== undefined
            ? param.value.toFixed(4)
            : ''
      },
      {
        headerName: 'Min Investment',
        filter: 'minInvestmentFilter',
        menuTabs: ['filterMenuTab'],
        field: 'minInvestment',
        cellRenderer: param =>
          param.value !== null
            ? Math.round(param.value).toLocaleString('de-CH')
            : ''
      },
      {
        headerName: 'Registration Advisor Domicile',
        field: 'registrationAdvisorDomicile',
        valueGetter: params =>
          params.data && params.data.registrationAdvisorDomicile ? 'Yes' : 'No'
      },
      {
        headerName: 'Registration Client Domicile',
        field: 'registrationClientDomicile',
        valueGetter: params =>
          params.data && params.data.registrationClientDomicile ? 'Yes' : 'No'
      },
      {
        headerName: 'Traspaso',
        field: 'traspaso',
        valueGetter: params =>
          params.data && params.data.traspaso ? 'Yes' : 'No'
      }

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
    this.actionSubs.forEach(subs => subs.unsubscribe());
    this.stepsSubs ? this.stepsSubs.unsubscribe() : '';
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.setRowData(DATA);
  }

  load(){
    this.gridApi.setRowData([
      {
        id: 0,
        hash: "DC-5E-BB-AF-FB-B4-87-F8-65-25-56-B9-24-57-4B-AF",
        profileReference: "a",
        originalISIN: "LU1023058412",
        fundName: "BlackRock BGF - US Small & MidCap Opportunities",
        isin: "LU1023058412",
        securityName: "BlackRock BGF - US Small & MidCap Opportunities (A2 Hedged)",
        currency: "AUD",
        isHedged: true,
        distributing: false,
        ongoingCharges: 1.8315,
        ongoingChargesCorrected: null,
        minInvestment: 5000,
        registrationAdvisorDomicile: true,
        registrationClientDomicile: false,
        traspaso: true,
        trailerFeeBased: true,
        prospectusDescription:
          "Class A Shares are available to all investors as Distributing and Non-Distributing Shares and are issued in registered form and global certificate form. Unless otherwise requested, all Class A Shares will be issued as registered shares.",
        prospectusRestriction: {
          wasFulfilled: "Yes",
          restrictions: [],
          securityId: 62064
        },
        ruleResult: "Green",
        ruleResults: [
          {
            ruleResultCode: "ok",
            ruleResultText:
              "The share class meets the appropriate requirements (e.g. required distribution licenses, fund company conditions, etc.) for the selected customer profile.",
            ruleTypeId: null,
            ruleTypeCode: null,
            ruleGroup: "RG234",
            ruleSuitabilityOutcomeCode: "Green"
          }
        ],
        activityResult: "Forbidden",
        activityResults: [
          {
            code: "29-IT-1-1-1",
            text:
              "According to the Consob’s interpretation, the performance of receipt and trasmission of execution orders may suppose the provision of investment advice service in case of close relationship with the client.  transmission, by the intermediary of qualified information pertinent to the specific characteristics of the product or the financial instrument so as to easily integrate the release of specific and personalized advices which connote the provision of the consultancy services subject to authorization. The performance of services in “execution only” manners are permitted, but however limited to certain suppositions defined by Consob.\t",
            severity: "Forbidden"
          }
        ],
        originalShareclassOutcome: "Green",
        calculated: "Original",
        extra: 1
      }
    ]);
  }

  changeCheck() {
    this.gridApi.onFilterChanged();
  }

  private groupRuleTypes(detail) {
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
    if (this.showTop) {
      this.auxCount = 0;
      this.getDataTop();
    } else {
      this.gridApi.destroyFilter('extra');
    }
  }

  getDataTop() {
    this.auxFilterModel = this.gridApi.getFilterModel();

    this.rowData = this.rowData.map(r => r.extra === 2 ? ({...r, extra: 3}) : r);
    this.gridApi.setRowData(this.rowData);

    this.gridApi.setFilterModel(null);
    delete this.auxFilterModel.extra;
    this.gridApi.setFilterModel(this.auxFilterModel);

    let auxFiltered = [];
    this.gridApi.forEachNodeAfterFilterAndSort(n => auxFiltered.push(n.data));
    auxFiltered = auxFiltered.length > 0 ? auxFiltered : this.rowData;

    const auxAlternative = this.removeDuplicates(
      auxFiltered.filter(r => r ? r.calculated === 'Alternative' : false),
      'hash'
    ).map(r => r.id);

    this.rowData = this.rowData.map(r => auxAlternative.indexOf(r.id) > -1 ? ({...r, extra: 2}) : r);
    this.gridApi.setRowData(this.rowData);

    this.gridApi.setFilterModel({
      ...this.auxFilterModel,
      extra: {
        filterType: 'set',
        values: ['1', '2']
      }
    });
  }

}

