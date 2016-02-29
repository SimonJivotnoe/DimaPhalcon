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
          <?php echo $mainIcons; ?>
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
    <div class="modal fade" id="addNewCategoryModal" tabindex="-1" role="dialog" aria-labelledby="addNewCategoryModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header addNewModalHeader modalFooterAdd">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Добавить Категорию</h4>
                </div>
                <div class="modal-header editModalHeader modalFooterEdit">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Редактировать Категорию</h4>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label for="addCategoryInput" class="control-label">Имя категории:</label>
                            <input type="text" class="form-control" id="addCategoryInput">
                        </div>
                        <div class="form-group">
                            <label for="addCategoryArticleInput" class="control-label modalFooterAdd">Артикул:</label>
                            <input type="text" class="form-control modalFooterAdd" id="addCategoryArticleInput">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <div class="modalFooterAdd">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Отмена</button>
                        <button type="button" class="btn btn-success" id="addCategoryBtn">Добавить</button>
                    </div>
                    <div class="modalFooterEdit" style="display: none;">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Отмена</button>
                        <button type="button" class="btn btn-primary" id="editCategoryBtn">Сохранить</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="addNewKimModal" tabindex="-1" role="dialog" aria-labelledby="addNewKimModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header addNewModalHeader modalFooterAdd">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Добавить Ким</h4>
                </div>
                <div class="modal-header editModalHeader modalFooterEdit">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Редактировать Ким</h4>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label for="addCategoryInput" class="control-label">Сложность изделия:</label>
                            <input type="text" class="form-control" id="kimHardInput">
                        </div>
                        <div class="form-group">
                            <label for="addCategoryArticleInput" class="control-label">Ким:</label>
                            <input class="form-control" id="kimInput" type="number" step="0.1" min="0.1">
                        </div>
                        <div class="form-group">
                            <label for="addCategoryArticleInput" class="control-label">Описание:</label>
                            <input type="text" class="form-control" id="kimDescrInput">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <div class="modalFooterAdd">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Отмена</button>
                        <button type="button" class="btn btn-success" id="addKIMBtn">Добавить</button>
                    </div>
                    <div class="modalFooterEdit" style="display: none;">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Отмена</button>
                        <button type="button" class="btn btn-primary" id="editKimBtn">Сохранить</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php echo $js; ?>
  </body>
</html>