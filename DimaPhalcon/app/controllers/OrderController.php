<?php
use Phalcon\Db\RawValue;
class OrderController  extends \Phalcon\Mvc\Controller 
{
    public function createNewOrderAction() {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $orderMax = Orders::maximum(array("column" => "order_number"));
            $orderNumber = 1;
            if ($orderMax) {
                $orderNumber = (int)($orderMax) + 1;
            }

            $order = new Orders;
            $descr = (array)json_decode(file_get_contents('files/orderDetails.json'));
            $year = date('o');
            $month = date('m');
            $day = date('d');
            $descr['%DATE%'] = $year . '-' . $month . '-' . $day;
            $descr['%ESTIMATE%'] = $year . '-' . $month . '-' . $day;
            $order->setOrderNumber($orderNumber)
                ->setArticle($this->generateArticle($orderNumber))
                ->setDiscount(new RawValue('default'))
                ->setOrderDescription(json_encode((object)$descr))
                ->setMap(new RawValue('default'))
                ->setStatus(new RawValue('default'))
                ->save();

            $this->response->setContentType('application/json', 'UTF-8');

            if ($order->save() == false) {
                $this->response->setJsonContent('error');
                return $this->response;
            }
            $order_id = $order->getId();

            $tab = new TabsController;
            $this->response->setJsonContent($tab->addNewRightTab($order_id));
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

    public function addProductToOrderAction(){
        if ($this->request->isAjax() && $this->request->isPost()) {
            $orderId = $this->request->getPost('orderId');
            $prId = $this->request->getPost('productId');
            $this->response->setContentType('application/json', 'UTF-8');
            $orObj = Productinorder::findFirst(
                "orderId = '" . $orderId . "' AND productId = '" . $prId . "'"
            );
            if (!$orObj) {
                $prInOrder = new Productinorder;
                $prInOrder->setOrderid($orderId)
                          ->setProductid($prId);
                if ($prInOrder->save() == false) {
                    $this->response->setJsonContent('error');
                    return $this->response;
                }
                $this->response->setJsonContent(array('status' => 'ok'));
                return $this->response;
            }
            $this->response->setJsonContent(array('status' => 'already'));
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }
    public function saveOrderInDBAction(){
        if ($this->request->isAjax() && $this->request->isPost()) {
            $orderId = $this->request->getPost('orderId');
            $this->response->setContentType('application/json', 'UTF-8');
            $orderObj = Orders::findFirst(array("id = '$orderId'"));
            if ($orderObj) {
                $q = $orderObj->setStatus('save');
                if($q->save() == true) {
                    $this->response->setJsonContent(true);
                } else {
                    $this->response->setJsonContent(false);
                }

                return $this->response;
            }
            $this->response->setJsonContent('error');
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

    public function changeDiscountAction(){
        if ($this->request->isAjax() && $this->request->isPost()) {
            $orderId = $this->request->getPost('orderId');
            $discount = $this->request->getPost('discount');
            $this->response->setContentType('application/json', 'UTF-8');
            $orderObj = Orders::findFirst(array("id = '$orderId'"));
            if ($orderObj) {
                $q = $orderObj->setDiscount($discount);
                if($q->save() == true) {
                    $this->response->setJsonContent(true);
                } else {
                    $this->response->setJsonContent(false);
                }

                return $this->response;
            }
            $this->response->setJsonContent('error');
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

    public function changeQuantityAction() {
       if ($this->request->isAjax() && $this->request->isPost()) {
           $orderId = $this->request->getPost('orderId');
           $productId = $this->request->getPost('productId');
           $quantity = $this->request->getPost('quantity');
           $this->response->setContentType('application/json', 'UTF-8');
           $orderObj = Productinorder::findFirst(array("orderId = '$orderId'", "productId = '$productId'"));
           if ($orderObj) {
               $q = $orderObj->setQuantity($quantity);
               if($q->save() == true) {
                   $this->response->setJsonContent(true);
               } else {
                   $this->response->setJsonContent(false);
               }
               
               return $this->response;
           }
           $this->response->setJsonContent('error');
           return $this->response;
       } else {
            $this->response->redirect('');
        }
    }
    
    public function changeOrderDetailsAction() {
        if ($this->request->isAjax() && $this->request->isPost()) {
           $orderId = $this->request->getPost('orderId');
           $orderDescr = $this->request->getPost('orderDescr');
           $this->response->setContentType('application/json', 'UTF-8');
           $orderObj = Orders::findFirst(array("id = '$orderId'"));
           if ($orderObj) {
               $q = $orderObj->setOrderDescription(json_encode($orderDescr));
               if($q->save() == true) {
                   $this->response->setJsonContent(true);
               } else {
                   $this->response->setJsonContent(false);
               }
               
               return $this->response;
           }
           $this->response->setJsonContent('error');
           return $this->response;
       } else {
            $this->response->redirect('');
        }
    }

    public function generateSectionArr ($arr, $orderId) {
        $productInOrderObj = Productinorder::find(array('orderId' => $orderId));
        if ($productInOrderObj == false) {
            echo "Мы не можем сохранить робота прямо сейчас: \n";
            foreach ($productInOrderObj->getMessages() as $message) {
                echo $message, "\n";
            }
            return false;
        }
        $productsArr = array();
        $res = array();
        foreach ($productInOrderObj as $val) {
            array_push($productsArr, $val->getProductid());
        }
        $productObj = new ProductsController;
        foreach ($arr as $key => $val) {
            foreach ((array)$val as $productId => $quantity) {
                if (in_array($productId, $productsArr)) {
                    array_push($res, [$productId => $quantity]);
                }
            }
        }

        return $res;
    }

    public function createAddToOrder() {
        //$substObj = new Substitution();
        $res = '<button class="btn btn-info btn-sm" id="addToOrderBtn">Добавить в ордер</button>';
        return $res;
    }
    
    public function generateArticle($number) {
        $zero = '00';
        if (9 < $number && 100 > $number) {
           $zero = '0';
        } else if(100 < $number && 1000 > $number) {
            $zero = '';
        }
        return date('y') . '-' . $zero . strval($number) . '-' . date('d') . date('m') . date('o');
    }
}
