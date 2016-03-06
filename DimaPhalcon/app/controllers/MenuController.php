<?php

class MenuController extends ControllerBase
{
    public function createFileManagerAction(){
        if ($this->request->isAjax() && $this->request->isGet()) {
            $this->response->setContentType('application/json', 'UTF-8');
            $param = $this->request->get('param');
            if ('PR' === $param) {
                $products = $this->getProducts();
            } else {
                $orders = $this->getOrders();
                $products['orders'] = $orders['ordersTable'];
                $products['orderDescription'] = $orders['orderDescription'];
            }
            $this->response->setJsonContent($products);

            return $this->response;
        } else {
            $this->response->redirect();
        }
    }

    public function getProductsTreeAction() {
        $this->ajaxGetCheck();
        $preData = [];
        $categArr = [];
        $metallsArr = [];
        $tree = [
            'core' => [
                'data' => []
            ]
        ];
        $i = 1;
        $productsObj = Products::find();
        if (count($productsObj)) {
            foreach ($productsObj as $product) {
                $productId = $product->getProductId();
                $categoryId = $product->getCategoryId();
                $metallId = $product->getMetall();
                if (!$preData[$categoryId]) {
                    $preData[$categoryId] = [];
                }
                if (!$preData[$categoryId][$metallId]) {
                    $preData[$categoryId][$metallId] = [];
                }
                array_push($preData[$categoryId][$metallId], [
                    'id' => $productId,
                    'name' => $product->getProductName(),
                    'article' => $product->getArticle(),
                    'category' => $categoryId,
                    'created' => $product->getCreated()
                ]);
                $categArr[$categoryId] = $product->Categories->getCategoryName();
                $metallsArr[$metallId] = $product->Metalls->getName();
            }
        }
        if ($categArr) {
            foreach ($categArr as $catId => $catName) {
                $catNode = [
                    'id'       => $i,
                    'icon' => 'glyphicon glyphicon-th-list',
                    'li_attr'  => ['data-section' => 'category','data-categoryId' => $catId],
                    'text'     => $catName,
                    'children' => []
                ];
                foreach ( $preData[$catId] as $metId => $productsArr) {
                    $i++;
                    $metNode = [
                        'id'       => $i,
                        'icon'     => 'glyphicon glyphicon-oil',
                        'li_attr'  => ['data-section' => 'metall', 'data-metallId' => $metId],
                        'text'     => $metallsArr[$metId],
                        'children' => []
                    ];
                    foreach ($productsArr as $key => $obj) {
                        $i++;
                        array_push($metNode['children'], [
                            'id'       => $i,
                            'icon'     => 'glyphicon glyphicon-list-alt',
                            'li_attr'  => ['data-section' => 'product', 'data-productId' => $obj['id']],
                            'text'     => $obj['name'] . ' | ' . $obj['article'] . ' - ' . $obj['created']
                        ]);
                    }

                    array_push($catNode['children'], $metNode);
                    $i++;
                }
                array_push($tree['core']['data'], $catNode);
            }
        }
        $tree['state'] = [ 'key' => 'productsTreeDB' ];
        //$tree['checkbox'] = [ 'keep_selected_style' => true ];
        $tree['plugins'] = ['state', 'sort'/*, 'checkbox'*/];
        $this->response->setJsonContent(['tree' => $tree]);

        return $this->response;
    }

    private function getProducts() {
        $products = Products::find(array("status = 'save'"));
        if ($products == false) {
            echo "Мы не можем сохранить робота прямо сейчас: \n";
            foreach ($products->getMessages() as $message) {
                echo $message, "\n";
            }
            return false;
        }
        $productsTable = '<tr>
                            <th>Категория</th>
                            <th>Металл</th>
                            <th>Название</th>
                            <th>Дата создания</th>
                            <th>Действия</th>
                          </tr>';
        $substObj = new Substitution();

        $categoriesObj = new CategoriesController;
        $categoriesRes = $categoriesObj->createCategoriesList();
        $categoriesList = '<option name="categoriesAll" selected="selected">Все Категории</option>';
        $categoriesList .= $categoriesRes['html'];
        $categoriesArr = $categoriesRes['categoriesArr'];
        foreach ($products as $val) {
            $arr['%NAME%'] = $val->getProductName();
            $arr['%CATEGORY%'] = $categoriesArr[$val->getCategoryId()];
            $arr['%CATEGORY_ID%'] = $val->getCategoryId();
            $arr['%CREATED%'] = $val->getCreated();
            $arr['%ACTIONS%'] = '';
            $productID = $val->getProductId();
            $metallId = $val->getMetall();
            $prInOrderObj = Productinorder::find(array("productId = '$productID'"));
            $metallObj = Metalls::findFirst($metallId);
            $arr['%METALL%'] = $metallObj->getName();
            foreach ($prInOrderObj as $data) {
                $orderId = $data->getOrderId();
                $prObj = Orders::findFirst(array("id = '$orderId'"));
                if (!empty($arr['%ORDERS%'])) {
                    $arr['%ORDERS%'] .= ', ';
                }
                $arr['%ORDERS%'] .= $prObj->getArticle();
            }
            $tabsObj = Tabs::findFirst(array("product_id = '$productID'"));
            if (!$tabsObj) {
                $arr['%ACTIONS%'] = '<span class="glyphicon glyphicon-eye-open openProductTab" data-id="' . $productID . '" data-type="product" aria-hidden="true" data-selected=""></span>';
            }
            $productsTable .= $substObj->subHTMLReplace('menuProductTableRow.html', $arr);
        }
        return array('categories' => $categoriesList, 'products' => $productsTable);
    }

    private function getOrders(){
        $orders = Orders::find(array("status = 'save'"));
        if ($orders == false) {
            echo "Мы не можем сохранить робота прямо сейчас: \n";
            foreach ($orders->getMessages() as $message) {
                echo $message, "\n";
            }
            return false;
        }
        $ordersTable = '<tr>
                            <th>Название проэкта</th>
                            <th>Название компании</th>
                            <th>Артикул</th>
                            <th>Город</th>
                            <th>Действия</th>
                        </tr>';
        $substObj = new Substitution();
        $orderObj = new OrderController();
        $orderDescription = $orderObj->getOrderDescriptionObj();
        foreach ($orders as $val) {
            $arr['%FULL_INFO%'] = [];
            foreach (json_decode($val->getOrderDescription()) as $key => $text) {
                $arr[$key] = $text;
                if (trim($text)) {
                    array_push($arr['%FULL_INFO%'], '"' . str_replace("%", "", $key) . '": "' . $text . '"');
                }
            }
            array_push($arr['%FULL_INFO%'], '"ORDER_NAME": "' . $val->getArticle() . '"');
            $arr['%NAME%'] = $val->getArticle();
            $orderId = $val->getId();
            $arr['%PRODUCTS%'] = '<table class="table table-bordered">';
            $arr['%ACTIONS%'] = '';
            $arr['%FULL_INFO%'] = implode(",", $arr['%FULL_INFO%']);
            $products = Productinorder::find(array("orderId = '$orderId'"));
            foreach ($products as $data) {
                $productId = $data->getProductId();
                $prObj = Products::findFirst(array("product_id = '$productId'"));
                $arr['%PRODUCTS%'] .= '<tr><td>' . $prObj->getArticle() . '</td><td>' . $prObj->getProductName() . '</td></tr>';
            }
            $arr['%PRODUCTS%'] .= '</table>';
            $orderTabsObj = TabsRight::findFirst(array("order_id = '$orderId'"));
            if (!$orderTabsObj) {
                $arr['%ACTIONS%'] = '<span class="glyphicon glyphicon-eye-open openProductTab"'
                        . ' data-id="' . $orderId . '" data-type="order" aria-hidden="true" data-selected="">'
                        . '</span><span class="glyphicon glyphicon-list-alt consolidateOrder" aria-hidden="true" data-id="' . $orderId . '" data-selected=""></span>';
            } else {
                $arr['%ACTIONS%'] .= '<span class="glyphicon glyphicon-search emptyGlyphSpan" aria-hidden="true"></span><span class="glyphicon glyphicon-list-alt consolidateOrder" aria-hidden="true" data-id="' . $orderId . '" data-selected=""></span>';
            }
            $ordersTable .= $substObj->subHTMLReplace('menuOrderTableRow.html', $arr);
        }

        return ['ordersTable' => $ordersTable, 'orderDescription' => $orderDescription];
    }

    public function saveOrderMapAction(){
        if ($this->request->isAjax() && $this->request->isPost()) {
            $map = $this->request->getPost('map');
            $orderId = $this->request->getPost('orderId');
            $this->response->setContentType('application/json', 'UTF-8');
            $order = Orders::findFirst(array("id = '$orderId'"));
            if ($order == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($order->getMessages() as $message) {
                    echo $message, "\n";
                }
            } else {
                $order->setMap($map);
                if($order->save()) {
                    $this->response->setJsonContent(true);

                    return $this->response;
                }

            }
        } else {
            $this->response->redirect('');
        }
    }
}