<div role="rightTabs">
    <ul class="nav nav-tabs" role="tablist" id="rightTabs">
        <li role="kim" id="kim" class="active">
            <a href="#kimTab" aria-controls="kim" role="tab" data-toggle="tab">
                <span class="glyphicon glyphicon-stats" id="kimIconColor" aria-hidden="true"></span></a>
        </li>
        <li role="presentation" id="addNewTabRight"><a>+</a></li>
    </ul>
</div>

<div class="tab-content">
    <div role="rightTabs" class="tab-pane active" id="kimTab">
        <div class="col-md-12">
            <h4>Категории <span class="glyphicon glyphicon-th-list" aria-hidden="true" data-toggle="collapse"
                                data-target="#categoriesCollapse" aria-expanded="true"
                                aria-controls="categoriesCollapse">
                </span>
            </h4>

            <div class="collapse in" id="categoriesCollapse">
                <div class="col-md-8">
                    <input type="text" id="addCategoryInput" placeholder="Имя категории">
                    <input type="text" id="addCategoryArticleInput" placeholder="Артикул">
                    <button type="button" class="btn btn-info btn-sm" id="addCategoryBtn">Добавить</button>
                </div>
                <div class="col-md-8" id="categoriesListTable">
                    <table class="table table-bordered">
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="col-md-12">
            <h4>КИМ <span class="glyphicon glyphicon-fire" aria-hidden="true" data-toggle="collapse"
                          data-target="#kimCollapse" aria-expanded="true" aria-controls="kimCollapse">
                </span>
            </h4>

            <div class="collapse in" id="kimCollapse">
                <div class="col-md-12">
                    <input type="text" id="kimHardInput" placeholder="Сложность изделия"/>
                    <input type="number" id="kimInput" step="0.1" min="0.1" placeholder="КИМ"/>
                    <button class="btn btn-info btn-sm" id="addKIM">Добавить</button>
                </div>
                <div class="col-md-8" id="kimListWrapper">
                    <table class="table table-bordered">
                        <tbody id="tbodyKIM">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="col-md-12">
            <h4>Металлы <span class="glyphicon glyphicon-oil" aria-hidden="true"  data-toggle="collapse"
                              data-target="#metallsCollapse" aria-expanded="true" aria-controls="metallsCollapse">
                </span>
            </h4>
            <div class="collapse in" id="metallsCollapse">
                <div class="col-md-12">
                    <input type="text" id="metallName" placeholder="Металл"/>
                    <input type="number" id="metallPrice" step="10" placeholder="Цена"/>
                    <input type="number" id="metallMass" step="0.1" min="0.1" placeholder="Масса"/>
                    <input type="number" id="metallOutPrice" step="10" placeholder="Исходящая цена"/>
                    <input type="text" id="metallArticle" placeholder="Артикул"/>
                    <button class="btn btn-info btn-sm" id="addMetall">Добавить</button>
                </div>
                <div class="col-md-12" id="metallListWrapper">
                    <table class="table table-bordered">
                        <tbody id="tbodyMetalls">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div role="tabpanel" class="tab-pane currentTabRight" id="">
        <div id="orderDetailsWrapper"></div>
        <div class="col-md-8" id="orderTableWrapper"></div>
    </div>
</div>

<!--<div class="col-md-8">
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
</div>-->
