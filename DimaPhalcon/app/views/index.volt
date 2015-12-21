<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>Дима</title>
    <link href="css/split-pane.css" rel="stylesheet" type="text/css"/>
    <link href="css/pretty-split-pane.css" rel="stylesheet" type="text/css"/>
    <link href="css/main.css" rel="stylesheet" type="text/css"/>
    <link href="css/jquery-ui.css" rel="stylesheet" type="text/css"/>
    <link href="css/hover-min.css" rel="stylesheet" type="text/css"/>
    <link href="js/jquery/colorpicker/dist/css/bootstrap-colorpicker.min.css" rel="stylesheet" type="text/css"/>
    <link rel="shortcut icon" type="image/x-icon" href="favicon.ico" />
    <!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">-->


</head>
<body>
    <div id="waitSpinner"></div>
    <div class="col-md-12" id="mainMenuWrapper">
        <div class="col-md-8 col-md-offset-4" style="margin-top: 25%;">
            <div class="col-md-6 mainMenuIcon hvr-float-shadow btn-primary" id="runPreferences">
                <span class="glyphicon glyphicon-cog" aria-hidden="true"></span>
                <h4>Найстройки</h4>
            </div>
            <div class="col-md-6 mainMenuIcon hvr-float-shadow btn-warning" id="runDB">
                <span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span>
                <h4>База Данных</h4>
            </div>
        </div>
        <div class="col-md-8 col-md-offset-4" style="margin-top: 5px;">
            <div class="col-md-6 mainMenuIcon hvr-float-shadow btn-info" id="runFM">
                <span class="glyphicon glyphicon-duplicate" aria-hidden="true"></span>
                <h4>Файловый Менеджер</h4>
            </div>
            <div class="col-md-6 mainMenuIcon hvr-float-shadow btn-success" id="runPR">
                <span class="glyphicon glyphicon-check" aria-hidden="true"></span>
                <h4>Создать заказ</h4>
            </div>
        </div>
    </div>
    <div id="menuIconsTop">
        <div id="backIcon"><span class="glyphicon glyphicon-th-large" aria-hidden="true"></span></div>
        <div id="prefIcon"><span class="glyphicon glyphicon-cog" aria-hidden="true"></span></div>
        <div id="dbIcon"><span class="glyphicon glyphicon-folder-close" aria-hidden="true"></span></div>
        <div id="menuOpen"><span class="glyphicon glyphicon-duplicate" aria-hidden="true"></span></div>
       <!-- <div id="prIcon"><span class="glyphicon glyphicon-folder-close" aria-hidden="true"></span></div>-->
        <div class="clearer"></div>
    </div>
        <div id="split-pane-1" class="split-pane fixed-left">
            <div class="split-pane-component" id="left-component">
                <div id="tabs">
                    <div id="leftTabsSpinner"></div>
                    {{ tabs }}
                </div>
            </div>
            <div class="split-pane-divider" id="divider"></div>
            <div class="split-pane-component" id="right-component">
                <div id="tabsRight">
                    <div id="rightTabsSpinner"></div>
                    {{ tabsRight }}
                </div>
            </div>
        </div>
    <div id="creatingProductsWrapper">
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
                    <button class="btn btn-info btn-sm" id="FMconsolidatedOrdersBtn" disabled>
                        <span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span>
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
                <div id="fileManagerOrdersWrapper" class="collapse in">
                    <table border="0">
                        <tr>
                            <td colspan="2">
                                <input type="text" class="form-control" id="FMsearchInOrders" placeholder="Поиск">
                            </td>
                            <td> Вниманию(Ф.И.О.): </td>
                            <td><select class="form-control input-sm FMorderFilter" id="FMfioSelect" data-section="FIO"></select></td>
                            <td> Название проэкта: </td>
                            <td><select class="form-control input-sm FMorderFilter" id="FMprojectNameSelect" data-section="PROJECT_NAME"></select></td>
                        </tr>
                        <tr>
                            <td> Обращение: </td>
                            <td><select class="form-control input-sm FMorderFilter" id="FMappealSelect" data-section="APPEAL"></select></td>
                            <td> Описание проэкта: </td>
                            <td><select class="form-control input-sm FMorderFilter" id="FMprojectDescrSelect" data-section="PROJECT_DESCR"></select></td>
                            <td> Название компании: </td>
                            <td><select class="form-control input-sm FMorderFilter" id="FMcompanyNameSelect" data-section="COMPANY_NAME"></select></td>
                        </tr>
                        <tr>
                            <td>Номер заказа:</td>
                            <td><select class="form-control input-sm FMorderFilter" id="FMorderNumberSelect" data-section="ORDER_NAME"></select></td>
                            <td>Почтовый адрес:</td>
                            <td><select class="form-control input-sm FMorderFilter" id="FMadressSelect" data-section="ADDRES"></select></td>
                            <td>Номер счета:</td>
                            <td><select class="form-control input-sm FMorderFilter" id="FMaccNumberSelect" data-section="ACC_NUMBER"></select></td>
                        </tr>
                        <tr>
                            <td>Город:</td>
                            <td><select class="form-control input-sm FMorderFilter" id="FMcitySelect" data-section="CITY"></select></td>
                            <td>Срок:</td>
                            <td><select class="form-control input-sm FMorderFilter" id="FMestimateSelect" data-section="ESTIMATE"></select></td>
                            <td>Дата:</td>
                            <td><select class="form-control input-sm FMorderFilter" id="FMdateSelect" data-section="DATE"></select></td>
                        </tr>
                    </table>
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
<script src="js/jquery/spin.min.js"></script>
</body>
</html>