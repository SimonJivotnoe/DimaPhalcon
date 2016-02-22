<div role="rightTabs">
    <ul class="nav nav-tabs" role="tablist" id="rightTabs">
        <li role="kim" id="fileManagerOrdersTab" class="active">
            <a href="#fileManagerOrdersWrapper" aria-controls="kim" role="tab" data-toggle="tab">
                <span class="glyphicon glyphicon-tasks" id="kimIconColor" aria-hidden="true"></span></a>
        </li>
        <!--<li role="presentation" id="addNewTabRight"><a>+</a></li>-->
    </ul>
</div>

<div class="tab-content" id="rightTabsContent">
    <div role="rightTabs" class="tab-pane active" id="fileManagerOrdersWrapper">
        <!--<video id="livemill"
            autoplay=""
            height="360"
            loop=""
            preload=""
            muted=""
            src="img/livemill.mp4" width="640">
        </video>-->
        <div class="col-md-4" id="clientsTreeWrapper">
            <div class="col-md-12 navbar navbar-inverse" id="clientsTreeActionsWrapper">
                <span class="glyphicon glyphicon-user" aria-hidden="true" id="addNewClient"><span>+</span></span>
            </div>
            <div class="col-md-12">
                <div id="clientsTree"></div>
            </div>
        </div>
        <div class="col-md-8" id="orderFromTree">
            <div class="col-md-12" id="addNewClientForm">
                <div class="col-md-12">
                    <input type="text" class="form-control" id="NewClientFio" placeholder="ÔÈÎ Êëèåíòà">
                </div>
            </div>
        </div>
    </div>
    <div role="tabpanel" class="tab-pane currentTabRight" id="">
        <div id="orderDetailsWrapper"></div>
        <div class="" id="orderTableWrapper"></div>
    </div>
</div>