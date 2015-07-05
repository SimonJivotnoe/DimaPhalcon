<div role="tabpanel">
    <ul class="nav nav-tabs" role="tablist" id="myTab">
        <li role="presentation" id="preferences">
            <a href="#preferences1" aria-controls="preferences1" role="tab" data-toggle="tab">
                <!--<span class="glyphicon glyphicon-cog" aria-hidden="true"></span>-->
                <i class="fa fa-cog fa-1.5x fa-fw"></i>
            </a>
        </li>
        <li role="presentation" id="addNewTab"><a>+</a></li>
    </ul>

    <div class="tab-content">
        <div role="tabpanel" class="tab-pane" id="preferences1">
            <h4>Блок категорий</h4>
            <div class="col-md-6">
                <input type="text" id="addCategoryInput" placeholder="Введите категорию">
                <button type="button" class="btn btn-info btn-sm" id="addCategoryBtn">Добавить</button>
                <p class="bg-danger">Такое имя уже существует</p>
            </div>
            <div class="col-md-6" id="categoriesListTable">
                <table class="table table-bordered">
                    <tbody>
                    </tbody>
                </table>
            </div>
            <h4 class="col-md-12">Блок формул</h4>
            <div class="col-md-12">
                <input type="text" class="col-md-12" id="addFormulaInput" placeholder="Введите формулу">
                <button type="button" class="btn btn-info btn-sm" id="addFormulaBtn">Добавить</button>
            </div>
            <h4 class="col-md-12">Металлы</h4>
            <div class="col-md-8">
                <table class="table table-bordered">
                    <tbody>
                    <tr>
                        <th>Толщина</th>
                        <th>Размер</th>
                        <th>Цена</th></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div role="tabpanel" class="tab-pane currentTab" id=""></div>
    </div>
</div>
