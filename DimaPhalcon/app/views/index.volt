<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>Start</title>
    <link href="css/split-pane.css" rel="stylesheet" type="text/css"/>
    <link href="css/pretty-split-pane.css" rel="stylesheet" type="text/css"/>
    <link href="css/main.css" rel="stylesheet" type="text/css"/>
    <link href="css/jquery-ui.css" rel="stylesheet" type="text/css"/>
   <!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">-->


</head>
<body>
<div id="split-pane-1" class="split-pane fixed-left">
    <div class="split-pane-component" id="left-component">
        <div id="tabs">{{ tabs }}</div>

    </div>
    <div class="split-pane-divider" id="divider"></div>
    <div class="split-pane-component" id="right-component">
        This is the right component
        <div class="col-md-8">
            <table class="table table-bordered">
                <tbody>
                <tr>
                    <th>№</th>
                    <th>Артикул</th>
                    <th>Наименование</th>
                    <th>Ед. измерения</th>
                    <th>Кол-во</th>
                    <th>Цена входящая</th>
                    <th>Сумма входящая</th>
                    <th>Цена</th>
                    <th>Сумма</th>
                </tr>
                <tr>
                    <th colspan="9" id="colspan">Раздел 1</th>
                </tr>
                <tr>
                    <td>1</td>
                    <td>В-ОЦ-У-0001</td>
                    <td>Утка из оц. Стали 0.55 300х200 h=100 a=100</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                </tbody>
            </table>
        </div>

    </div>
</div>
<script src="js/jquery/jquery-1.11.2.min.js"></script>
<script src="js/jquery/jquery-ui.js"></script>
<script src="js/jquery/underscore.js"></script>
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
<script src="js/jquery/ajaxEvents.js"></script>
<script src="js/jquery/functions.js"></script>
<script src="js/jquery/jquery.tabletojson.js"></script>
<script src="js/jquery/jquery.caret.js"></script>
<script src="js/jquery/split-pane.js"></script>
<script src="js/jquery/jquery.mousewheel.js"></script>

</body>
</html>