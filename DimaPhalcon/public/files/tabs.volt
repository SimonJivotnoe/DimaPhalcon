<div role="tabpanel">
    <ul class="nav nav-tabs" role="tablist" id="myTab">
        <li role="presentation" id="dbProductsListTab">
            <a href="#dbProductsListList" aria-controls="dbProductsListList" role="tab" data-toggle="tab">
                <span class="glyphicon glyphicon-folder-open" aria-hidden="true" style="color:#eb9316;"></span>
                <!--<i class="fa fa-cog fa-1.5x fa-fw"></i>-->
            </a>
        </li>
        <li role="presentation" id="addNewTab"><a>+</a></li>
    </ul>

    <div class="tab-content" id="leftTabsContent">
        <div role="tabpanel" class="tab-pane" id="dbProductsListList">
            <div id="fileManagerProductsWrapper">
                    <div class="col-md-4 col-md-offset-2">
                        <form class="form-inline">
                            <div class="form-group">
                              <label for="fileManagerCatogoriesSelect">Категории: </label>
                              <select class="form-control input-sm" id="fileManagerCatogoriesSelect"></select>
                            </div>
                        </form>
                    </div>
                    <div class="col-md-4">
                        <input type="text" class="form-control" id="FMsearchInProducts" placeholder="Поиск">
                    </div>
                <button class="btn btn-success btn-sm" id="showItemFromFileManager" disabled>
                        <span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>
                    </button>
                    <table class="table table-bordered">
                        <tbody id="fileManagerProductsTable">
                        </tbody>
                    </table>
                </div>
        </div>

        <div role="tabpanel" class="tab-pane currentTab" id=""></div>
    </div>
</div>
