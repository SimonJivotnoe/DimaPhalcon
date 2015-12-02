<?php

use Phalcon\Db\RawValue;

class TabsController extends \Phalcon\Mvc\Controller 
{    
    public function getLeftTabsListAction() {      
        if ($this->request->isAjax() && $this->request->isGet()) {
            $tabs = Tabs::find();
            $this->response->setContentType('application/json', 'UTF-8');
            if ($tabs == false) {
                $this->response->setJsonContent(['success' => false, 'error' => __METHOD__ . ':' . $tabs->getMessages()]);
                return $this->response;
            }
            $html = false;
            $active = false;
            $prodId = false;
            $tabArr['preferences1'] = (object)[
                                                'active' => '',
                                                'productId' => 'preferences1'
            ];
            $resObj = [];
            if (count($tabs)) {
                $substObj = new Substitution();                

                foreach ($tabs as $val) {
                    $tabsList = array();
                    if ($val->getActive()) {
                        $tabsList['%ACTIVE%'] = 'active';
                        $active = $val->getTabId();
                        $prodId = $val->getProductId();
                    } else {
                        $tabsList['%ACTIVE%'] = '';
                    }
                    $tabsList['%ID%'] = $val->getId();
                    $tabsList['%TABID%'] = $val->getTabId();
                    $tabsList['%PRODUCT_ID%'] = $val->getProductId();
                    $product = Products::findFirst($val->getProductId());
                    $tabsList['%PRODUCT_NAME%'] = $product->getProductName();
                    $html .= $substObj->subHTMLReplace('tab_li.html', $tabsList);

                    $tabArr[$val->getTabId()] = (object)[
                                'active' => $val->getActive(),
                                'productId' => $val->getProductId()];
                }
                $kim = Kim::find();
                foreach ($kim as $val) {
                    $resObj[$val->getKim()] = $val->getKimHard();
                }                
            }
            $this->response->setJsonContent([
                                    'html' => $html,
                                    'active' => $active,
                                    'productId' => $prodId,
                                    'tabsList' => (object)$tabArr,
                                    'kim' => (object)$resObj
                                ]
            );

            return $this->response;
            
        } else {
            $this->response->redirect('');
        }
    }
    
    public function getLastLeftTabAction() {
        if ($this->request->isAjax() && $this->request->isGet()) {
            $tabs = Tabs::maximum(array("column" => "id"));
               if (!empty($tabs)) {
                   $this->response->setContentType('application/json', 'UTF-8');
                   $this->response->setJsonContent($tabs);
               } else {
                   $this->response->setContentType('application/json', 'UTF-8');
                   $this->response->setJsonContent(array());
               }
               return $this->response;
           } else {
               $this->response->redirect('');
       }
    }
    
    public function getLeftTabContentAction($productId) {
        if ($this->request->isAjax() && $this->request->isGet()) {
            $product = Products::findFirst($productId);
            $this->response->setContentType('application/json', 'UTF-8');
            if ($product == false) {
                $this->response->setJsonContent(['status' => false]);
                return $this->response;
            }

            $articleFlag = true;
            $tabContent = '';
            $addToOrder = '<span>Добавить в ордер можно только после создания артикула</span>';
            $mainTemplate = 'tabContent.html';
            $tableTemplate = 'tableContent.html';
            $alwaysInTableTemplate = 'alwaysInTable.html';
            $substObj = new Substitution();
            $article = $product->getArticle();
            if (!$article) {
                $articleFlag= false;
                $article = $this->getArticleTemplate();
            } else {
                $orderObj = new OrderController;
                $addToOrder = $orderObj->createAddToOrder();
                $mainTemplate = 'leftTabContentArticle.html';
                $tableTemplate = 'alwaysInTableArticle.html';
                $alwaysInTableTemplate = 'alwaysInTableArticle.html';
            }

            $prName = $product->getProductName();
            if ('Новое изделие' === $prName) {
                $prName = '';
            }
            $productCatId = $product->getCategoryId();
            $productKim = $product->getKim();
            $productMetall = $product->getMetall();
            $table = json_decode($product->getTableContent());
            $alwaysInTable = json_decode($product->getAlwaysintable());

            $productObj = new ProductsController;
            $categoryObj = new CategoriesController;
            $kimObj = new KimController;
            $metallsObj = new MetallsController;
            $formulaHelperObj = new FormulasController;
            $css = '';
            $prStatus = $product->getStatus();
            if ('draft' === $prStatus) {
                $prStatus = '<button type="button" class="btn btn-danger btn-sm" id="saveInDB">Сохранить в БД</button>';
            } else if ('save' === $prStatus){
                $prStatus = 'Сохранено в базе данных' ;
                $css = 'saveInDB';
            } else if ('order') {
                $prStatus = '' ;
                $css = 'addedToOrder';
            }
            $categoriesList = $categoryObj->createCategoriesList($productCatId, $articleFlag);
            $kimList = $kimObj->createKimList($productKim, $articleFlag);
            $metallList = $metallsObj->createMetallsList($productMetall, $articleFlag);
            $detailsForArticle = array(
                'category' => $categoriesList['article'],
                'kim' => $kimList['article']
            );
            $formulas = json_decode($product->getFormulas());

            $productDetails = array(
                '%PRODUCT_NAME%'    => $prName,
                '%ARTICLE_BTN%'     => $article,
                '%CATEGORIES%'      => $categoriesList['html'],
                '%KIM_LIST%'        => $kimList['html'],
                '%METALL_LIST%'     => $metallList['html'],
                '%CREATED%'         => $product->getCreated(),
                '%SAVE_IN_DB%'      => $prStatus,
                '%TABLE_CONTENT%'   => $productObj->createTableRes($table, $tableTemplate),
                '%ALWAYS_IN_TABLE%' => $productObj->createTableRes($alwaysInTable, $alwaysInTableTemplate),
                '%FORMULAS_HELPER%' => $formulaHelperObj->createFormulaHelperList(),
                '%FORMULAS%'        => $formulaHelperObj->createFormulasList($formulas),
                '%ADD_TO_ORDER%'    => $addToOrder
            );

            $tabContent .= $substObj->subHTMLReplace($mainTemplate, $productDetails);
            $this->response->setJsonContent([
                'html'              => $tabContent,
                'article'           => $articleFlag,
                'css'               => $css,
                'detailsForArticle' => (object)$detailsForArticle]);
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

    public function changeActiveLeftTabAction() {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $tabs = Tabs::find("active = 1");
            foreach ($tabs as $val) {
                $val->setActive(0);
                $val->save();
            }
            if ($tabs == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($tabs->getMessages() as $message) {
                    echo $message, "\n";
                }
            } else {
                $id = $this->request->getPost('id');
                $tabId = $this->request->getPost('tabId');
                $tabs = Tabs::find(array("id = '$id'", "tab_id = '$tabId'"));
                foreach ($tabs as $val) {
                    $val->setActive(1);
                    $val->save();
                }
                $this->response->setContentType('application/json', 'UTF-8');
                $this->response->setJsonContent('ok');

                return $this->response;
            }
        } else {
            $this->response->redirect('');
        }
    }

    public function addNewLeftTabAction($id) {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $tab = new Tabs();
            $categoryId = Categories::minimum(array("column" => "category_id"));
            if (empty($categoryId)) {
                $category = new Categories();
                $category->setCategoryName('Нераспределенное');
                $category->save();
                $categoryId = Categories::minimum(array("column" => "category_id"));
            }
            $kimId = Kim::minimum(array("column" => "kim_id"));
            if (empty($kimId)) {
                $kim = new Kim();
                $kim->setKimHard('Прямой участок')
                        ->setKim('1.1')
                        ->save();
                $kimId = Kim::minimum(array("column" => "kim_id"));
            }
            $metallId = Metalls::minimum(array("column" => "id"));
            if (empty($metallId)) {
                $metall = new Metalls();
                $metall->setName('металл оц. 0.55')
                        ->setPrice('185')
                        ->setMass('8.5')
                        ->setOutPrice('245')
                        ->save();
                $metallId = Metalls::minimum(array("column" => "id"));
            }
            $productId = '';
            $alwaysInTable = file_get_contents('files/alwaysInTable.json');
            $product = new Products();
            $product->setProductName('Новое изделие')
                    ->setArticle(new RawValue('default'))
                    ->setCategoryId($categoryId)
                    ->setKim($kimId)
                    ->setMetall($metallId)
                    ->setAlwaysintable($alwaysInTable)
                    ->setCreated(new RawValue('default'))
                    ->setStatus(new RawValue('default'))
                    ->setTemplate(new RawValue('default'));
            //$product->setTableContent(new RawValue('default'));
            if ($product->save() == false) {
                $message = $product->getMessages();
                $this->response->setJsonContent(array($message[0]->__toString()));
                return $this->response;
            } else {
                $productId = $product->getProductId();
            }
            $tabs = Tabs::find("active = 1");
            foreach ($tabs as $val) {
                $val->setActive(0);
                $val->save();
            }

            $tab->setTabId('pr' . $id)
                    ->setProductId($productId)
                    ->setActive(1)
                    ->save();
            $this->response->setContentType('application/json', 'UTF-8');
            $this->response->setJsonContent('ok');
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }
    
    public function openSavedProductAction() {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $prId = $this->request->getPost('prId');
            $tab = $this->request->getPost('tab');
            $active = $this->request->getPost('active');
            $this->response->setContentType('application/json', 'UTF-8');
            $tabs = Tabs::findFirst(array("product_id = '$prId'"));
            if ($tabs) {
               $this->response->setJsonContent(false);
               return $this->response; 
            }
            if ('new' === $tab) {
                $tabObj = new Tabs();
                $tabId = Tabs::maximum(array("column" => "id"));
                $tabs = Tabs::find("active = 1");
                $activeMark = 0;
                if ('true' === $active) {
                    foreach ($tabs as $val) {
                        $val->setActive(0);
                        $val->save();
                    }
                    $activeMark = 1;
                }
                    $tabObj->setTabId('pr' . $tabId)
                           ->setProductId($prId)
                           ->setActive($activeMark)
                           ->save();
            } else {
                $tabs = Tabs::findFirst(array("tab_id = '$tab'"));
                $tabs->setProductId($prId)
                     ->save();
            }
            $this->response->setJsonContent(true);
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }
    
    public function closeTabAction() {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $id = $this->request->getPost('id');
            $tabId = $this->request->getPost('tabId');
            $nextActive = $this->request->getPost('nextActiveTab');
            $tabs = Tabs::findFirst(array("id = '$id'", "tab_id = '$tabId'"));
            $productObj = Products::findFirst($tabs->getProductId());
            if ($tabs != false) {
                if ($tabs->delete() == false) {
                    echo "Sorry, we can't delete the robot right now: \n";
                    $message = $tabs->getMessages();
                    $this->response->setJsonContent(array($message[0]->__toString()));
                    return $this->response;
                } else {
                    $changeActiveStatus = Tabs::findFirst(array("tab_id = '$nextActive'"));
                    $changeActiveStatus->setActive(1)->save();
                    'draft' === $productObj->getStatus() ? $productObj->delete() : true ;
                    $this->response->setContentType('application/json', 'UTF-8');
                    $this->response->setJsonContent('ok');
                    return $this->response;
                }
            }
        } else {
            $this->response->redirect('');
        }
    }

    public function closeRightTabAction() {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $id = $this->request->getPost('tabId');
            $orderID = $this->request->getPost('orderID');
            $nextActive = $this->request->getPost('nextActiveTab');
            $tabs = TabsRight::findFirst(array("id = '$id'", "order_id = '$orderID'"));
            $orderObj = Orders::findFirst($orderID);
            if ($tabs != false) {
                if ($tabs->delete() == false) {
                    echo "Sorry, we can't delete the robot right now: \n";
                    $message = $tabs->getMessages();
                    $this->response->setJsonContent(array($message[0]->__toString()));
                    return $this->response;
                } else {
                    $changeActiveStatus = TabsRight::findFirst(array("id = '$nextActive'"));
                    $changeActiveStatus->setActive(1)->save();
                    'draft' === $orderObj->getStatus() ? $orderObj->delete() : true ;
                    $this->response->setContentType('application/json', 'UTF-8');
                    $this->response->setJsonContent('ok');
                    return $this->response;
                }
            }
        } else {
            $this->response->redirect('');
        }
    }

    public function changeTabNameAction() {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $prId = $this->request->getPost('prId');
            $prName = $this->request->getPost('prName');
            $catId = $this->request->getPost('categoryId');
            $kimId = $this->request->getPost('kimId');
            $metallId = $this->request->getPost('metallId');
            $product = Products::findFirst(array("product_id = '$prId'"));
            if ($product == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($product->getMessages() as $message) {
                    echo $message, "\n";
                }
            } else {
                $product->setProductName($prName)
                        ->setCategoryId($catId)
                        ->setKim($kimId)
                        ->setMetall($metallId)
                        ->save();
                $this->response->setContentType('application/json', 'UTF-8');
                $this->response->setJsonContent('ok');

                return $this->response;
            }
        } else {
            $this->response->redirect('');
        }
    }

    public function getRightTabsListAction() {
        if ($this->request->isAjax() && $this->request->isGet()) {
            $tabs = TabsRight::find();
            if ($tabs == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($tabs->getMessages() as $message) {
                    echo $message, "\n";
                }
            } else {
                $this->response->setContentType('application/json', 'UTF-8');
                if (count($tabs)) {
                    $active = 'kim';
                    $orderId = '';
                    $tabsLi = '';
                    $tabArr = array();
                    $substObj = new Substitution();
                    foreach ($tabs as $val) {
                        $tabsList = array();
                        if ($val->getActive()) {
                            $tabsList['%ACTIVE%'] = 'active';
                            $active = 'or' . $val->getId();
                            $orderId = $val->getOrderId();
                        } else {
                            $tabsList['%ACTIVE%'] = '';
                        }
                        $tabsList['%ID%'] = 'or' . $val->getId();
                        $tabsList['%TABID%'] = $val->getId();
                        $tabsList['%ORDER_ID%'] = $val->getOrderId();
                        $order = Orders::findFirst($val->getOrderId());
                        $tabsList['%ORDER_NAME%'] = $order->getArticle();
                        $tabsLi .= $substObj->subHTMLReplace('tab_li_right.html', $tabsList);

                        $tabArr['kim'] = (object)[
                            'active' => '',
                            'orderId' => 'kim'
                        ];
                        $tabArr['or' . $val->getId()] = (object) [
                                    'active' => $val->getActive(),
                                    'orderId' => $val->getOrderId()
                                ];
                    }
                    $this->response->setJsonContent([
                        'tabs' => true,
                        'tabId' => $active,
                        'orderId' => $orderId,
                        'obj' => (object) $tabArr,
                        'html' => $tabsLi
                        ]
                    );
                    return $this->response;
                }

                $this->response->setJsonContent(array(false));

                return $this->response;
            }
        } else {
            $this->response->redirect('');
        }
    }

    public function getRightTabContentOrderDetailsAction() {
        if ($this->request->isAjax() && $this->request->isGet()) {
            $orderId = $this->request->get('orderId', 'int');
            $this->response->setContentType('application/json', 'UTF-8');
            $order = Orders::findFirst($orderId);
            if ($order == false) {
                $this->response->setJsonContent(['success' => false, 'error' => __METHOD__ . ':' . $order->getMessages()]);
                return $this->response;
            }
            $substObj = new Substitution();

            $rows = (array) json_decode($order->getOrderDescription());
            $status = $order->getStatus();
            'draft' === $status
                ? $rows['%SAVE_ORDER_IN_DB%'] = '<button type="button" class="btn btn-danger btn-sm" id="saveOrderInDB">Сохранить в БД</button>'
                : $rows['%SAVE_ORDER_IN_DB%'] = 'Сохранено в базе данных';
            $rows['%ORDER_NAME%'] = $order->getArticle();
            $discount = $order->getDiscount();
            $rows['%DISCOUNT%'] = $discount;

            $res = $substObj->subHTMLReplace('rightTabContent.html', $rows);
            $this->response->setJsonContent(['success' => true, 'html' => $res]);

            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

    public function getRightTabContentTableAction() {
        if ($this->request->isAjax() && $this->request->isGet()) {
            $orderId = $this->request->get('orderId');
            $this->response->setContentType('application/json', 'UTF-8');
            $order = Orders::findFirst($orderId);
            if ($order == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($order->getMessages() as $message) {
                    echo $message, "\n";
                }
                return false;
            }
            $res = array('%SECTIONS%' => '', '%WITHOUT_SECTIONS%' => '');
            $map = json_decode($order->getMap());
            $moveTo = array();
            $productObj = new ProductsController;
            $substObj = new Substitution();
            $currentSection = '';
            if ('' !== $map && null !== $map) {
                $orderObj = new OrderController;
                foreach ($map as $key => $val) {
                    if ('out' === $key && count($val)) {
                        $i = 1;
                        foreach ($val as $num => $obj) {
                            foreach ($obj as $productId => $quantity) {
                                $res['%WITHOUT_SECTIONS%'] .= $productObj->createProductInOrder($productId, $quantity, $orderId, $i, 'withoutSectionRow', $map, 'out');
                            }
                            $i++;
                        }
                    } else if ('out' !== $key) {
                        if (!count($val)) {
                            $currentSection = $key;
                        }
                        $res['%SECTIONS%'] .= '<tr class="orderTableSectionName" name="' . $key . '">
                        <th colspan="9"><span class="orderSectionName" contenteditable="true">' . $key . '</span></th><td><span class="glyphicon glyphicon-remove removeRowSection" name="' . $key . '" aria-hidden="true"></span></td></tr>';
                        if (count($val)) {
                            $i = 1;
                            foreach ($val as $num => $obj) {
                                foreach ($obj as $productId => $quantity) {
                                    $res['%SECTIONS%'] .= $productObj->createProductInOrder($productId, $quantity, $orderId, $i, 'orderTableSection', $map, $key);
                                }
                                $i++;
                            }
                        } else if (!count($val)) {
                            $moveTo[$key] = array();
                        }
                    }
                }
            }
            
            $this->response->setJsonContent(['html' => $substObj->subHTMLReplace('orderTable.html', $res), 'success' => true]);
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }
    
    public function changeActiveRightTabAction() {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $tabs = TabsRight::find("active = 1");
            foreach ($tabs as $val) {
                $val->setActive(0);
                $val->save();
            }
            if ($tabs == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($tabs->getMessages() as $message) {
                    echo $message, "\n";
                }
            } else {
                $id = $this->request->getPost('id');
                $tabs = TabsRight::find(array("id = '$id'"));
                foreach ($tabs as $val) {
                    $val->setActive(1);
                    $val->save();
                }
                $this->response->setContentType('application/json', 'UTF-8');
                $this->response->setJsonContent('ok');

                return $this->response;
            }
        } else {
            $this->response->redirect('');
        }
    }    

    private function getArticleTemplate() {
        return '<p>
                    <button type="button" class="btn btn-info btn-sm" id="createArticle">Создать артикул</button>
                    <button type="button" class="btn btn-success btn-sm" id="saveArticle">Сохранить</button>
                    <button type="button" class="btn btn-danger btn-sm" id="cancelArticleBtn">Отмена</button>
                    <span id="errorArticle" class="bg-danger"></span>
                </p>';
    }

    public function addNewRightTab($order_id) {
        $tabActive = TabsRight::find(array("active = 1"));
        foreach ($tabActive as $val) {
            $val->setActive(0);
            $val->save();
        }
        if ($tabActive == false) {
            echo "Мы не можем сохранить робота прямо сейчас: \n";
            foreach ($tabActive->getMessages() as $message) {
                echo $message, "\n";
            }
        } else {
            
        }
        $tab = new TabsRight;
        $tab->setOrderId($order_id)
                ->setActive('1')
                ->save();
        if ($tab == false) {
            return false;
        }

        return true;
    }

}
