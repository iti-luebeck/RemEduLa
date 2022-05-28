
declare const bootbox: any;

export function showConnectionErrorDialog() {
    bootbox.hideAll();
    bootbox.dialog({
        message:
        '<p class="mb-0">Connection to the server was closed with an error.<br/>' +
        'Check if the application is still running and refresh this page.<br/>' +
        '</p>',
        // 'Error:<br/>' +
        // reason,
        closeButton: false
    });
}

export function showConnectionClosedDialog() {
    bootbox.hideAll();
    bootbox.dialog({
        message:
            '<p class="mb-0">Connection to the server was closed.<br/>' +
            'Check if the application is still running and refresh this page.<br/>' +
            '</p>',
            // 'Reason:<br/>' +
            // reason,
        closeButton: false
    });
}
    

export function showConnectedDialog(init: (dialog: any) => void) {
    const dialog = bootbox.dialog({
        title: 'Select one of the following boards',
        message: '<p><i class="fa fa-spin fa-spinner"></i> Loading...</p>',
        closeButton: false,
        onEscape: false
    });

    dialog.init(function () {
        init(dialog);
    });
}
