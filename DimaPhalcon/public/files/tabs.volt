<div role="tabpanel">
    <ul class="nav nav-tabs" role="tablist" id="myTab">
        <li role="presentation" id="preferences">
            <a href="#preferences1" aria-controls="preferences1" role="tab" data-toggle="tab">
                <span class="glyphicon glyphicon-cog" aria-hidden="true"></span>
                <!--<i class="fa fa-cog fa-1.5x fa-fw"></i>-->
            </a>
        </li>
        <li role="presentation" id="addNewTab"><a>+</a></li>
    </ul>

    <div class="tab-content">
        <div role="tabpanel" class="tab-pane" id="preferences1">
            <div class="col-md-12">
                <h4>
                    Основные
                    <span class="glyphicon glyphicon-cog toCollapse" aria-hidden="true" data-toggle="collapse"
                          data-target="#prefGeneralWrapper" aria-expanded="true" aria-controls="prefGeneralWrapper"></span>
                </h4>
            </div>
            <div class="col-md-12 collapse in" id="prefGeneralWrapper">
                <form class="form-inline">
                    <div class="form-group">
                      <label for="globalBodyColor">Фон</label>
                      <input type="text" class="form-control" id="globalBodyColor">
                    </div>
                </form>
            </div>
            <div class="col-md-12">
                <hr>
            </div>
            <div class="col-md-12">
                <h4>
                    Вкладки
                <span class="glyphicon glyphicon-duplicate toCollapse" aria-hidden="true" data-toggle="collapse"
                      data-target="#prefTabsWrapper" aria-expanded="true" aria-controls="prefTabsWrapper"></span>
                </h4>
            </div>
            <div class="col-md-12 collapse in" id="prefTabsWrapper">
                <div class="col-md-8">
                    <div class="col-md-8">
                        <table class="table">
                            <tr>
                                <th>Шрифт:</th>
                                <td><input id="fontFamilyTabs" type="text" /></td>
                            </tr>
                            <tr>
                                <th>Размер шрифта:</th>
                                <td><select id="fontSizeTabs" class="fontSizeSelect"></select></td>
                            </tr>
                            <tr>
                                <th>Цвет шрифта:</th>
                                <td><input type="text" class="form-control" id="prefTabFontColor"></td>
                            </tr>
                            <tr>
                                <th>Фон активной вкладки:</th>
                                <td><input type="text" class="form-control" id="prefActiveTabColor"></td>
                            </tr>
                            <tr>
                                <th>Фон неактивной вкладки:</th>
                                <td><input type="text" class="form-control" id="prefInactiveTabColor"></td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class="col-md-4">
                    <div role="tabpanel">
                        <ul class="nav nav-tabs" role="tablist" id="testTab">
                            <li role="presentation" class="active">
                                <a href="#" aria-controls="test" role="tab" data-toggle="tab">
                                    <span class="tabName">Active</span>
                                    <span class="closeTab glyphicon glyphicon-remove" name="338" aria-hidden="true"></span>
                                </a>
                            </li>
                            <li role="presentation" class="">
                                <a href="#" aria-controls="test" role="tab" data-toggle="tab">
                                    <span class="tabName">Inactive</span>
                                    <span class="closeTab glyphicon glyphicon-remove" name="338" aria-hidden="true"></span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-md-12">
                <hr>
            </div>
            <div class="clearer"></div>
        </div>
        
        <div role="tabpanel" class="tab-pane currentTab" id=""></div>
    </div>
</div>
