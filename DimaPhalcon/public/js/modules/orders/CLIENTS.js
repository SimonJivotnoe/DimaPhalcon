
define(['jq', 'methods', 'URLs', 'mustache', 'VALIDATION'], function ($jq, methods, URLs, Mustache, VALIDATION) {var

    CLIENTS = {
        handler: function () {
            $('#hideShowClietsTree').click(function() {
                methods.toggleTreeDisplay('.totalClientsTreeWrapper', '#hideShowClietsTree');
            });
        }
    };

    return CLIENTS;
});