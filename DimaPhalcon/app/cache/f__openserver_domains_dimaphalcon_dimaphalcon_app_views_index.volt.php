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
    <div id="startPageWrapper" class="col-md-12">
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

    <div class="modal fade" id="addNewCategoryModal" tabindex="-1" role="dialog" aria-labelledby="addNewCategoryModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header addNewModalHeader modalFooterAdd">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Добавить Категорию</h4>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label for="addCategoryInput" class="control-label">Имя категории:</label>
                            <input type="text" class="form-control" id="addCategoryInput">
                        </div>
                        <div class="form-group">
                            <label for="addCategoryArticleInput" class="control-label">Артикул:</label>
                            <input type="text" class="form-control" id="addCategoryArticleInput">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <div>
                        <button type="button" class="btn btn-default" data-dismiss="modal">Отмена</button>
                        <button type="button" class="btn btn-success" id="addCategoryBtn">Добавить</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="editCategoryModal" tabindex="-1" role="dialog" aria-labelledby="editCategoryModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header editModalHeader">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Редактировать Категорию</h4>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label for="addCategoryInput" class="control-label">Имя категории:</label>
                            <input type="text" class="form-control" id="editCategoryInput">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <div class="modalFooterEdit">
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
                <div class="modal-header addNewModalHeader">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Добавить Ким</h4>
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
                    <div>
                        <button type="button" class="btn btn-default" data-dismiss="modal">Отмена</button>
                        <button type="button" class="btn btn-success" id="addKIMBtn">Добавить</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="editKimModal" tabindex="-1" role="dialog" aria-labelledby="editKimModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header editModalHeader">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Редактировать Ким</h4>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label for="addCategoryInput" class="control-label">Сложность изделия:</label>
                            <input type="text" class="form-control" id="editKimHardInput">
                        </div>
                        <div class="form-group">
                            <label for="addCategoryArticleInput" class="control-label">Ким:</label>
                            <input class="form-control" id="editKimInput" type="number" step="0.1" min="0.1">
                        </div>
                        <div class="form-group">
                            <label for="addCategoryArticleInput" class="control-label">Описание:</label>
                            <input type="text" class="form-control" id="editKimDescrInput">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <div class="modalFooterEdit">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Отмена</button>
                        <button type="button" class="btn btn-primary" id="editKimBtn">Сохранить</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="modal fade" id="addNewMetallModal" tabindex="-1" role="dialog" aria-labelledby="addNewMetallModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header addNewModalHeader">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Добавить Металл</h4>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label for="addCategoryInput" class="control-label">Металл:</label>
                            <input type="text" class="form-control" id="metallNameInput">
                        </div>
                        <div class="form-group">
                            <label for="addCategoryArticleInput" class="control-label">Цена Входящая:</label>
                            <input class="form-control" id="metallPriceInput" type="number">
                        </div>
                        <div class="form-group">
                            <label for="addCategoryArticleInput" class="control-label">Масса:</label>
                            <input type="number" class="form-control" id="metallMassInput">
                        </div>
                        <div class="form-group">
                            <label for="addCategoryArticleInput" class="control-label">Цена Исходящая:</label>
                            <input type="number" class="form-control" id="metallOutPriceInput">
                        </div>
                        <div class="form-group">
                            <label for="addCategoryArticleInput" class="control-label">Артикул:</label>
                            <input type="text" class="form-control" id="metallArticleInput">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <div>
                        <button type="button" class="btn btn-default" data-dismiss="modal">Отмена</button>
                        <button type="button" class="btn btn-success" id="addMetallBtn">Добавить</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="modal fade" id="editMetallModal" tabindex="-1" role="dialog" aria-labelledby="editMetallModal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header editModalHeader">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Редактировать Ким</h4>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label for="addCategoryInput" class="control-label">Металл:</label>
                            <input type="text" class="form-control" id="editMetallNameInput">
                        </div>
                        <div class="form-group">
                            <label for="addCategoryArticleInput" class="control-label">Цена Входящая:</label>
                            <input class="form-control" id="editMetallPriceInput" type="number">
                        </div>
                        <div class="form-group">
                            <label for="addCategoryArticleInput" class="control-label">Масса:</label>
                            <input type="number" class="form-control" id="editMetallMassInput">
                        </div>
                        <div class="form-group">
                            <label for="addCategoryArticleInput" class="control-label">Цена Исходящая:</label>
                            <input type="number" class="form-control" id="editMetallOutPriceInput">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <div class="modalFooterEdit">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Отмена</button>
                        <button type="button" class="btn btn-primary" id="editMetallBtn">Сохранить</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="modal fade" id="addNewProductModal" tabindex="-1" role="dialog" aria-labelledby="addNewProductModal">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header addNewModalHeader">
                    <div class="row">
                        <div class="col-md-3">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Отмена</button>
                        </div>
                        <div class="col-md-6">
                            <h4 class="modal-title">Создать Новое Изделие</h4>
                        </div>
                        <div class="col-md-3">
                            <button type="button" class="btn btn-primary pull-right" id="addNewProductBtn">Сохранить</button>
                        </div>
                    </div>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <form>
                                <div class="form-group">
                                    <label for="addCategoryInput" class="control-label">Название Изделия:</label>
                                    <input type="text" class="form-control productNameInput">
                                </div>
                                <div class="form-group">
                                    <label for="addCategoryInput" class="control-label">Выберите Категорию:</label>
                                    <select class="form-control categoriesList"></select>
                                </div>
                                <div class="form-group">
                                    <label for="addCategoryInput" class="control-label">Выберите КИМ:</label>
                                    <select class="form-control kimList"></select>
                                </div>
                                <div class="form-group">
                                    <label for="addCategoryInput" class="control-label">Выберите Металл:</label>
                                    <select class="form-control metallsList"></select>
                                </div>
                            </form>
                        </div>
                        <div class="col-md-6">
                            <div class="col-md-12" id="imageWrapper">
                                <div class="upload-wrapper">
                                    <button type="button" class="btn btn-success btn-sm" id="uploadImageProduct"><span class="glyphicon glyphicon-upload" aria-hidden="true"></span>  Загрузить картинку</button>
                                    <div class="upload-image" style="display:none"></div>
                                    <input type="file" id="input-file-upload" style="display:none" />
                                </div>
                                <div id="productImgWrapper"></div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div class="row">
                        <div class="col-md-12">
                            <table border="1px">
                                <tr>
                                    <td>Доступно управление клавишами:</td>
                                    <td><button>КМВ</button> +0.01</td>
                                    <td><button>КМН</button> -0.01</td>
                                    <td><button><span class="glyphicon glyphicon-triangle-top" aria-hidden="true"></span></button> +1</td>
                                    <td><button><span class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span></button> -1</td>
                                    <td><button>/</button> +10</td>
                                    <td><button>Ctrl</button> -10</td>
                                    <td><button><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button> +100</td>
                                    <td><button>Alt</button> -100</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <hr />
                    <div class="row" style="max-width: 100%;">
                        <form id="newProductTableCalc">
                            <div class="row">
                                <div class="col-md-12 tableContent">
                                    <div class="col-md-6 createTableDiv productTableWrapper">
                                        <button type="button" class="btn btn-info btn-sm pull-right" id="addNewRow">
                                            <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                                        </button>
                                    </div>
                                    <div class="col-md-6" id="productArticleWrapper">
                                        Артикул : <span id="productArticle" class="bg-primary"></span>
                                                <button type="button" class="btn btn-info btn-sm" id="createArticle">Создать артикул</button>
                                                <!--<button type="button" class="btn btn-success btn-sm" id="saveArticle">Сохранить</button>-->
                                                <button type="button" class="btn btn-danger btn-sm" id="cancelArticleBtn">Отмена</button>
                                                <span id="errorArticle" class="bg-danger"></span>
                                    </div>
                                    <div class="col-md-6" id="productTableWrapper">
                                        <ul id="sortable">
                                            <li class="">
                                                <span class="rowNumber col-md-2">A1</span>
                                                <span class="rowName">
                                                    <input class="rowNameInput" type="text" value="">
                                                </span>
                                                <span class="rowValue">
                                                    <input class="rowValueInput" data-cell="A1" data-formula="" data-format="0[.]00"
                                                           type="tel" style="width: 5em;" value="">
                                                </span>
                                                <label><input class="checkToArticle" type="checkbox"></label>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="col-md-6">
                                        <ul id="alwaysInTable">
                                            <li>
                                                <span class="rowNumber col-md-2">KIM1</span>
                                                <span class="rowName">
                                                    <input class="rowNameInput" type="text" value="KIM1">
                                                </span>
                                                <span class="rowValue">
                                                    <input class="rowValueInput" data-cell="KIM1" data-formula="" data-format="0[.]00"
                                                           type="tel" style="width: 5em;" value="">
                                                </span>
                                            </li>
                                            <li>
                                                <span class="rowNumber col-md-2">S1</span>
                                                <span class="rowName">
                                                    <input class="rowNameInput" type="text" value="Площадь, м2">
                                                </span>
                                                <span class="rowValue">
                                                    <input class="rowValueInput" data-cell="S1" data-formula="" data-format="0[.]00"
                                                           type="tel" style="width: 5em;" value="">
                                                </span>
                                            </li>
                                            <li>
                                                <span class="rowNumber col-md-2">PR1</span>
                                                <span class="rowName">
                                                    <input class="rowNameInput" type="text" value="Цена входящая за м2, грн">
                                                </span>
                                                <span class="rowValue">
                                                    <input class="rowValueInput" data-cell="PR1" data-formula="" data-format="0[.]00"
                                                           type="tel" style="width: 5em;" value="">
                                                </span>
                                            </li>
                                            <li>
                                                <span class="rowNumber col-md-2">SUM1</span>
                                                <span class="rowName">
                                                    <input class="rowNameInput" type="text" value="Цена изделия входящая, грн">
                                                </span>
                                                <span class="rowValue">
                                                    <input class="rowValueInput" data-cell="SUM1" data-formula="PRODUCT(S1,PR1)" data-format="0[.]00"
                                                           type="tel" style="width: 5em;" value="">
                                                </span>
                                            </li>
                                            <li>
                                                <span class="rowNumber col-md-2">PR2</span>
                                                <span class="rowName">
                                                    <input class="rowNameInput" type="text" value="Цена исходящая, грн">
                                                </span>
                                                <span class="rowValue">
                                                    <input class="rowValueInput" data-cell="PR2" data-formula="" data-format="0[.]00"
                                                           type="tel" style="width: 5em;" value="">
                                                </span>
                                            </li>
                                            <li>
                                                <span class="rowNumber col-md-2">SUM2</span>
                                                <span class="rowName">
                                                    <input class="rowNameInput" type="text" value="Цена изделия исходящая, грн">
                                                </span>
                                                <span class="rowValue">
                                                    <input class="rowValueInput" data-cell="SUM2" data-formula="PRODUCT(S1,PR2)" data-format="0[.]00"
                                                           type="tel" style="width: 5em;" value="">
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div class="col-md-12">
                            <div class="col-md-12 col-md-offset-0 formulaBtnGroupPr">
                                <button type="button" class="btn custom-cancelInputFormula btn-sm" id="cancelFormulaBtnPr">Отмена</button>
                                <button type="button" class="btn btn-info btn-sm" id="addFormulaBtnPr">Добавить</button>
                            </div>
                            <input type="text" class="col-md-12" id="addFormulaInputPr" placeholder="Введите формулу">
                            <div class="col-md-12" id="formulasHelper">
                                <span id="addNewBtnSpan">
                                    <input type="text" id="addNewFhBtnInput"/>
                                    <button type="button" class="btn btn-success btn-xs addNewFhBtn"><span class="glyphicon glyphicon-plus-sign"></span> New</button>
                                </span>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <table class="table table-hover" id="formulasList">
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="appSpinner"></div>
    <?php echo $js; ?>
  </body>
</html>