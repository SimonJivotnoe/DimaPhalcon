<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>Start</title>
    <link href="css/split-pane.css" rel="stylesheet" type="text/css"/>
    <link href="css/pretty-split-pane.css" rel="stylesheet" type="text/css"/>
    <link href="css/main.css" rel="stylesheet" type="text/css"/>

</head>
<body>
<div id="split-pane-1" class="split-pane fixed-left">
    <div class="split-pane-component" id="left-component">
        <div id="tabs"><?php echo $tabs; ?></div>

    </div>
    <div class="split-pane-divider" id="divider"></div>
    <div class="split-pane-component" id="right-component">
        This is the right component
    </div>
</div>
<script src="js/jquery/jquery-1.11.2.min.js"></script>
<!-- Latest compiled and minified CSS -->
<!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">-->
<link rel="stylesheet" href="libs/bootstrap/css/bootstrap.min.css">

<!-- Optional theme -->
<!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap-theme.min.css">-->
<link rel="stylesheet" href="libs/bootstrap/css/bootstrap-theme.min.css">

<!-- Latest compiled and minified JavaScript -->
<!--<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>-->
<script src="libs/bootstrap/js/bootstrap.min.js"></script>
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
<script src="js/jquery/jquery.tabletojson.js"></script>
<script src="js/jquery/jquery.caret.js"></script>
<script src="js/jquery/split-pane.js"></script>
</body>
</html>