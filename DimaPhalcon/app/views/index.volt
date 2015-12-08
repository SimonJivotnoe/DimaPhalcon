<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>Дима</title>
    <link href="css/split-pane.css" rel="stylesheet" type="text/css"/>
    <link href="css/pretty-split-pane.css" rel="stylesheet" type="text/css"/>
    <link href="css/main.css" rel="stylesheet" type="text/css"/>
    <link href="css/jquery-ui.css" rel="stylesheet" type="text/css"/>
    <link href="js/jquery/colorpicker/dist/css/bootstrap-colorpicker.min.css" rel="stylesheet" type="text/css"/>
    <link rel="shortcut icon" type="image/x-icon" href="favicon.ico" />
    <!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">-->


</head>
<body>
<div id="menuOpen"><span class="glyphicon glyphicon-folder-close" aria-hidden="true"></span></div>
<div id="split-pane-1" class="split-pane fixed-left">
    <div class="split-pane-component" id="left-component">
        <div id="tabs">{{ tabs }}</div>
    </div>
    <div class="split-pane-divider" id="divider"></div>
    <div class="split-pane-component" id="right-component">
        <div id="tabsRight">{{ tabsRight }}</div>
    </div>
</div>

<div class="modal fade bs-example-modal-lg in" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" id="openMenuModal">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                <h3 class="modal-title" id="myLargeModalLabel">Файловый менеджер</h3>
            </div>
            <div class="modal-body">
                <div class="col-md-12">
                    <button class="btn btn-warning btn-sm" id="showItemFromFileManager" disabled>
                        <span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>
                    </button>
                </div>
                <div class="col-md-12">
                    <h4>
                        Продукты
                        <span class="glyphicon glyphicon-shopping-cart toCollapse" aria-hidden="true" data-toggle="collapse" data-target="#fileManagerProductsWrapper" aria-expanded="true" aria-controls="fileManagerProductsWrapper">
                    </span>
                    </h4>
                </div>
                <div id="fileManagerProductsWrapper" class="collapse in">
                    <div class="col-md-4 col-md-offset-2">
                        <form class="form-inline">
                            <div class="form-group">
                              <label for="fileManagerCatogoriesSelect">Категории: </label>
                              <select class="form-control input-sm" id="fileManagerCatogoriesSelect"></select>
                            </div>
                        </form>
                    </div>
                    <div class="col-md-4">
                        <input type="text" class="form-control" id="FMsearchInProducts" placeholder="Поиск">
                    </div>
                    <table class="table table-bordered">
                        <tbody id="fileManagerProductsTable">
                        </tbody>
                    </table>
                </div>
                <div class="col-md-12">
                    <h4>
                        Ордера
                        <span class="glyphicon glyphicon-tasks toCollapse" aria-hidden="true" data-toggle="collapse" data-target="#fileManagerOrdersWrapper" aria-expanded="true" aria-controls="fileManagerOrdersWrapper">
                    </span>
                    </h4>
                </div>
                <div id="fileManagerOrdersWrapper">
                    <div class="col-md-4">
                        <input type="text" class="form-control" id="FMsearchInOrders" placeholder="Поиск">
                    </div>
                    <div class="col-md-4">
                        <form class="form-inline">
                            <div class="form-group" data-section="FIO">
                              <label for="FMfioSelect">Вниманию(Ф.И.О.): </label>
                              <select class="form-control input-sm" id="FMfioSelect"></select>
                            </div>
                        </form>
                    </div>
                    <div class="col-md-4">
                        <form class="form-inline">
                            <div class="form-group" data-section="PROJECT_NAME">
                              <label for="FMprojectNameSelect">Название проэкта: </label>
                              <select class="form-control input-sm" id="FMprojectNameSelect"></select>
                            </div>
                        </form>
                    </div>
                    <div class="col-md-4">
                        <form class="form-inline">
                            <div class="form-group" data-section="APPEAL">
                              <label for="FMappealSelect">Обращение: </label>
                              <select class="form-control input-sm" id="FMappealSelect"></select>
                            </div>
                        </form>
                    </div>
                    <div class="col-md-4">
                        <form class="form-inline">
                            <div class="form-group" data-section="PROJECT_DESCR">
                              <label for="FMprojectDescrSelect">Описание проэкта: </label>
                              <select class="form-control input-sm" id="FMprojectDescrSelect"></select>
                            </div>
                        </form>
                    </div>
                    <div class="col-md-4">
                        <form class="form-inline">
                            <div class="form-group" data-section="COMPANY_NAME">
                              <label for="FMcompanyNameSelect">Название компании: </label>
                              <select class="form-control input-sm" id="FMcompanyNameSelect"></select>
                            </div>
                        </form>
                    </div>
                    <div class="col-md-4">
                        <form class="form-inline">
                            <div class="form-group" data-section="ORDER_NAME">
                              <label for="FMorderNumberSelect">Номер заказа: </label>
                              <select class="form-control input-sm" id="FMorderNumberSelect"></select>
                            </div>
                        </form>
                    </div>
                    <div class="col-md-4">
                        <form class="form-inline">
                            <div class="form-group" data-section="ADDRES">
                              <label for="FMadressSelect">Почтовый адрес: </label>
                              <select class="form-control input-sm" id="FMadressSelect"></select>
                            </div>
                        </form>
                    </div>
                    <div class="col-md-4">
                        <form class="form-inline">
                            <div class="form-group" data-section="ACC_NUMBER">
                              <label for="FMaccNumberSelect">Номер счета: </label>
                              <select class="form-control input-sm" id="FMaccNumberSelect"></select>
                            </div>
                        </form>
                    </div>
                    <div class="col-md-4">
                        <form class="form-inline">
                            <div class="form-group" data-section="CITY">
                              <label for="FMcitySelect">Город: </label>
                              <select class="form-control input-sm" id="FMcitySelect"></select>
                            </div>
                        </form>
                    </div>
                    <div class="col-md-4">
                        <form class="form-inline">
                            <div class="form-group" data-section="ESTIMATE">
                              <label for="estimate">Срок: </label>
                              <select class="form-control input-sm" id="FMestimateSelect"></select>
                            </div>
                        </form>
                    </div>
                    <div class="col-md-4">
                        <form class="form-inline">
                            <div class="form-group" data-section="DATE">
                              <label for="FMdateSelect">Дата: </label>
                              <select class="form-control input-sm" id="FMdateSelect"></select>
                            </div>
                        </form>
                    </div>
                    <table class="table table-bordered">
                        <tbody id="fileManagerOrdersTable">
                        </tbody>
                    </table>
                </div>
                <div class="clearer"></div>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div>
<script src="js/jquery/jquery-1.11.2.min.js"></script>
<script src="js/jquery/jquery-ui.js"></script>
<script src="js/jquery/underscore.js"></script>
<script src="js/jquery/less.min.js"></script>
<!-- Latest compiled and minified CSS -->
<!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">-->
<link rel="stylesheet" href="css/bootstrap/bootstrap.min.css">
<link rel="stylesheet" href="css/bootstrap/bootstrap-table.css">

<!-- Optional theme -->
<!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap-theme.min.css">-->
<link rel="stylesheet" href="libs/bootstrap/css/bootstrap-theme.min.css">
<link rel="stylesheet" href="css/font-awesome.css">
<!-- Latest compiled and minified JavaScript -->
<!--<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>-->
<script src="js/bootstrap/bootstrap.min.js"></script>
<script src="js/bootstrap/bootstrap-table.js"></script>
<!--<script src="http://code.jquery.com/jquery-1.11.2.min.js"></script>-->
<script src="js/jquery/js/jquery.flot.min.js"></script>
<script src="js/jquery/js/flot_plugin/jquery.flot.pie.js"></script>
<script src="js/jquery/js/flot_plugin/jquery.flot.categories.js"></script>
<script src="js/jquery/js/numeral.min.js"></script>
<script src="js/jquery/js/moment.min.js"></script>
<script src="js/jquery/js/jstat.min.js"></script>
<script src="js/jquery/jquery-calx-2.2.1.js"></script>
<script src="js/jquery/main.js"></script>
<script src="js/jquery/Dima.js"></script>
<script src="js/jquery/jquery.caret.js"></script>
<script src="js/jquery/split-pane.js"></script>
<script src="js/jquery/jquery.mousewheel.js"></script>
<script src="js/jquery/bootstrap-confirmation.js"></script>
<script src='js/jquery/pdfmake/pdfmake.min.js'></script>
<script src='js/jquery/pdfmake/vfs_fonts.js'></script>
<script src='js/jquery/store+json2.min.js'></script>
<script src="js/jquery/jquery.resizableColumns.min.js"></script>
<script src="js/jquery/jquery.fontselect.min.js"></script>
<script src="js/jquery/colorpicker/dist/js/bootstrap-colorpicker.min.js"></script>
</body>
</html>