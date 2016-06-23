define(['jq', 'methods', 'URLs', 'mustache'], function ($jq, methods, URLs, Mustache) {
    var removeRow = function () {
        var $this = $(this),
            rowName = $this.parent().find('.rowValueInput').attr('data-cell'),
            checkBinding = $('.list-group-item').find('.glyphicon:contains(' + rowName + ')');
        if (checkBinding.length) { checkBinding.remove();}
        $this.parent().hide('drop');
        $this.parent()
            .find('.rowNumber').text('').end()
            .find('.rowValueInput').attr('data-cell', '');
        setTimeout(function () {
            $this.parent().remove();
        }, 500);
    }
    var newProductHandler = function () {
        $jq.productTableWrapper.on('click', '.removeRow', removeRow);
    }

    return newProductHandler;
});
