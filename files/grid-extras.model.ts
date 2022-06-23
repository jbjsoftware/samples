export class GridExtras {

    getSideBar() {
        return {
            toolPanels: [
                {
                    id: 'columns',
                    labelDefault: 'Columns',
                    labelKey: 'columns',
                    iconKey: 'columns',
                    toolPanel: 'agColumnsToolPanel',
                    toolPanelParams: {
                        suppressRowGroups: true,
                        suppressValues: true,
                        suppressPivotMode: true
                    }
                },
                // {
                //     id: 'filters',
                //     labelDefault: 'Filters',
                //     labelKey: 'filters',
                //     iconKey: 'filter',
                //     toolPanel: 'agFiltersToolPanel'
                // }
            ]
        }
    }
}