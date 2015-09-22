<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>Дима</title>
    <link href="css/split-pane.css" rel="stylesheet" type="text/css"/>
    <link href="css/pretty-split-pane.css" rel="stylesheet" type="text/css"/>
    <link href="css/main.css" rel="stylesheet" type="text/css"/>
    <link href="css/jquery-ui.css" rel="stylesheet" type="text/css"/>
    <!--<link rel="shortcut icon" href="favicon.ico" />-->
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
                <h4 class="modal-title" id="myLargeModalLabel">Файловый менеджер</h4>
            </div>
            <div class="modal-body">
                ...
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
<!--<script src="js/jquery/ajaxEvents.js"></script>-->
<!--<script src="js/jquery/functions.js"></script>-->
<script src="js/jquery/jquery.caret.js"></script>
<script src="js/jquery/split-pane.js"></script>
<script src="js/jquery/jquery.mousewheel.js"></script>
<script src="js/jquery/bootstrap-confirmation.js"></script>
</body>
</html>