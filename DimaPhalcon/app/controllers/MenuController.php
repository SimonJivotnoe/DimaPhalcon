<?php

class MenuController extends \Phalcon\Mvc\Controller
{
    public function createFileManagerAction(){
        if ($this->request->isAjax() && $this->request->isGet()) {
            $products = $this->getProducts();
            $products['orders'] = $this->getOrders();
            $this->response->setContentType('application/json', 'UTF-8');
            $this->response->setJsonContent($products);

            return $this->response;
        } else {
            $this->response->redirect();
        }
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
                            <th>Название</th>
                            <th>Категория</th>
                            <th>Дата создания</th>
                            <th>Ордера</th>
                            <th>Действия</th>
                            </tr>';
        $substObj = new Substitution();

        $categoriesObj = new CategoriesController;
        $categoriesRes = $categoriesObj->createCategoriesList();
        $categoriesList = '<option name="categoriesAll" selected="selected">Все</option>';
        $categoriesList .= $categoriesRes['html'];
        $categoriesArr = $categoriesRes['categoriesArr'];
        foreach ($products as $val) {
            $arr['%NAME%'] = $val->getProductName();
            $arr['%CATEGORY%'] = $categoriesArr[$val->getCategoryId()];
            $arr['%CATEGORY_ID%'] = $val->getCategoryId();
            $arr['%CREATED%'] = $val->getCreated();
            $arr['%ORDERS%'] = '';
            $arr['%ACTIONS%'] = '';
            $productID = $val->getProductId();
            $tabsObj = Tabs::findFirst(array("product_id = '$productID'"));
            if (!$tabsObj) {
                $arr['%ACTIONS%'] = '<span class="glyphicon glyphicon-eye-open openProductTab" aria-hidden="true" data-selected=""></span>';
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
                            <th>Артикул</th>
                            <th>Продукты</th>
                            <th>Действия</th>
                            </tr>';
        $substObj = new Substitution();
        foreach ($orders as $val) {
            $arr['%NAME%'] = $val->getArticle();
            $arr['%PRODUCTS%'] = '';
            $arr['%ACTIONS%'] = '';
            $ordersTable .= $substObj->subHTMLReplace('menuOrderTableRow.html', $arr);
        }

        return $ordersTable;
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

