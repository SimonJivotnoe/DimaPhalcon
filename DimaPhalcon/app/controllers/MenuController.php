<?php

class MenuController extends \Phalcon\Mvc\Controller
{
    public function createFileManagerAction(){
        if ($this->request->isAjax() && $this->request->isGet()) {
            $products = Products::find(array("status = 'save'"));
            $this->response->setContentType('application/json', 'UTF-8');
            if ($products == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($products->getMessages() as $message) {
                    echo $message, "\n";
                }
                return false;
            }
            $productSTable = '<tr>
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
            $categoriesList .= $categoriesRes['categoriesList'];
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
                    $arr['%ACTIONS%'] = '<span class="glyphicon glyphicon-eye-open openProductTab" aria-hidden="true"></span>';
                }
                $productSTable .= $substObj->subHTMLReplace('fileManagerProductTableRow.html', $arr);
            }
            $rows = ['%PRODUCTS%' => ''];


            /* if (count($productsInOrder)) {
                 $order = Orders::findFirst($orderId);
                 if ($order == false) {
                     echo "Мы не можем сохранить робота прямо сейчас: \n";
                     foreach ($order->getMessages() as $message) {
                         echo $message, "\n";
                     }
                     return false;
                 }

                 $products = array();
                 $discount = $order->getDiscount();
                 foreach ($productsInOrder as $val) {
                     $products[$val->getProductId()] = $val->getQuantity();
                 }
                 $productObj = new ProductsController;
                 foreach ($products as $key => $val) {
                     $rows['%PRODUCTS%'] .= $productObj->createProductInOrder($key, $val, $orderId, $discount);
                 }
             }
             $res = $substObj->subHTMLReplace('orderTable.html', $rows);*/
            $this->response->setJsonContent(['categories' => $categoriesList, 'products' => $productSTable]);

            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

}

