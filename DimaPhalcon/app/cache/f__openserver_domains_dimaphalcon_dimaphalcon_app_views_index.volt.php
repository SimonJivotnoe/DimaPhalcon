<!DOCTYPE html>
<html>
  <head lang="en">
    <meta http-equiv="content-type" content="text/html;charset=utf-8">
    <title>Дима</title>
    <?php echo $css; ?>
    <link rel="shortcut icon" type="image/x-icon" href="favicon.ico">
    <?php echo $templates; ?>
  </head>
  <body>
    <div id="waitSpinner"></div>
    <div id="kimSpinner"></div>
    <div id="leftTabsSpinner"></div>
    <div id="startPageWrapper">
      <div>
        <!--<div id="runPreferences" class="col-md-6 mainMenuIcon hvr-float-shadow btn-primary"><span aria-hidden="true" class="glyphicon glyphicon-cog"></span>
          <h4>Найстройки</h4>
        </div>-->
        <div id="runDB" class="mainMenuIcon hvr-float-shadow btn-warning"><span aria-hidden="true" class="glyphicon glyphicon-folder-open"></span>
          <h4>База Данных</h4>
        </div>
        <div id="runPR" class="mainMenuIcon hvr-float-shadow btn-success"><span aria-hidden="true" class="glyphicon glyphicon-check"></span>
          <h4>Создать заказ</h4>
        </div>
      </div>
    </div>
    <nav id="topIconsWrapper" style="min-height: 46px;" class="navbar navbar-default navbar-fixed-top">
      <div style="margin-top: 4px;" class="container">
        <div id="menuIconsTop" class="col-md-12">
          <?php echo $mainIcons; ?>
          <?php echo $kimIcons; ?>
          <?php echo $productTreeDBIcons; ?>
          <div class="clearer"></div>
        </div>
      </div>
    </nav>
    <div id="sectionContent"></div>
    <div id="outBodyElements"></div>
    <div id="backLayout" class="clearer"></div>
    <div id="tabsLiLayout" class="clearer"></div>
    <?php echo $dbModals; ?>
    <div class="appSpinner"></div>
    <?php echo $js; ?>
  </body>
</html>