<?php

class MenuController extends \Phalcon\Mvc\Controller
{

    public function createFileManagerAction(){
        if ($this->request->isAjax() && $this->request->isGet()) {
            $products = Products::find();
            $this->response->setContentType('application/json', 'UTF-8');
            if ($products == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($products->getMessages() as $message) {
                    echo $message, "\n";
                }
                return false;
            }
            $productArr = [];
            foreach ($products as $val) {
                $productArr['name'] = $val->getProductName();
                $productArr['created'] = $val->getCreated();
                $productArr['status'] = $val->getStatus();
                $productArr['template'] = $val->getTemplate();
                var_dump($productArr);die();
            }
            $rows = ['%PRODUCTS%' => ''];
            $substObj = new Substitution();
            if (count($productsInOrder)) {
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
            $res = $substObj->subHTMLReplace('orderTable.html', $rows);
            $this->response->setJsonContent(['html' => $res]);

            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

}

