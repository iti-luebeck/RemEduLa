
// tslint:disable: quotemark
export const configGoldenLayout : GoldenLayout.LayoutConfig = {
    settings: {
        showPopoutIcon: false,
        showMaximiseIcon: false,
        showCloseIcon: false,
        selectionEnabled: true
    },
    dimensions: {
        minItemHeight: 100,
        minItemWidth: 100,
        headerHeight: 24
    },
    content: [{
        type: 'column',
        content: [
            {
                type: 'row',
                content: [
                    {
                        type: 'component',
                        componentName: 'ModulesComponent',
                        isClosable: false,
                        title: 'Modules'
                    },
                    {
                        type: 'component',
                        componentName: 'CameraComponent',
                        width: 30,
                        isClosable: false,
                        title: 'Camera'
                    }
                ]
            },
            {
                type: 'component',
                componentName: 'ConsoleComponent',
                height: 30,
                isClosable: false,
                title: 'Console Log'
            }
        ]
    }]
} as GoldenLayout.LayoutConfig;
// tslint:enable: quotemark
