<!DOCTYPE html>
<html>
  <head lang="en">
    <meta http-equiv="content-type" content="text/html;charset=utf-8">
    <title>Дима</title>
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/libs/jqtree.css">
    <link rel="stylesheet" href="css/libs/split-pane.css">
    <link rel="stylesheet" href="css/libs/pretty-split-pane.css">
    <link rel="stylesheet" href="css/libs/jquery-ui.min.css">
    <link rel="stylesheet" href="css/libs/hover-min.min.css">
    <link rel="stylesheet" href="css/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="css/libs/animate.css">
    <link rel="stylesheet" href="css/libs/notifcenter.css">
    <link rel="stylesheet" href="js/jquery/colorpicker/dist/css/bootstrap-colorpicker.min.css">
    <link rel="shortcut icon" type="image/x-icon" href="favicon.ico"><?php echo $templates; ?>
  </head>
  <body>
    <div id="waitSpinner"></div>
    <div id="kimSpinner"></div>
    <div id="leftTabsSpinner"></div>
    <div id="mainMenuWrapper" class="col-md-12">
      <div style="margin-top: 18%;" class="col-md-9 col-md-offset-3">
        <div id="runPreferences" class="col-md-6 mainMenuIcon hvr-float-shadow btn-primary"><span aria-hidden="true" class="glyphicon glyphicon-cog"></span>
          <h4>Найстройки</h4>
        </div>
        <div id="runDB" class="col-md-6 mainMenuIcon hvr-float-shadow btn-warning"><span aria-hidden="true" class="glyphicon glyphicon-folder-open"></span>
          <h4>База Данных</h4>
        </div>
        <div id="runPR" class="col-md-6 mainMenuIcon hvr-float-shadow btn-success"><span aria-hidden="true" class="glyphicon glyphicon-check"></span>
          <h4>Создать заказ</h4>
        </div>
      </div>
    </div>
    <nav id="topIconsWrapper" style="min-height: 46px;" class="navbar navbar-default navbar-fixed-top">
      <div style="margin-top: 4px;" class="container">
        <div id="menuIconsTop" class="col-md-12">
          <form id="mainIcons" class="form-inline">
            <div id="backIcon" class="form-group hvr-pulse-grow defaultIcon"><span aria-hidden="true" class="glyphicon glyphicon-th-large centerIcon"></span></div>
            <div id="prefIcon" class="form-group hvr-pulse-grow defaultIcon"><span aria-hidden="true" class="glyphicon glyphicon-cog centerIcon"></span></div>
            <div id="dbIcon" class="form-group hvr-pulse-grow defaultIcon"><span aria-hidden="true" class="glyphicon glyphicon-folder-close centerIcon"></span></div>
            <div id="prIcon" class="form-group hvr-pulse-grow defaultIcon"><span aria-hidden="true" class="glyphicon glyphicon-check centerIcon"></span></div>
          </form>
          <form id="kimIcons" class="form-inline">
            <div id="addKimIcon" class="form-group hvr-pulse-grow defaultIcon"><span aria-hidden="true" class="glyphicon glyphicon-plus centerIcon"></span></div>
            <div id="editKimIcon" class="form-group hvr-pulse-grow defaultIcon"><span aria-hidden="true" class="glyphicon glyphicon-pencil centerIcon"></span></div>
            <div id="deleteKimIcon" class="form-group hvr-pulse-grow defaultIcon"><span aria-hidden="true" class="glyphicon glyphicon-minus centerIcon"></span></div>
            <div id="backKimIcon" class="form-group defaultIcon"><span aria-hidden="true" class="glyphicon glyphicon-share-alt centerIcon"></span></div>
          </form>
          <div class="clearer"></div>
        </div>
      </div>
    </nav>
    <div id="sectionContent"></div>
    <div id="outBodyElements"></div>
    <div id="backLayout" class="clearer"></div>
    <!-- MODALS-->
    <div id="addNewCategoryModal" tabindex="-1" role="dialog" aria-labelledby="addNewCategoryModal" class="modal fade">
      <div role="document" class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header addNewModalHeader modalFooterAdd">
            <button type="button" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true">×</span></button>
            <h4 id="myModalLabel" class="modal-title">Добавить Категорию</h4>
          </div>
          <div class="modal-header editModalHeader modalFooterEdit">
            <button type="button" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true">×</span></button>
            <h4 id="myModalLabel" class="modal-title">Редактировать Категорию</h4>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="addCategoryInput" class="control-label">Имя категории:</label>
                <input id="addCategoryInput" type="text" class="form-control">
              </div>
              <div class="form-group">
                <label for="addCategoryArticleInput" class="control-label modalFooterAdd">Артикул:</label>
                <input id="addCategoryArticleInput" type="text" class="form-control modalFooterAdd">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <div class="modalFooterAdd">
              <button type="button" data-dismiss="modal" class="btn btn-default">Отмена</button>
              <button id="addCategoryBtn" type="button" class="btn btn-success">Добавить</button>
            </div>
            <div style="display: none;" class="modalFooterEdit">
              <button type="button" data-dismiss="modal" class="btn btn-default">Отмена</button>
              <button id="editCategoryBtn" type="button" class="btn btn-primary">Сохранить</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <script src="js/jquery/jquery-1.11.2.min.js"></script>
    <script src="js/jquery/jquery-ui.min.js"></script>
    <link rel="stylesheet" href="css/bootstrap/bootstrap-table.css">
    <link rel="stylesheet" href="libs/bootstrap/css/bootstrap-theme.min.css">
    <link rel="stylesheet" href="css/font-awesome.css">
    <script src="js/bootstrap/bootstrap.min.js"></script>
    <script src="js/bootstrap/bootstrap-table.js"></script>
    <script src="js/jquery/js/numeral.min.js"></script>
    <script src="js/jquery/jquery-calx-2.2.3.min.js"></script>
    <script src="js/jquery/jquery.caret.js"></script>
    <script src="js/jquery/jquery.mousewheel.js"></script>
    <script src="js/jquery/bootstrap-confirmation.js"></script>
    <script src="js/jquery/pdfmake/pdfmake.min.js"></script>
    <script src="js/jquery/pdfmake/vfs_fonts.js"></script>
    <script src="js/jquery/store+json2.min.js"></script>
    <script src="js/jquery/jquery.resizableColumns.min.js"></script>
    <script src="js/jquery/colorpicker/dist/js/bootstrap-colorpicker.min.js"></script>
    <script src="js/jquery/spin.min.js"></script>
    <script src="js/jquery/tree.jquery.js"></script>
    <script src="js/libs/focus-element-overlay.min.js"></script>
    <script src="js/libs/mustache.min.js"></script><?php echo $this->assets->outputJs('jsFooter'); ?>
    <script src="js/libs/jquery.noty.packaged.min.js"></script>
    <script src="js/libs/jquery.notificationcenter.js"></script>
  </body>
</html>