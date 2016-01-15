<!DOCTYPE html>
<html>
<head lang="en">
    <meta http-equiv="content-type" content="text/html;charset=utf-8" />
    <title>Дима</title>
    <?php echo $this->assets->outputCss('styleHead'); ?>
    <link rel="stylesheet" href="css/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="css/libs/animate.css">
    <link rel="stylesheet" href="css/libs/notifcenter.css">
    <link href="js/jquery/colorpicker/dist/css/bootstrap-colorpicker.min.css" rel="stylesheet" type="text/css"/>
    <link rel="shortcut icon" type="image/x-icon" href="favicon.ico" />
</head>
<body>
    <div id="waitSpinner"></div>
    <div class="col-md-12" id="mainMenuWrapper">
        <div class="col-md-9 col-md-offset-3" style="margin-top: 18%;">
            <div class="col-md-6 mainMenuIcon hvr-float-shadow btn-primary" id="runPreferences">
                <span class="glyphicon glyphicon-cog" aria-hidden="true"></span>
                <h4>Найстройки</h4>
            </div>
            <div class="col-md-6 mainMenuIcon hvr-float-shadow btn-warning" id="runDB">
                <span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span>
                <h4>База Данных</h4>
            </div>
            <div class="col-md-6 mainMenuIcon hvr-float-shadow btn-success" id="runPR">
                <span class="glyphicon glyphicon-check" aria-hidden="true"></span>
                <h4>Создать заказ</h4>
            </div>
        </div>
    </div>
    <nav class="navbar navbar-default navbar-fixed-top" id="topIconsWrapper" style="min-height: 46px;">
        <div class="container" style="margin-top: 4px;">
            <div id="menuIconsTop" class="col-md-12">
                <form class="form-inline">
                    <div class="form-group hvr-pulse-grow" id="backIcon">
                        <span class="glyphicon glyphicon-th-large centerIcon" aria-hidden="true"></span>
                    </div>
                    <div class="form-group hvr-pulse-grow" id="prefIcon">
                        <span class="glyphicon glyphicon-cog centerIcon" aria-hidden="true"></span>
                    </div>
                    <div class="form-group hvr-pulse-grow" id="dbIcon">
                        <span class="glyphicon glyphicon-folder-close centerIcon" aria-hidden="true"></span>
                    </div>
                    <div class="form-group hvr-pulse-grow" id="prIcon">
                        <span class="glyphicon glyphicon-check centerIcon" aria-hidden="true"></span>
                    </div>
                </form>
                <div class="clearer"></div>
            </div>
        </div>
    </nav>
    <div id="sectionContent"></div>
    <script src="js/jquery/jquery-1.11.2.min.js"></script>
    <script src="js/jquery/jquery-ui.min.js"></script>
    <link rel="stylesheet" href="css/bootstrap/bootstrap-table.css">
    <link rel="stylesheet" href="libs/bootstrap/css/bootstrap-theme.min.css">
    <link rel="stylesheet" href="css/font-awesome.css">
    <script src="js/bootstrap/bootstrap.min.js"></script>
    <script src="js/bootstrap/bootstrap-table.js"></script>
    <!--
     ?

     ?
     -->
    <script src="js/jquery/js/numeral.min.js"></script>
    <script src="js/jquery/jquery-calx-2.2.3.min.js"></script>
    <script src="js/jquery/jquery.caret.js"></script>
    <script src="js/jquery/jquery.mousewheel.js"></script>
    <script src="js/jquery/bootstrap-confirmation.js"></script>
    <script src='js/jquery/pdfmake/pdfmake.min.js'></script>
    <script src='js/jquery/pdfmake/vfs_fonts.js'></script>
    <script src='js/jquery/store+json2.min.js'></script>
    <script src="js/jquery/jquery.resizableColumns.min.js"></script>
    <script src="js/jquery/colorpicker/dist/js/bootstrap-colorpicker.min.js"></script>
    <script src="js/jquery/spin.min.js"></script>
    <script src="js/jquery/tree.jquery.js"></script>
    <script src="js/Dima.js"></script>
    <script src="js/main.js"></script>
    <?php echo $this->assets->outputJs('jsFooter'); ?>
    <script src="js/libs/jquery.noty.packaged.min.js"></script>
    <script src="js/libs/jquery.notificationcenter.js"></script>
</body>
</html>
