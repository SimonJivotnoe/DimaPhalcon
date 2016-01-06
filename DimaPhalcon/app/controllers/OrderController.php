<?php
use Phalcon\Db\RawValue;
class OrderController  extends \Phalcon\Mvc\Controller 
{
    public function createNewOrderAction() {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $orderMax = Orders::maximum(array("column" => "order_number"));
            $consolidate = $this->request->getPost('consolidate');
            $project = $this->request->getPost('project');
            $orderNumber = 1;
            if ($orderMax) {
                $orderNumber = (int)($orderMax) + 1;
            }

            $order = new Orders;
            $order->setOrderNumber($orderNumber)
                  ->setArticle($this->generateArticle($orderNumber))
                  ->setDiscount(new RawValue('default'))
                  ->setProject($project)
                  ->setMap(new RawValue('default'))
                  ->setConsolidate($consolidate);
            if ($consolidate) {
                $order->setStatus('draft');
            } else {
                $order->setStatus('save');
            }
            $this->response->setContentType('application/json', 'UTF-8');

            if ($order->save() == false) {
                $this->response->setJsonContent('error');
                return $this->response;
            }
            $order_id = $order->getId();
            
            if ($consolidate) {
                $tab = new TabsController;
                $this->response->setJsonContent($tab->addNewRightTab($order_id));
            } else {
                $this->response->setJsonContent(true);
            }
            
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

    public function addProductToOrderAction(){
        if ($this->request->isAjax() && $this->request->isPost()) {
            $orderId = $this->request->getPost('orderId');
            $prId = $this->request->getPost('productId');
            $alwaysInTable = $this->request->getPost('alwaysInTable');
            $this->response->setContentType('application/json', 'UTF-8');
            $orObj = Productinorder::findFirst(
                "orderId = '" . $orderId . "' AND productId = '" . $prId . "'"
            );
            if (!$orObj) {
                $prInOrder = new Productinorder;
                $prInOrder->setOrderid($orderId)
                          ->setProductid($prId)
                          ->setAlwaysInTable($alwaysInTable);
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

    public function addToConsolidateOrderAction() {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $orderId = $this->request->getPost('orderId');
            $arr = $this->request->getPost('arr');
            $this->response->setContentType('application/json', 'UTF-8');
            foreach ($arr as $val) {
                $orObj = ConsolidateOrders::findFirst(
                    "order_id = '" . $orderId . "' AND cons_order_id = '" . $val . "'"
                );
                if (!$orObj) {
                    $consOrder = new ConsolidateOrders;
                    $consOrder->setOrderId($orderId)
                              ->setConsOrderId($val)
                              ->save();
                }
            }
            $this->response->setJsonContent(true);
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

    public function removeFromOrderAction ()
    {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $orderId = $this->request->getPost('orderId');
            $productId = $this->request->getPost('productId');
            $this->response->setContentType('application/json', 'UTF-8');
            $orObj = Productinorder::findFirst(
                "orderId = '" . $orderId . "' AND productId = '" . $productId . "'"
            );
            if ($orObj) {
                if($orObj->delete() == true) {
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

   public function openSavedOrderAction() {
       if ($this->request->isAjax() && $this->request->isPost()) {
            $arr = $this->request->getPost('arr');
            $tab = $this->request->getPost('tab');
            $active = $this->request->getPost('active');
            $this->response->setContentType('application/json', 'UTF-8');
           foreach ($arr as $id) {
               $orderId = $id;
               $tabs = TabsRight::findFirst(array("order_id = '$orderId'"));
               if ($tabs) {
                   continue;
               }
               if ('new' === $tab) {
                   $tabObj = new TabsRight();
                   $tabs = TabsRight::find("active = 1");
                   $activeMark = 0;
                   if ('true' === $active) {
                       foreach ($tabs as $val) {
                           $val->setActive(0);
                           $val->save();
                       }
                       $activeMark = 1;
                   }
                   $tabObj->setOrderId($orderId)
                       ->setActive($activeMark)
                       ->save();
               } else {
                   $tabs = TabsRight::findFirst(array("order_id = '$orderId'"));
                   $tabs->setOrderId($orderId)
                       ->save();
               }
           }
            $this->response->setJsonContent(true);
            return $this->response;
        } else {
            $this->response->redirect('');
        }
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

    public function getOrderDescriptionObj($id){
        $order = Orders::findFirst($id);
        if ($order == false) {
            return false;
        }
        $orderDescription = [
            '%FIO%'           => $order->Projects->Clients->getFio(),
            '%APPEAL%'        => $order->Projects->Clients->getAppeal(),
            '%COMPANY_NAME%'  => $order->Projects->Clients->getCompanyName(),
            '%ADDRES%'        => $order->Projects->Clients->getAdress(),
            '%ACC_NUMBER%'    => $order->Projects->Clients->getAccaunt(),
            '%CITY%'          => $order->Projects->Clients->getZip(),
            '%PROJECT_NAME%'  => $order->Projects->getName(),
            '%PROJECT_DESCR%' => $order->Projects->getDescription(),
            '%ESTIMATE%'      => $order->Projects->getEstimate(),
            '%DATE%'          => $order->Projects->getDate(),
            '%ORDER_NAME%'    => $order->getArticle()
        ];
        /*foreach ($orders as $val) {
            foreach (json_decode($val->getOrderDescription()) as $key => $text) {
                if (trim($text)) {
                    if(!in_array($text, $orderDescription[$key], true)){
                        array_push($orderDescription[$key], $text);
                    }
                }
            }
            array_push($orderDescription['%ORDER_NAME%'], $val->getArticle());
        }*/
        return $orderDescription;
    }
}